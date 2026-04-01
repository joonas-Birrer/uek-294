# TodoJonas

Angular client for the UEK-294 todo management LB.

## Git workflow

This project follows the UEK-294 Gitflow constraints.

- Main branch: `main`
- Release branches: `X.Y.Z` (for example `1.0.0`)
- Feature branches: `fb-<issue-number>` (for example `fb-5`)

Detailed process is documented in [`docs/git-workflow.md`](docs/git-workflow.md).

## Prerequisites

- Node.js + npm
- Docker + Docker Compose plugin

## Install

```bash
npm install
```

## Start backend services

```bash
docker compose -f /home/jonas/uek-294/abgabe/compose/compose.yml up -d
docker ps
```

Expected images:

- `decheritservices/todo-api:v1.1.51` on `http://localhost:3001`
- `decheritservices/sample-uek-keycloak:v1.1.52` on `http://localhost:38081`

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open `http://localhost:4222/`.

## Login accounts

- Keycloak admin: `admin / admin`
- App user: `user / user`
- App admin: `admin / admin`

## Implemented routes

- `/` -> redirect to `/home`
- `/home`
- `/todo` -> redirect to `/todo/list`
- `/todo/list` (guarded)
- `/todo/new` (guarded)
- `/todo/edit/:id` (guarded, inactive deep-link redirect for non-admin)
- `**` -> page not found

## OpenAPI generation

```bash
npm run all-api-gen-todo
```

Config file: `ng-openapi-gen-todo.json`

## Build

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Gitflow execution

1. Create issue and assign it to milestone.
2. Create release branch (`1.0.0`, `1.1.0`, ...).
3. Create feature branch `fb-<issue-number>` from active release branch.
4. Open PR from feature branch to release branch.
5. Merge release branch to `main` when milestone issues are closed and app is runnable.

Detailed rules are in `docs/git-workflow.md` and `CONTRIBUTING.md`.

## Personal project conclusion

The final project conclusion will be added to this README on a dedicated issue before final hand-in.
