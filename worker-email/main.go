package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"rizkyian78/worker-email/worker"
	"strconv"
	"syscall"

	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
)

func processQueue(rawJSON string, h *worker.Handler) {
	fmt.Println("incoming message: " + rawJSON)
	var payload *worker.Payload
	err := json.Unmarshal([]byte(rawJSON), &payload)
	if err == nil {
		h.Send(payload.Data.Email, "BNC OTP Verification", fmt.Sprintf("Here your otp: %s", payload.Data.Otp))
		return
	}
	fmt.Println("got erro")
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	conn, err := amqp.Dial(os.Getenv("RABBIT_MQ_PATH"))
	if err != nil {
		log.Fatalf("%s: %s", "failed to initialize", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("%s: %s", "failed to connect", err)
	}
	defer ch.Close()

	mailerPort, err := strconv.Atoi(os.Getenv("MAILER_PORT"))
	if err != nil {
		log.Fatalf("failed to get env port")
	}

	emailHandler, err := worker.NewHandler(mailerPort, os.Getenv("MAILER_HOST"), os.Getenv("MAILER_USERNAME"), os.Getenv("MAILER_PASSWORD"))
	if err != nil {
		log.Fatalf("%s: %s", "failed to connect mailer", err)
	}

	q, err := ch.QueueDeclare(
		"register.email", // queue name
		false,            // durable
		false,            // delete when unused
		false,            // exclusive
		false,            // no-wait
		nil,              // arguments
	)

	if err != nil {
		log.Fatalf("%s: %s", "failed to get queue", err)
	}

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		log.Fatalf("%s: %s", "failed to consume", err)
	}
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, syscall.SIGINT, syscall.SIGTERM)

	fmt.Println("Listening to consumer", q.Name)

	for {

		select {

		case payload := <-msgs:
			processQueue(string(payload.Body), emailHandler)

		case <-signalCh:
			fmt.Println("Gracefully stop")
			os.Exit(0)

		}

	}
}
