# best Movie of all time Server

## Requirements

- Node.js v20.12.2
- npm v10.5.2

## Installation

1. Clone the repository:
   [Best Movie of All time](https://github.com/mohamedelraghy/best-movie-of-all-time.git)

```bash
$ git clone https://github.com/mohamedelraghy/best-movie-of-all-time.git
```

2. Install the dependencies:

```bash
$ cd best-movie-of-all-time
$ npm i
```

## Running the app

- copy config/.env.example and rename it to config/.env.development
- replace environment variables values with you values
- Configure the database: Update the database environment variables with your database credentials.
- Configure the AWS: Update the S3 BUCKET environment variables with your AWS configuration.
- Configure a web service at firebase: Update the firebase environment variables with your configuration.

1. Development mode

```bash
$ cp .env.example .env.development

# development
$ npm run start

# watch mode
$ npm run start:dev
```

2 - production mode

```bash
$ cp .env.example .env.production

# build app
$ npm run build

# production mode
$ npm run start:prod
```
