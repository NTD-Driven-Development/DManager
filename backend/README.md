# Dormiday Server Startup

## Setup

Copy .env.example to .env

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:8001`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build and start the application for production:
(before ``` start ``` must be run ``` build ```)



```bash
# npm
npm run build
npm start

# pnpm
pnpm run build
pnpm start

# yarn
yarn build
yarn start
```

## Test

Run all test files on Dormiday Server.


```bash
# npm
npm run test

# pnpm
pnpm run test

# yarn
yarn test
```