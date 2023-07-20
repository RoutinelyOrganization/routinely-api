<p align="center">
  <a href="https://github.com/RoutinelyOrganization" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Routinely Logo" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/RoutinelyOrganization/Routinely.API" target="_blank">Routinely.API</a> - initial setup.
</p>

<p align="center">
  <a href="https://github.com/RoutinelyOrganization/Routinely.API" target="_blank">
    <img src="https://img.shields.io/github/license/RoutinelyOrganization/Routinely.API" alt="License" />
  </a>
  <a href="https://github.com/RoutinelyOrganization/Routinely.API" target="_blank">
    <img src="https://img.shields.io/badge/node--js-success" alt="Node version" />
  </a>
</p>

## Description

[Routinely](https://github.com/RoutinelyOrganization/Routinely.API) application TypeScript intial setup.

## Installation

```bash
$ npm install
```

## Requirements

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Setup

- Copy file .env.example from project root
- Rename it to .env
- Fill up the info: <br/>

```
DATABASE_URL: Postgres connection url
e.g: "postgresql://root:example@localhost:54320/api-dev?schema=public"

POSTGRES_USER: Postgres user
e.g: root

POSTGRES_PASSWORD: Postgres password
e.g: example

POSTGRES_DB: Postgres database name
e.g: api-dev

PORT: Server port
e.g: 3000

SALT_DATA: Secret string for password hashing
e.g: "my_secret_string"

SALT_ROUNDS: Salt rounds for password hashing
e.g: 10

EMAIL_HOST:Email host name
e.g: sandbox.smtp.mailtrap.io

EMAIL_PORT: Email port
e.g: 2525

EMAIL_USERNAME: Email user name
e.g: my_email_user_name

EMAIL_PASSWORD: Email password
e.g: my_email_password

FROM_EMAIL: Email adress
e.g: equipe@routinely.com
```

Recommended email service: [Mailtrap](https://mailtrap.io/)

## Running the app

```bash
# development watch mode
$ npm run dev

# development
$ npm run start

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

[Read more here](https://github.com/RoutinelyOrganization).

## Stay in touch

- Author - [Routinely](https://github.com/RoutinelyOrganization)

## License

Routinely.API is [MIT licensed](LICENSE).
