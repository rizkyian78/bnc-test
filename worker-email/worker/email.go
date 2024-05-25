package worker

import (
	"fmt"

	"gopkg.in/gomail.v2"
)

type Handler struct {
	d    *gomail.Dialer
	from string
	conn gomail.SendCloser
}

func NewHandler(port int, smtp, username, password string) (*Handler, error) {

	// Set up SMTP dialer
	d := gomail.NewDialer(smtp, port, username, password) // Replace with SMTP server details

	// Send email
	conn, err := d.Dial()

	if err != nil {
		fmt.Println("Failed to send email:", err)
		return &Handler{}, err
	}

	return &Handler{
		d:    d,
		from: username,
		conn: conn,
	}, nil
}

func (h *Handler) Send(toEmail, subject, text string) error {

	email := gomail.NewMessage()
	email.SetHeader("From", h.from)     // Replace with sender's email address
	email.SetHeader("To", toEmail)      // Replace with recipient's email address
	email.SetHeader("Subject", subject) // Email subject
	email.SetBody("text/plain", text)   // Email body

	if err := h.d.DialAndSend(email); err != nil {
		fmt.Println("Failed to send email:", err)
		return err
	}
	return nil
}
