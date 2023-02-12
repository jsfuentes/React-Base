# React Base

This base project is a custom React Redux Tailwind Typescript frontend.

- React v18, [Tailwind v3](https://tailwindcss.com/), [Redux Toolkit](https://redux-toolkit.js.org/), Webpack v5, and Typescript v4
- Form Library [react-hook-form](https://react-hook-form.com/)
- Default frontend file structure with folder for types, contexts, and api calls
- Default components and pages including a Button, Homepage, Login, and 404 Page
- Icon library [Boxicons](https://boxicons.com)
- `react-router` v6 setup with Code Splitting and Lazy Loading
- `debug` setup offering a better color coded version of console.log
- `react-toastify` setup
- conf folder with a similar interface to the npm package `config`
- blazing fast `esbuild-loader` webpack config beating babel-loader by 80%
- Redux Error Manager with redux actions to standardize error logging

And code for the following services, just add secrets to `.prod.env` for the backend and `assets/conf/default.js` and `assets/conf/producation.js` for the frontend:

- Logrocket or Posthog (assets/src/app.tsx)
- Sentry (assets/src/app.tsx)
- Google Login (assets/conf/default.js)

## Initial Setup

```
npm i
```

## Running

wip

## Deployment

I recommend [Render](https://render.com) because of their generous free plan. You get a free 750 hours of shared server time a month and free 90 days of a Postgres DB.
