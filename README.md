## Installation

#### This project uses yarn as package manager

```bash
$ yarn install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```

## .env variables

- UNSPLASH_ACCESS_KEY=

- AWS_ACCESS_KEY=
- AWS_SECRET_KEY=
- S3_BUCKET=
- S3_FOLDER=

- SENDWITHUS_API_KEY=
- SENDWITHUS_HOST=
- REGISTRATION_TEMPLATE=
- RESET_PASSWORD_TEMPLATE=

- POSTGRES_HOST=
- POSTGRES_PORT=
- POSTGRES_USER=
- POSTGRES_PASSWORD=
- POSTGRES_DATABASE=

- JWT_SECRET=
- JWT_LIFETIME=

#### This env variable 'SYNC_DATABASE' will setup the database the first time the project is run

- SYNC_DATABASE=

## NOTE: for some reason TypeORM sets the deletedAt field default value as the current timestamp, although is declared in the entities as NULL, it's needed that upon initializing the database set the deletedAt default value to NULL to let the API work properly. Once the database is up, avoid to send "SYNC_DATABASE" env variable since it will break the database anytime you run the project
