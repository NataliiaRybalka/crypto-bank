FROM node:18-alpine3.16 as BUILD
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/src

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY src /usr/src/ts-build/src
COPY .babelrc /usr/src/ts-build/.babelrc
RUN yarn run build

######## RELEASE ########
FROM node:18-alpine3.16
ARG NODE_ENV=production
ENV NODE_ENV "$NODE_ENV"

# Default server configurations

USER root
RUN apk --update add imagemagick

RUN mkdir -p /server
WORKDIR /server

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY .babelrc .babelrc

COPY --from=BUILD /usr/src/js-dist/src src

EXPOSE 80

ENTRYPOINT ["yarn", "run", "start"]