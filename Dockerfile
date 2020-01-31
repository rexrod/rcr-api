FROM node:alpine

MAINTAINER Diego Coutinho

ENV PORT=3001
ENV URI_MONGODB=mongodb://rcr:12345678@172.100.11.193:27017/rcr
#ENV URI_MONGODB=mongodb://rcradmin:rXVuLO1k6XcVl5EX@rcr-v1-shard-00-00-u3av8.mongodb.net:27017,rcr-v1-shard-00-01-u3av8.mongodb.net:27017,rcr-v1-shard-00-02-u3av8.mongodb.net:27017/rcr-db?ssl=true&replicaSet=rcr-v1-shard-0&authSource=admin&retryWrites=true
ENV NAME_API=LUPA-V1

COPY . /node/api

EXPOSE $PORT

WORKDIR /node/api

RUN npm install

ENTRYPOINT ["npm", "start"]
