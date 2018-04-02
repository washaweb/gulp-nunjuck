FROM node:9.10
RUN mkdir -p /code/
WORKDIR /code/

ENV PATH=/code/node_modules/.bin/:$PATH
