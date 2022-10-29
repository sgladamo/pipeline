#!/bin/bash

cd ./Images
docker load < shield.tar.gz
docker load < f12.tar.gz

cd ../
docker-compose up -d