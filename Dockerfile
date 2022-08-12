FROM --platform=linux/arm64/v8 emirdeliz/cpp-opencv:latest
LABEL maintainer="Emir Marques <emirdeliz@gmail.com>"

RUN mkdir -p /home/docker/apps
WORKDIR /home/docker/apps