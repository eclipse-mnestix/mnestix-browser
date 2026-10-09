# Upgrading the PostgreSQL Database

The `basyx-db` service runs PostgreSQL 18. PostgreSQL refuses to open a data directory that an older major version wrote. If you have a volume from PostgreSQL 16 or older, migrate the data before you start the new stack, or startup fails with:

```
Error: in 18+, these Docker images are configured to store database data in a
format which is compatible with "pg_ctlcluster" ...
This is usually the result of upgrading the Docker image without
upgrading the underlying database using "pg_upgrade" (which requires both
versions).
```

Two things changed at once:

- **The data format.** The upgrade tool is `pg_upgrade`; it needs the old and the new PostgreSQL binaries side by side. See the [official upgrade documentation](https://www.postgresql.org/docs/18/pgupgrade.html).
- **The directory layout.** The `postgres:18` image stores data under `/var/lib/postgresql/18/docker`. The volume now mounts at `/var/lib/postgresql`, not at `/var/lib/postgresql/data`. See the [postgres image layout change](https://github.com/docker-library/postgres/pull/1259) and [issue 37](https://github.com/docker-library/postgres/issues/37), where the image maintainers discuss the layout and in-place upgrades.

## Migrate with pgautoupgrade (suggested)

[`pgautoupgrade`](https://github.com/pgautoupgrade/docker-pgautoupgrade) is a drop-in replacement for the `postgres` image. It carries the binaries of all older major versions, runs `pg_upgrade --link` when the data directory is older than the target version, and then starts PostgreSQL as normal. On an empty volume it does nothing.

Use it for the one migration run, then switch back to the plain image:

1. In `compose.yml` (or `docker-compose/compose.frontend.yml`), set the `basyx-db` image to:

```yaml
  basyx-db:
    image: pgautoupgrade/pgautoupgrade:18-alpine
    volumes:
      - basyx-db-data:/var/lib/postgresql
```

2. Start the stack and watch the logs:

```sh
docker compose up
docker compose logs -f basyx-db
```

The migration runs once. You will see `Performing PG upgrade on version 16 database files` and later `Upgrade to PostgreSQL 18 complete`. The first start takes longer than usual. If the stack aborts while `basyx-db` is still migrating (the healthcheck tolerates only a few minutes), run `docker compose up` again afterwards — the container keeps running and finishes the migration on its own.

3. Set the image back to `postgres:18-alpine`.

> **Warning:** The migration rewrites your data in place. Back the volume up first:
>
> ```sh
> docker run --rm \
>   -v mnestix-browser_basyx-db-data:/var/lib/postgresql/data \
>   -v "$PWD:/backup" \
>   postgres:16-alpine tar czf /backup/basyx-db-data.tar.gz -C /var/lib/postgresql/data .
> ```
>
> Adjust the volume prefix if your project has another name; `docker volume ls` shows it.

## Migrate by dump and restore

Dump and restore avoids `pg_upgrade` altogether. For a database this size, it is the simplest path.

1. Stop the stack:

```sh
docker compose down
```

2. Dump the database with the old PostgreSQL image:

```sh
docker run --rm \
  -v mnestix-browser_basyx-db-data:/var/lib/postgresql/data \
  postgres:16-alpine pg_dump -U basyx basyxdb > basyx-db-dump.sql
```

3. Delete the old volume:

```sh
docker volume rm mnestix-browser_basyx-db-data
```

4. Start `basyx-db` alone and wait until it is healthy. The fresh volume gets the user and the database from the service's environment variables, so only the contents of `basyxdb` need restoring:

```sh
docker compose up -d --wait basyx-db
docker compose exec -T basyx-db psql -U basyx -d basyxdb < basyx-db-dump.sql
```

5. Start the rest of the stack:

```sh
docker compose up -d
```

For a large database, use [`pg_upgrade`](https://www.postgresql.org/docs/18/pgupgrade.html) instead of a dump — it links data files instead of copying them. The pgautoupgrade image above is exactly that, with both binary versions packaged for you.
