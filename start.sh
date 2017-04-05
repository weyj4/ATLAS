#!/bin/bash

pg_isready -h localhost -p 5432

if [ $? -ne 0 ]; then
	echo "starting Postgres server..."
	/etc/init.d/postgresql start
fi

pg_isready -h localhost -p 5432
while [ $? -ne 0 ]; do
	echo "Waiting for postgres to start..."
	sleep 1
	pg_isready -h localhost -p 5432
done

psql atlas --command "CREATE EXTENSION postgis"

psql atlas -c "SELECT COUNT(*) FROM tula.markers;"

if [ $? -ne 0 ]; then
	echo "Tula schema doesn't exist, creating..."
	cat atlas.sql | psql atlas
fi

npm run build

npm start