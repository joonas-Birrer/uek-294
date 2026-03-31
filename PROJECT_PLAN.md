# UEK-294 Projektplanung

## Labels

| Label | Farbe | Beschreibung |
|-------|-------|--------------|
| `feature` | `#0075ca` | Neue Funktionalität |
| `bug` | `#d73a4a` | Fehler / Bug |
| `setup` | `#e4e669` | Projekt-Setup und Konfiguration |
| `auth` | `#5319e7` | Authentifizierung / Keycloak |
| `ui` | `#c5def5` | Benutzeroberfläche / Angular Material |
| `api` | `#bfd4f2` | Backend-API / OpenAPI |
| `infra` | `#fef2c0` | Infrastruktur / Compose |

---

## Milestone 1.0.0 – Projekt-Grundstruktur & Auth-Integration

**Ziel:** Lauffähige Angular-App mit Keycloak-Login und Docker-Compose-Setup.

| # | Titel | Labels | Estimate | Spent | Branch |
|---|-------|--------|----------|-------|--------|
| 1 | Projektstruktur Angular anlegen | `setup`, `feature` | 2h | 2h | fb-1 |
| 2 | Docker Compose Setup (Keycloak + API) | `setup`, `infra` | 1h | 1h | fb-2 |
| 3 | Keycloak-Integration (Login/Logout) | `auth`, `feature` | 3h | 3h | fb-3 |
| 4 | Navigation / Routing-Grundstruktur | `ui`, `feature` | 2h | 2h | fb-4 |
| 5 | Auth Guard implementieren | `auth`, `feature` | 1h | 1h | fb-5 |

**Gesamtschätzung:** 9h | **Gesamt Spent:** 9h

---

## Milestone 1.1.0 – Todo CRUD & Rollenlogik

**Ziel:** Vollständige Todo-Verwaltung mit rollenbasierter Zugriffskontrolle.

| # | Titel | Labels | Estimate | Spent | Branch |
|---|-------|--------|----------|-------|--------|
| 6 | OpenAPI-Client generieren (ng-openapi-gen) | `api`, `setup` | 1h | 1h | fb-6 |
| 7 | Todo-Liste mit Active/Inactive-Sichtbarkeit | `feature`, `ui` | 3h | 3h | fb-7 |
| 8 | Todo erstellen (Formular) | `feature`, `ui` | 2h | 2h | fb-8 |
| 9 | Todo bearbeiten (Formular ohne Popup) | `feature`, `ui` | 2h | 2h | fb-9 |
| 10 | Delete nur für Admin | `feature`, `auth` | 1h | 1h | fb-10 |
| 11 | Closed-Toggle für alle Benutzer | `feature`, `ui` | 1h | 1h | fb-11 |
| 12 | Active-Toggle nur für Admin | `feature`, `auth` | 1h | 1h | fb-12 |
| 13 | Inactive-Guard: User wird zu /todo/list umgeleitet | `auth`, `feature` | 2h | 2h | fb-13 |

**Gesamtschätzung:** 13h | **Gesamt Spent:** 13h

---

## Milestone 1.2.0 – Qualitätssicherung & Finalisierung

**Ziel:** Polishing, Fehlerbehandlung, Dokumentation und finale Abgabe.

| # | Titel | Labels | Estimate | Spent | Branch |
|---|-------|--------|----------|-------|--------|
| 14 | 404-Seite (Page Not Found) | `ui`, `feature` | 0.5h | 0.5h | fb-14 |
| 15 | Fehlerbehandlung (HTTP-Fehler / SnackBar) | `bug`, `ui` | 2h | 2h | fb-15 |
| 16 | Proxy-Konfiguration testen (alle Routen) | `infra`, `setup` | 1h | 1h | fb-16 |
| 17 | Loading-Spinner während API-Calls | `ui`, `feature` | 1h | 1h | fb-17 |
| 18 | README / Dokumentation aktualisieren | `setup` | 1h | 1h | fb-18 |
| 19 | End-to-End Test mit Compose-Stack | `infra` | 2h | 2h | fb-19 |

**Gesamtschätzung:** 7.5h | **Gesamt Spent:** 7.5h

---

## Branching-Strategie (Gitflow)

```
main
├── 1.0.0  (release branch)  → tag: v1.0.0
├── 1.1.0  (release branch)  → tag: v1.1.0
└── 1.2.0  (release branch)  → tag: v1.2.0

Feature-Branches (je Issue):
fb-1, fb-2, fb-3, fb-4, fb-5,
fb-6, fb-7, fb-8, fb-9, fb-10,
fb-11, fb-12, fb-13, fb-14, fb-15,
fb-16, fb-17, fb-18, fb-19
```

## Gesamtübersicht

| Milestone | Issues | Geschätzt | Aufgewendet |
|-----------|--------|-----------|-------------|
| 1.0.0 | 5 | 9h | 9h |
| 1.1.0 | 8 | 13h | 13h |
| 1.2.0 | 6 | 7.5h | 7.5h |
| **Total** | **19** | **29.5h** | **29.5h** |
