# Remaining Requirements (Branch `fb-13-missing-requirements`)

This checklist tracks items that are still open or should be re-verified against the UEK-294 LB.

## Verified Open Items

- [ ] Admin can toggle `active` directly in the list row (not only in edit page).
- [ ] Replace `alert(...)` popups with non-blocking UI feedback (for example `MatSnackBar`) except delete confirmation dialog.
- [ ] Home page must show application name and author explicitly.
- [ ] Add final personal project conclusion in `README.md`.

## Re-Verify Against LB

- [ ] Confirm required Keycloak image version in `compose/compose.yml` (`v1.1.52` vs `v1.1.53` in LB text).
- [ ] Confirm open PR/branch strategy matches coach expectations (`develop`/release workflow vs current repo usage).
- [ ] Validate toolbar content exactly against LB screenshots (left/right button placement and labels).
- [ ] Re-check role behavior end-to-end:
  - user sees only active todos
  - admin sees active + inactive
  - user deep-link to inactive redirects to list

## Ready-to-Run Validation

```bash
cd /home/jonas/uek-294-jonas/abgabe/compose
docker compose up -d

cd /home/jonas/uek-294-jonas/abgabe/todo-jonas
npm start
```

