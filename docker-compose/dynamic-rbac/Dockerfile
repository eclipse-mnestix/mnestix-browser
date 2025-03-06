FROM ubuntu:20.04

USER root

RUN apt-get update && apt-get install -y \
    curl \
    libcurl4-openssl-dev \
    jq

COPY ./initial-submodel.json /application/initial-submodel.json
