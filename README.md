# Nest Kafka Event-Driven Demo

An event-driven backend built with NestJS, Apache Kafka, and Nx. This project demonstrates how a user-creation event can move through independent services, including failure handling through a dead-letter queue (DLQ).

## What This Demonstrates

- NestJS microservices communicating through Kafka events
- An API gateway that publishes a `user_created` event
- A notification service that consumes the event
- Failure handling by publishing failed messages to `user_created_dlq`
- An Nx monorepo structure for running and testing multiple services
- Kafka running locally with Docker Compose

## Architecture

```text
HTTP client
    |
    v
API Gateway (:3000)
    |
    | user_created
    v
Kafka (:9092)
    |
    v
Notification Service
    |
    | processing failure
    v
user_created_dlq
```

The notification service intentionally simulates a downstream failure so the DLQ flow can be observed in the service logs.

## Tech Stack

- [NestJS](https://nestjs.com/) 11
- [Apache Kafka](https://kafka.apache.org/) 3.9
- [KafkaJS](https://kafka.js.org/)
- [Nx](https://nx.dev/) 23
- TypeScript
- Docker Compose

## Project Structure

| Project | Responsibility |
| --- | --- |
| `api-gateway` | HTTP entry point; publishes `user_created` |
| `notification-service` | Consumes `user_created` and publishes DLQ events when processing fails |
| `api-gateway-e2e` | End-to-end tests for the API gateway |
| `notification-service-e2e` | End-to-end tests for the notification service |
| `packages/` | Shared workspace packages |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Docker Desktop with Docker Compose

### Install dependencies

```bash
npm install
```

### Start Kafka

```bash
docker compose up -d
```

Kafka will be available at `localhost:9092`.

### Start the services

Run each service in a separate terminal:

```bash
npx nx serve api-gateway
```

```bash
npx nx serve notification-service
```

The API gateway listens on `http://localhost:3000`. The notification service runs as a Kafka microservice and does not expose an HTTP port.

## Try the Event Flow

Send a request to publish a user-created event:

```bash
curl http://localhost:3000/create-user
```

The API returns the published user payload. In the notification service logs, you can then observe:

1. The `user_created` event being received.
2. The simulated processing failure.
3. A `user_created_dlq` event being published.
4. The DLQ event being consumed and logged.

## Useful Commands

```bash
# Build both services
npx nx run-many -t build -p api-gateway,notification-service

# Run the end-to-end projects
npx nx run api-gateway-e2e:e2e
npx nx run notification-service-e2e:e2e

# Visualize the Nx project graph
npx nx graph
```

Stop Kafka when finished:

```bash
docker compose down
```

## Portfolio Notes

This project is intentionally small and focused on demonstrating event-driven design: decoupled services, Kafka topic communication, consumer groups, and a practical failure path using a dead-letter queue.

## License

This project is licensed under the MIT License.
