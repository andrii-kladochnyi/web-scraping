Download `client_secret.json` from [google console](https://console.developers.google.com/apis/credentials?authuser=1&project=quickstart-1568145470147)

docker exec -it google-results_postgres_1 psql -U admin -c "create database google_results"

CREATE TABLE "public"."results" (
    "id" serial,
    "technology" text,
    "tech_id" integer,
    "count" bigint DEFAULT '0',
    "date" timestamp,
    PRIMARY KEY ("id")
);

https://medium.com/@dupski/debug-typescript-in-vs-code-without-compiling-using-ts-node-9d1f4f9a94a