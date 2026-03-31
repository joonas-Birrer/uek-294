# Changelog

## v1.2.0 (2026-03-31)
### Added
- Loading spinners on all async operations
- Error handling with Material SnackBar notifications
- 404 Page Not Found with navigation back to home
- Complete proxy configuration (all required routes)
- Final documentation updates

### Fixed
- Environment configuration properly structured
- Route redirects validated end-to-end

## v1.1.0
### Added
- Todo list with role-based visibility (admin sees inactive, user does not)
- Todo create form (no popup, dedicated page)
- Todo edit form with inactive badge
- Delete button (admin only)
- Closed toggle (all users)
- Active toggle (admin only)
- Inactive guard: redirects user role to /todo/list for inactive todos
- OpenAPI generator configuration

## v1.0.0
### Added
- Project scaffold (Angular 17, standalone components)
- Docker Compose: Keycloak v1.1.52 + Todo API v1.1.51
- Keycloak authentication integration
- Route structure: /, /home, /todo, /todo/list, /todo/new, /todo/edit/:id, **
- Auth guard for protected routes
- Navigation bar with login/logout
- Angular Material UI theme
- Dev server on port 4222
- Proxy config for /api, /auth, /realms, /resources, /api/docs
