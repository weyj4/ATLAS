#!/bin/bash

# Check if we have the atlas image locally
if [ -z $(docker images atlas -q) ]; then
        docker pull atlas
fi

# Check if there is an atlas container already created.
# If not, then run a new one
container=$(docker ps -a -f name=atlas --format "{{.ID}}")
if [ -z $container ]; then
        echo "No container found, starting new one..."
        docker run -p 8080:8080 --name atlas -w="/app" -v $(pwd):/app -it atlas /bin/bash
else
        echo "Starting container $container"
        docker start $container
        echo "Attaching to container $container"
        docker attach $container
fi
