#!/bin/sh
docker build -t hub.debio.network/debio_frontend_revamp_demo:latest -f ./Dockerfile.demo .
docker push hub.debio.network/debio_frontend_revamp_demo:latest
