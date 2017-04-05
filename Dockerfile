FROM ubuntu:16.04

MAINTAINER matthew.le@mssm.edu

# Node.js
RUN apt-get update -y && \
	apt-get install -y nodejs npm wget && \
	mkdir -p /usr/src/app

# Copy the source code to the /usr/src/app directory
COPY . /usr/src/app

# Set this as the working directory
WORKDIR /usr/src/app

# Create a `node` alias to `nodejs`
RUN ln -s "$(which nodejs)" /usr/bin/node

# Install the dependencies
# RUN npm install --production

# Install PostgreSQL
RUN apt-get install -y postgresql && apt-get update && apt-get install -y postgis

# Create the `root` user
USER postgres
RUN /etc/init.d/postgresql start && \
    psql --command "CREATE USER root WITH SUPERUSER CREATEDB CREATEROLE REPLICATION BYPASSRLS PASSWORD 'root';" &&\
    createdb root

USER root

# Create the database
RUN /etc/init.d/postgresql start && \
	psql --command "CREATE DATABASE atlas;"

RUN printf "DB_USER=root\nDB_PASSWORD=root" > .env

RUN npm install

CMD /usr/src/app/start.sh