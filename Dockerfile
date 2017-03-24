FROM ubuntu:16.04

MAINTAINER matthew.le@mssm.edu

RUN apt-get update -y && \
	apt-get install -y nodejs npm wget && \
	mkdir -p /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN ln -s "$(which nodejs)" /usr/bin/node

RUN npm install --production

RUN apt-get install -y postgresql

USER postgres
RUN /etc/init.d/postgresql start && sleep 1 && \
    psql --command "CREATE USER root WITH SUPERUSER CREATEDB CREATEROLE REPLICATION BYPASSRLS PASSWORD 'root';" &&\
    createdb root

USER root

RUN /etc/init.d/postgresql start && sleep 1 && \
	createdb atlas && \
	cat tula.sql | psql atlas

RUN printf "DB_USER=root\nDB_PASSWORD=root" > .env

RUN wget "https://github.com/ArnholdInstitute/ATLAS/releases/download/0.1/gtmpop.tif" -O backend/gtmpop.tif

CMD service postgresql start && sleep 2 && npm start