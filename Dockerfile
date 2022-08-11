FROM --platform=linux/arm64/v8 emirdeliz/cpp-opencv:latest
LABEL maintainer="Emir Marques <emirdeliz@gmail.com>"

RUN mkdir source
WORKDIR /source