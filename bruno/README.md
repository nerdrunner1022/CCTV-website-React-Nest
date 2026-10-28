# Bruno API collection

Open this folder in [Bruno](https://www.usebruno.com/) to exercise the API.

- Select the **local** environment (`environments/local.bru`).
- Run `auth/Login` first — it stores the `authToken` used by the admin requests.
- Run `bru run` from CI to execute the collection headlessly.

| Folder | Purpose |
|---|---|
| `public/` | unauthenticated endpoints (health, lead capture, calculator) |
| `auth/` | register / login |
| `admin/` | staff endpoints (require a bearer token) |
