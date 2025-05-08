# Receivables Flow

A comprehensive application for managing receivables, built with NestJS, TypeORM, and SQLite.

## Table of Contents

- [Receivables Flow](#receivables-flow)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Technologies](#technologies)
    - [Core Technologies](#core-technologies)
    - [Additional Dependencies](#additional-dependencies)
    - [Development Tools](#development-tools)
  - [System Requirements](#system-requirements)
  - [Project Structure](#project-structure)
  - [Environment Setup](#environment-setup)
    - [Sample Environment File:](#sample-environment-file)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
  - [Database Migrations](#database-migrations)
  - [API Documentation](#api-documentation)
  - [Testing](#testing)
  - [Docker Deployment](#docker-deployment)
    - [Docker Environment Variables](#docker-environment-variables)
  - [Contributing](#contributing)

## Overview

Receivables Flow is a backend service designed to manage receivables, payables, and assignors. The application provides RESTful API endpoints and integrates with RabbitMQ for message processing.

## Technologies

### Core Technologies
- **Runtime**: Node.js
- **Framework**: NestJS (v10)
- **Language**: TypeScript (v5)
- **Database**: SQLite
- **ORM**: TypeORM (v0.3)
- **Package Manager**: pnpm

### Additional Dependencies
- **API Documentation**: Swagger/OpenAPI (@nestjs/swagger)
- **Authentication**: JWT (@nestjs/jwt, passport-jwt)
- **Configuration**: @nestjs/config
- **Message Queue**: RabbitMQ (amqplib, amqp-connection-manager)
- **File Handling**: Multer

### Development Tools
- **Testing**: Jest, Supertest
- **Linting**: ESLint, Prettier
- **Build Tools**: ts-node, ts-jest

## System Requirements

- Node.js (v16+)
- pnpm (v8+)
- SQLite (v3)
- RabbitMQ (optional, for messaging functionality)

## Project Structure

```
├── src/
│   ├── app.module.ts        # Main application module
│   ├── main.ts              # Application entry point
│   ├── assignor/            # Assignor module
│   ├── auth/                # Authentication module
│   ├── middleware/          # Custom middleware
│   ├── payable/             # Payable module
│   ├── shared/              # Shared modules and utilities
│   │   ├── database/        # Database configuration
│   │   ├── dto/             # Shared DTOs
│   │   └── services/        # Shared services
│   └── user/                # User module
├── test/                    # E2E tests
├── seed/                    # Database seeding
├── data/                    # Database files
├── ui/                      # Frontend application
├── docs/                    # Documentation files
├── uploads/                 # File uploads directory
└── docker-compose.yml       # Docker configuration
```

## Environment Setup

The application uses environment-specific configuration files:

- `.env.development` - Development environment settings
- `.env.production` - Production environment settings

### Sample Environment File:

```env
DATABASE_URL="./data/dev.db"    # SQLite database path
JWT_SECRET="your-jwt-secret"    # Secret for JWT token signing
PORT=3333                       # Application port
RABBITMQ_ENABLED=true           # Enable/disable RabbitMQ integration
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd receivables-flow
```

2. Install dependencies:
```bash
pnpm install
```

3. Create your environment file (use the sample above as a guide):
```bash
cp .env.development.example .env.development
```

4. Set up the database:
```bash
pnpm migration:run
```

## Running the Application

### Development Mode

```bash
# Standard development mode
pnpm start

# Watch mode (auto-reload on changes)
pnpm start:dev

# Debug mode
pnpm start:debug
```

### Production Mode

```bash
# Build the application
pnpm build

# Run in production mode
NODE_ENV=production pnpm start:prod
```

## Database Migrations

The application uses TypeORM for database migrations:

```bash
# Generate a new migration
pnpm migration:generate

# Run pending migrations
pnpm migration:run

# Revert the last migration
pnpm migration:revert

# Seed the database with sample data
pnpm seed
```

## API Documentation

The API is documented using Swagger. Once the application is running, you can access the interactive API documentation at:

```
http://localhost:<PORT>/
```

Replace `<PORT>` with the port number configured in your environment file (default: 3333 for development).

## Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage reporting
pnpm test:cov

# Run end-to-end tests
pnpm test:e2e
```

## Docker Deployment

The application includes Docker configuration for easy deployment:

```bash
# Start the application with Docker Compose
docker-compose up -d

# Stop containers
docker-compose down
```

Docker will set up:
- The NestJS application
- RabbitMQ for message queueing

### Docker Environment Variables

When using Docker, the application uses the `.env.production` file by default.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request
