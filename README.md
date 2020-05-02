# React-Base

create-react-app with tailwindcss and more:

- basic React Router routing with code splitting and loading with React Suspense
- some basic components like a Navbar, LazyImage, and Footer
- proxy routing to localhost:3001 (package.json)
- absolute path importing (jsconfig.json)
- config files with a `.get` and `.has` wrapper similar to the config npm package (conf)
- React toastify setup enabling `toast(` call anywhere

## Running

- `yarn`
- `yarn build` for some reason need to precompile tailwind
- `yarn start` for dev

## Editing

- Change the url in conf/prod to change the api hit in production.
- Add a Sentry DNS to default.js to enable Sentry
- Disable debugging in prod in index.js

## Building

- `yarn build` to build static assets for prod
