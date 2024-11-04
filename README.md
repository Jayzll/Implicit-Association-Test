# Implicit Association Test

Bootstrapped from https://reactrouter.com/dev/guides/start/installation.

## Prerequisites

- Install [Node.js](https://nodejs.org/en).
- Install [pnpm](https://pnpm.io/installation).
- Install Node modules with:
  ```sh
  pnpm i
  ```

## Development

Run the dev server:

```sh
pnpm dev
```

## Deployment

First, build your app for production:

```sh
pnpm build
```

Then run the app in production mode:

```sh
pnpm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `pnpm build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.
