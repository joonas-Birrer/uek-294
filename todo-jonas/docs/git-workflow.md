# Git Workflow (UEK-294)

This repository follows a simplified Gitflow aligned to the assignment.

## Branch model

- `main`: only milestone-ready, runnable code via Pull Request.
- `1.0.0`, `1.1.0`, ...: one release branch per milestone (`Major.minor.release`).
- `fb-<issue-number>`: one feature branch per issue (for example `fb-12`).

## Standard flow

1. Create milestone and issues in remote Git platform.
2. Create release branch for the milestone from `main`.
3. Create one feature branch per issue from the release branch.
4. Implement issue, push branch, open PR to the release branch.
5. Close issue when acceptance criteria are fulfilled.
6. When all milestone issues are closed, merge release branch to `main` via PR.

## Naming rules

- Release branch: `X.Y.Z` only (example: `1.0.0`).
- Feature branch: `fb-<issue-number>` only (example: `fb-7`).
- PR title: `[#<issue-number>] short description`.

## Local setup commands

```bash
git checkout main
git pull

git checkout -b 1.0.0

git checkout 1.0.0
git checkout -b fb-1
```

## Work commands per issue

```bash
git checkout fb-1
git add .
git commit -m "feat(#1): add toolbar skeleton"
git push -u origin fb-1
```

Open a PR from `fb-1` to `1.0.0`.

## Milestone close commands

```bash
git checkout main
git pull

git checkout 1.0.0
git pull
```

Open a PR from `1.0.0` to `main`.

## Required remote protections

- Protect `main` against direct pushes.
- Require at least one approval for PR merges.
- Require all linked issues in the milestone to be closed before release PR merge.

