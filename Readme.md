<div align="center">

<img src="https://swcrafters.fra1.digitaloceanspaces.com/Assets/Logo_software_crafters.png" alt="Software Crafters" width="200" height="400"/>

### Mentoría de [Software Crafters®](https://softwarecrafters.io/mentoria)
#### El código importa, pero el contexto más
</div>


# Backend Template

[![Node.js](https://img.shields.io/badge/Node.js-24-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



Production-ready backend template with hexagonal architecture.

## Stack

- Node.js 24 / TypeScript 5.9
- Express 5
- MongoDB 7
- Pino (structured logging)
- Jest (unit, integration, e2e)

## Architecture

```
src/
├── main.ts                      # Entry point
├── health/                      # Example module
│   ├── domain/                  # Entities, value objects, repositories
│   ├── application/             # Use cases
│   └── infrastructure/          # Adapters (MongoDB, HTTP)
└── shared/
    ├── domain/                  # DomainError, value objects
    ├── application/ports/       # Logger port
    └── infrastructure/          # Factory, server, adapters
```

## Quick Start

Prerequisites: Node.js 24+, MongoDB

```bash
# Install
npm install

# Configure
cp .env.example .env

# Run (development)
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Development server with hot reload |
| `npm test` | Run all tests |
| `npm run test:unit` | Unit tests only |
| `npm run test:integration` | Integration tests only |
| `npm run test:e2e` | E2E tests only |
| `npm run build` | Build for production |
| `npm run start:prod` | Run production build |

## Testing

Tests are colocated with the module they test:

```
module/tests/
├── unit/           # Domain + UseCase tests (no dependencies)
├── integration/    # Repository tests (real MongoDB)
└── e2e/            # HTTP endpoint tests (full stack)
```

## License

MIT
