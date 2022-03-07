# Wallet Service POC

A [SOLID](https://khalilstemmler.com/articles/solid-principles/solid-typescript/) wallet service built with TypeScript using [clean architecture](https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/) and [DDD best practices](https://khalilstemmler.com/articles/domain-driven-design-intro/) inpired on [DDD-forum](https://github.com/stemmlerjs/ddd-forum).

### TODO add gif

## My objectives with this POC:

- learn GraphQL+Apollo and how to plug the domain useCases to the queries and mutations
- learn Prisma and how to use it's schema on our toDomain and toPersistence mappers
- learn QLDB (ledger database)

## Built with

- [Typescript](https://www.typescriptlang.org/)
- [GraphQL](https://graphql.org/)
- [Apollo Server](https://www.apollographql.com/)
- [Prisma](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/)
- [QLDB (Ledger Database)](https://aws.amazon.com/qldb/)

## Running the project

0. Prerequisites

   - running postgreSQL
   - working AWS Profile configured on environment
   - QLDB ledger named 'wallet-dev' configured on AWS console

1. install dependencies

```bash
yarn install
```

2. copy .env.template file and edit it (working AWS profile needed)

```bash
cp .env.template .env
```

3. run Prisma migrations to initialize local db

```bash
yarn db:migrate
```

4. run project

```bash
yarn start:dev
```

GraphQL endpoint http://localhost:3000/graphql.

## Project Structure

### src/modules/\*

Subdomains of the application.

### src/modules/\*/domain/\*

Domain objects where business logic lives.
In an ideal world, non-tech/Product people should be able to read those files and see the key business rules defined for each domain object.

### src/modules/\*/useCases/\*

useCases that will instanciate the domaing objects from memory, implement the business logic from the domain objects and persist changes if necessary and or just return some data.
In an ideal world, non-tech/Product people should be able to read those files and understand see all which use case(s) implements each user story.
