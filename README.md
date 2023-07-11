# Beyond All Reason Database

Source for service that is backend for BAR Live Services https://bar-rts.com/.
The frontend is in https://github.com/Jazcash/bar-live-services.

High level overview
-------------------

There are two services that share a lot of the code and operate on the same
database, processor and rest API.

The processor is running in the background and doing more heavy computations.
It covers processing of maps, replays and balance changes from git repository.
The changes are pulled in periodically, for maps and replays they are pulled
in by watching local filesystem directories, and for balance changes by
looking them up using GitHub API.

Rest API is hosting all the endpoints used by the BAR Live services frontend.
The endpoints primarily serve data that was filled in by the processor
component to the database, but it also has components that communicate with the
[teiserver](https://github.com/beyond-all-reason/teiserver/) to pull dynamic
information from there: leaderboards and live battle list.

Development
-----------

### Setup

You need to install nodejs version 14: that's the version that is used at the
moment. The service depends on PostgreSQL and Redis, so you need to have them
installed and running. One of the easier ways to do that is to use docker:

```
docker run --name bar-db-postgres -e POSTGRES_PASSWORD=postgres -d postgres
docker run --name bar-db-redis -d redis
```

Then to cleanup or start again you can use standard docker commands `docker
{stop|rm|start} bar-db-{redis|postgres}`.

Then, it's best if you setup the `config.json` file. You can copy the example
file from `config.json.example` and edit it to your liking. See the file
`src/bar-db-config.ts` for full list of options. Out of the box you might for
sure need to update the IP address of the postgres and redis containers, you
can get them with:

```
$ docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' bar-db-{postgres,redis}
172.17.0.2
172.17.0.3
```

Notice that example config doesn't have credentials set for some of the
components, so for development of those component you need to acquire them
yourself.

### Running

You can start processor and rest API with respectively:

```
npm run build && npm run processor
```

and 

```
npm run build && npm run rest-api
```
