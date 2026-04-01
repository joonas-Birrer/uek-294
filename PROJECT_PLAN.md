# PROJECT_PLAN

## Repository Gitflow Rules

- Long-lived branches: `main`, `develop`
- Release branches: `release/<version>`
- Feature branches: `fb-<issue-number>-<short-slug>`
- Merge flow:
  1. Feature branch -> `develop`
  2. Milestone complete -> `release/<version>`
  3. Release PR -> `main`
  4. Tag on `main`: `v<version>`
  5. Back-merge `release/<version>` -> `develop`

## Labels

- `type:feature`
- `type:bug`
- `type:docs`
- `type:chore`
- `area:auth`
- `area:routing`
- `area:todo`
- `area:ui`
- `area:infra`
- `priority:high`
- `priority:medium`

## Milestones

### Milestone 1.0.0 - Foundation + Auth + Basic Routing

Goal: running base app with login/logout, guarded routes, and list/new/edit pages reachable by route.

| Issue | Title | Labels | Estimate | Spent | Feature Branch | Status |
|---|---|---|---|---|---|---|
| #1 | Compose setup for Keycloak + Todo API | type:chore, area:infra, priority:high | 1h 30m | 1h 25m | `fb-1-compose-setup` | done |
| #2 | Configure Angular dev port 4222 + proxy routes | type:chore, area:infra, priority:high | 1h 00m | 55m | `fb-2-angular-port-proxy` | done |
| #3 | Implement auth service and token storage | type:feature, area:auth, priority:high | 2h 00m | 2h 10m | `fb-3-auth-service-token` | done |
| #4 | Implement client routes + guards according to spec | type:feature, area:routing, priority:high | 1h 30m | 1h 35m | `fb-4-routes-and-guards` | done |

### Milestone 1.1.0 - Todo Features + Role Rules

Goal: complete todo CRUD and role-specific behavior for admin/user.

| Issue | Title | Labels | Estimate | Spent | Feature Branch | Status |
|---|---|---|---|---|---|---|
| #5 | Implement todo list rendering with reusable row/header components | type:feature, area:todo, area:ui, priority:high | 2h 00m | 2h 15m | `fb-5-todo-list-components` | done |
| #6 | Implement create/edit form with validation and deep-link edit | type:feature, area:todo, priority:high | 2h 00m | 2h 05m | `fb-6-todo-form-validation` | done |
| #7 | Enforce role behavior (inactive visibility, inactive deep-link redirect) | type:feature, area:auth, area:todo, priority:high | 1h 30m | 1h 20m | `fb-7-role-visibility-rules` | done |
| #8 | Implement action permissions (delete admin only, active admin only, closed all) | type:feature, area:todo, priority:high | 1h 30m | 1h 40m | `fb-8-action-permissions` | done |

### Milestone 1.2.0 - UX Polish + Docs + Finalization

Goal: finish design requirements, regression fixes, and delivery docs.

| Issue | Title | Labels | Estimate | Spent | Feature Branch | Status |
|---|---|---|---|---|---|---|
| #9 | Apply required styling and status colors | type:feature, area:ui, priority:medium | 1h 15m | 1h 10m | `fb-9-styling-status-colors` | done |
| #10 | Add delete confirm dialog and refresh behavior | type:feature, area:todo, area:ui, priority:medium | 1h 00m | 50m | `fb-10-delete-confirm-refresh` | done |
| #11 | End-to-end review + bugfix pass for criteria checklist | type:bug, area:todo, area:auth, priority:high | 1h 30m | 1h 35m | `fb-11-criteria-bugfix-pass` | done |
| #12 | Final README reflection/fazit | type:docs, priority:medium | 45m | 35m | `fb-12-readme-fazit` | done |

## Release Plan

- `release/1.0.0` includes issues: #1, #2, #3, #4
- `release/1.1.0` includes issues: #5, #6, #7, #8
- `release/1.2.0` includes issues: #9, #10, #11, #12

## Required Tags

- `v1.0.0` on merge commit from `release/1.0.0` -> `main`
- `v1.1.0` on merge commit from `release/1.1.0` -> `main`
- `v1.2.0` on merge commit from `release/1.2.0` -> `main`

## Issue Time Tracking Format

If using GitLab, post these commands in each issue discussion:

- `/estimate 1h 30m`
- `/spend 1h 25m`

## Pull Request Policy

- One PR per release branch into `main`
- All milestone issues must be closed before opening PR
- PR title format: `release: <version>`
- PR description includes checked issue list and smoke test notes

