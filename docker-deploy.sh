#!/bin/bash

cd api
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t iryo/qrfu-api:$TRAVIS_TAG .
docker tag iryo/qrfu-api:$TRAVIS_TAG iryo/qrfu-api:latest
docker push iryo/qrfu-api:$TRAVIS_TAG
docker push iryo/qrfu-api:latest