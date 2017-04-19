FROM ubuntu:16.04

MAINTAINER matthew.le@mssm.edu

# Node.js
RUN apt-get update -y && \
	apt-get install -y nodejs npm wget && \
	mkdir -p /usr/src/app

# Create a `node` alias to `nodejs`
RUN ln -s "$(which nodejs)" /usr/bin/node

# Install the dependencies
# RUN npm install --production

# Install PostgreSQL
RUN apt-get install -y postgresql && apt-get update && apt-get install -y postgis sudo

# Copy the source code to the /usr/src/app directory
COPY . /usr/src/app

# Set this as the working directory
WORKDIR /usr/src/app

RUN npm install

RUN printf "DB_USER=root\nDB_PASSWORD=root" > /usr/src/app/.env

EXPOSE 8080

CMD /usr/src/app/start.sh