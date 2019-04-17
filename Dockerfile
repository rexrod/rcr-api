FROM node:alpine

MAINTAINER Diego Coutinho

ENV PORT=3001
ENV URI_MONGODB=mongodb://dcoutinho:U8G8fm6r6zgDyd8@lupa-v1-shard-00-00-rcpew.mongodb.net:27017,lupa-v1-shard-00-01-rcpew.mongodb.net:27017,lupa-v1-shard-00-02-rcpew.mongodb.net:27017/lupa-v1?ssl=true&replicaSet=lupa-v1-shard-0&authSource=admin&retryWrites=true
ENV NAME_API=LUPA-V1

COPY . /node/api

EXPOSE $PORT

WORKDIR /node/api

RUN npm install

ENTRYPOINT ["npm", "start"]