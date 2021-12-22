#!/bin/sh
docker build -t debio_frontend_revamp_dev .
docker tag debio_frontend_revamp_dev hub.debio.network/debio_frontend_revamp_dev:latest
docker push hub.debio.network/debio_frontend_revamp_dev:latest
