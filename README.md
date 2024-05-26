# BNC ADMIN

This project created for internal BNC works whenever there is new transfer approver need to be approve or reject the transfer based on the acknowledgment of approver about the transaction

## File Structure

#### Top-level directories

* [backend](backend/) - Backend Services using
* [frontend](frontend/) - Frontend Services
* [worker-email](worker-email/) - Worker email to send email

## Running

To run the full-suite of IPG applications, there are few dependencies, which are:

* PostgreSQL
* RabbitMQ
* Go (at least 1.18.x)
* Node.JS (v18.17.0) tooling (`npm, yarn`)

1. To set the initial PostgreSQL and RabbitMQ deployment, the easiest way is to
use `docker` or `docker-compose` and use the following script:

go to root folder, there will be a file called docker-compose.yml:
run the following command:

```
docker compose up
```

Here, we are using a local directory `./volumes` to mount the data created by
the `rabbitmq` and `postgres`.

2. The next step is to
run the migrations to initialize the schema for the `postgres` database. First, you need to create database manually using

```
docker exec -it local-postgres-1 /bin/sh -c "createdb -U postgres <database_name>"
```

Then, once you have created the databases, the next step is to run the application for backend and entities automatically loaded

The steps for Go executables and Node.js executables are slightly different,

3. After setting up `rabbitmq` and `postgres`, we can start running the applications.
The order in which the application should be started is this way:

    1. Frontend Service - ([frontend/](frontend/))
    2. Backend Service - ([backend/](backend/))
    3. Worker Mailer - ([worker-mailer/](worker-mailer/))

#### Worker Mailer

Worker mailer follows the standard way of running `go` applications, which is to
first initialized the config file, by doing:

```
cd worker-mailer
cp .env.example .env
```

and put the appropriate values on the `.env`. Then, run the go file
as follows:
(to run this command go version MUST 1.18 or newest)

```
go run main.go
```

Later We have three different Worker, you can use tmux, or other multiplexer to run
all of them in different sessions

#### Backend Services

All of the services are in Node.js, and to run it, the simplest way is to execute
`yarn start:dev`. It will be reading values from environment variables, here the samples of env variable:

```sh
DATABASE_HOST='change me'
DATABASE_PORT='change me'
DATABASE_USERNAME='change me'
DATABASE_PASSWORD='change me'
DATABASE_NAME='change me'
RABBIT_MQ_PATH='change me'
JWT_TOKEN_EXPIRED='change me'
JWT_SECRET='change me'
```

#### Front end

The easiest way to run the web applications is to use `yarn`. but before that we need to change the env variable API into our backend services host Alternatively,
you can also use the following scripts to run it:

```shell
yarn dev
```

6. Go to your browser and access the website, which will then bring you
to the loading page accordingly.

## Notes

#### Commit Validation

we have commit validation using husky. to validate the commit message to be proper.
for further development. we need to check pre-push if someone tried to push to main repo. error message will be displayed
how to run it:

* install husky in root folder using yarn

```sh
yarn install
```

* try make a commit to validate the commit validation is working or not

```sh
git commit -m "Keep calm and commit" --allow-empty
```

### Tech Stack

* PostgreSQL
* RabbitMQ
* Typescript
* Go (at least 1.18.x)
* Node.JS (v18.17.0) tooling (`npm, yarn`)
* Next JS
* Ant Design
* Tan Query
* NestJS
* Husky

### Workflow

* [Workflow](https://whimsical.com/bnc-2Z94b2Ht2BijvzGL1WdDNN)

* [Databases](https://dbdiagram.io/d/BNC-664e2d4af84ecd1d22e2830e)

#### Changes on the README

If you feel like you need to propose any changes on this README documents, please feel free to do the PR


### P.S

Docker for deployment file need still configured and not done yet