FROM node:16-alpine3.14 AS node

FROM node AS base
WORKDIR /application
ADD ./package.json /application/package.json
ADD ./package-lock.json /application/package-lock.json
RUN npm --silent ci \
  && chown -R node:node /application
USER node

FROM base AS build
ARG BUILD_NUMBER_CI
ENV APP_NAME=ts-project \
    BUILD_NUMBER_CI=$BUILD_NUMBER_CI
WORKDIR /application
ADD ./tsconfig.* /application/
ADD ./.eslintrc /application/.eslintrc
ADD ./jest.config.js /application/jest.config.js

COPY ./config /application/config
COPY ./src /application/src
COPY ./test /application/test
RUN npm run build

FROM build AS prod
ARG BUILD_NUMBER_CI
ENV NODE_ENV=production \
    APP_NAME=ts-project \
    BUILD_NUMBER_CI=$BUILD_NUMBER_CI
WORKDIR /application
COPY --chown=node:node --from=build /application/package*.json ./
COPY --chown=node:node --from=build /application/config ./config
USER node
CMD ["npm", "start"]
