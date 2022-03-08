# Wallet Service POC

A [SOLID](https://khalilstemmler.com/articles/solid-principles/solid-typescript/) wallet service built with TypeScript using [clean architecture](https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/) and [DDD best practices](https://khalilstemmler.com/articles/domain-driven-design-intro/) inspired on [DDD-forum](https://github.com/stemmlerjs/ddd-forum).

![DDDwallet](https://user-images.githubusercontent.com/17117431/157273685-07c1ce62-a38b-469d-a6cd-34f436444031.mp4)

## My objectives with this POC:

- learn GraphQL+Apollo and how to plug the domain useCases to the queries and mutations
- learn Prisma and how to use it's schema on our toDomain and toPersistence mappers
- learn QLDB (ledger database)
- document with my own words what I believe are the main advantages of this software design approach

## Built with

- [Typescript](https://www.typescriptlang.org/)
- [GraphQL](https://graphql.org/)
- [Apollo Server](https://www.apollographql.com/)
- [Prisma](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/)
- [QLDB (Ledger Database)](https://aws.amazon.com/qldb/)

## Project Structure And Principles

### src/modules/\*

**Subdomains of the application**. Groupings of business logic that makes sense in and of itself.

### src/modules/\*/domain/\*

**Domain objects** (aggregate roots and value objects) where **business logic lives**.

In an ideal world, non-tech/Product people should be able to read those files and see the key business rules defined for each domain object.
eg. for a given wallet, you can add funds or subtract funds.

### src/modules/\*/useCases/\*

useCases that will:

- instantiate the domain objects from memory
- execute the business logic from the domain objects
- persist changes if necessary
- return some data as a DTO.

In an ideal world, non-tech/Product people should be able to read those useCase names and understand/see how they implement each **user story**. A user story may need one or more useCases to be satisfied.

### src/modules/\*/dtos/\*

Api contracts between frontend and backend. In a REST api, this would be the objects sent to the frontend.

Graphql adds a new layer on top of the DTO that allows the frontend to query only the fields needed.

### src/modules/\*/mappers/\*

**Adapters that will strongly type anything coming in and out of our main application logic.** eg. Database <-> application -> Frontend DTO.

This helps a lot with evolving the database schemas as the developer has to actively decide how to implement new fields and disencorages changing field types.

### src/modules/\*/repos/\*

Empty interfaces that are going to describe the contract between the service (database/third party services/etc) and the application.

This is going to facilitate testing and also **prevent that service specific logic leaks to the application layer**.

## src/modules/\*/repos/\*/implementations/\*

Actual implementations of the services (database/third party services/etc) that are going to be injected at runtime.

## Possible next steps:

- useCase that verifies that postgreSQL data has not been tempered by checking against QLDB ledger.
- use [TypeGraphQL](https://typegraphql.com/) to define the graphQL schemas in the same place as the DTOs (inline with decorators)
- authentication middleware with apollo service
- authorization living inside the useCase to prevent consumers of the useCase from forgetting to authorize.
- move graphql queries/mutations that are relevant to a subdomain to the respective src/modules/\*/infra/http/graphql/index.ts location
- useCase tests injecting mock implementations of the repos
- docker setting up whole environment
- improve error handling by strong typing all errors with the Result class and at the graphQL level

## Running the project

```bash
# 0. Prerequisites
# - running postgreSQL
# - working AWS Profile configured on environment
# - QLDB ledger named 'wallet-dev' configured on AWS console

# 1. install dependencies
$ yarn install

# 2. copy .env.template file and edit it (working AWS profile needed)
$ cp .env.template .env

# 3. run Prisma migrations to initialize local db
$ yarn db:migrate

# 4. run project
$ yarn start:dev
# GraphQL endpoint http://localhost:3000/graphql.
```

## Links

[How Do I Know I Need a Ledger Database? An Introduction to Amazon QLDB](https://www.youtube.com/watch?v=blIku5CWYzU)
[Amazon QLDB Double Entry Sample App](https://github.com/aws-samples/amazon-qldb-double-entry-sample-java)
