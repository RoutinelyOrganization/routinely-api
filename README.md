# Routinely API

![version](https://img.shields.io/github/package-json/v/RoutinelyOrganization/Routinely.API?style=flat-square&labelColor=f2f2f2&color=white)
![license](https://img.shields.io/github/license/RoutinelyOrganization/Routinely.API?style=flat-square&labelColor=f2f2f2&color=white)
![main tool](https://img.shields.io/badge/Nest_JS-f2f2f2?logo=nestjs&logoColor=db1737&style=flat-square)
![dev tool](https://img.shields.io/badge/Docker-f2f2f2?logo=docker&logoColor=blue&style=flat-square)

## Requirements

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Make a clone of the repository
Create a folder on your computer and clone the repository:
```bash
git clone https://github.com/RoutinelyOrganization/routinely-api.git
```

## Setup

- Copy file .env.example from project root
- Rename it to .env
- Fill up the info:

```env
# Replace the bracketed examples "[Database username]" with their final value "root"

PORT=[Server port]
# e.g: 3000

NODE_ENV=[Current application environment]
# e.g: development

SALT_SESSION=[Secret string for hashing session tokens]
# e.g: my_secret_string

SALT_DATA=[Secret string for hashing sensitive data]
# e.g: my_new_secret_string

SALT_ROUNDS=[Salt rounds for password hashing]
# e.g: 10

EMAIL_HOST=[Email host name]
# e.g: sandbox.smtp.mailtrap.io

EMAIL_PORT=[Email port]
# e.g: 2525

EMAIL_USERNAME=[Email user name]
# e.g: my_email_user_name

EMAIL_PASSWORD=[Email password]
# e.g: my_email_password

FROM_EMAIL=[Email adress]
# e.g: equipe@routinely.com

POSTGRES_USER=[Postgres user]
# e.g: root

POSTGRES_PASSWORD=[Postgres password]
# e.g: example

POSTGRES_DB=[Postgres database name]
# e.g: api-dev

POSTGRES_HOST=[Postgres host]
# e.g: localhost

POSTGRES_PORT=[Postgres port]
# e.g: 5432

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
# ! This value does not need to be changed, use it as is.
```

Recommended email service: [Mailtrap](https://mailtrap.io/)

## Install dependencies
After cloning and whenever you synchronize the repository, run the command below to keep the dependencies up to date:
```bash
npm install
```

## Running the app
**Development mode:**
This command runs all the commands needed for docker configuration
```bash
npm run dev
```

**Development in minimal mode:**<br>
You must run normal mode at least once before using this mode
```bash
npm run dev:min
```

**Production mode:**
```bash
# build
npm run build

# start
npm run start:prod
```

## Test

**unit tests:**
```bash
npm run test
```

**e2e tests:**
```bash
npm run test:e2e
```

## Support
[Read more here](https://github.com/RoutinelyOrganization).

## Stay in touch
Author - [Routinely's backend team](https://github.com/RoutinelyOrganization)

## License


