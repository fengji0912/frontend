# ORKG Ask

Frontend repository of ORKG Ask, as deployed on https://ask.orkg.org

## Getting Started

1. Clone this repository:

```bash
git clone git@gitlab.com:TIBHannover/orkg/orkg-ask/frontend.git
```

2. Go to the directory:

```bash
cd frontend
```

3. Install the dependencies:

```bash
npm install
```

4. Copy the file `default.env.local` to `.env.local` configure the values yourself:

```bash
cp default.env.local .env.local
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the ORKG Ask frontend. By default the production environment of the ORKG Ask backend is used, so you don't need to run additional services to get started with frontend development.

## Technologies

ORKG Ask is using a modern stack of technologies, as listed below. We use [Next.js](https://nextjs.org/docs) as our main framework. Specifically, we use the latest _app router_ features, including server components. We use the [colocation pattern](https://nextjs.org/docs/app/building-your-application/routing/colocation) for file organization. For more details regarding the setup.

- Programming language: [TypeScript](https://www.typescriptlang.org/)
- Framework: [Next.js](https://nextjs.org/)
- UI library: [NextUI](https://nextui.org/)
- Styling: [Tailwind](https://tailwindcss.com/)
- Fetch API: [Ky](https://github.com/sindresorhus/ky)
- Fetching library: [SWR](https://swr.vercel.app/)
- Global state management: [React Context](https://react.dev/reference/react/createContext)
- URL statement management: [nuqs](https://nuqs.47ng.com/)
- Icons: [FontAwesome](https://fontawesome.com/)
- Animations: [Framer Motion](https://www.framer.com/motion/)
- Pre-commit linting: [Husky](https://typicode.github.io/husky/)
- Releasing and changelog generation: [semantic-release](https://github.com/semantic-release/semantic-release)
- Runtime env variables: [next-runtime-env](https://github.com/expatfile/next-runtime-env)

## Contributing

Ensure your linting setup picks up the rules from `.eslintrc.json`. We use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). To help you generate correct commits, you can use `npm run commit` instead of `git commit`.

Then code is pushed to the `main` branch, automatically a release is created, also the version number and the changelog are updated automatically.

### TypeScript

The codebase is written in TypeScript. We use the type definitions from the Pocketbase backend and the API directly in the code. In order to regenerate those definitions, you can use the following commands:

API

```bash:
npm run openapi-typescript [backend-openapi.json]
```

Pocketbase

```bash:
npm run pocketbase-typegen [/pocketbase/data/data.db]
```
