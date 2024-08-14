FROM node:lts-slim

ARG GITHUB_ACCESS_TOKEN
ARG MONOREPO_TARGET_REPO
ARG MONOREPO_TARGET_BRANCH
ARG APP_TARGET_REPO
ARG APP_TARGET_BRANCH

ENV MONOREPO_TARGET_REPO=$MONOREPO_TARGET_REPO
ENV APP_TARGET_REPO=$APP_TARGET_REPO

RUN apt-get update
RUN apt-get -y install git

WORKDIR /monorepo
COPY . /monorepo

RUN npm i -g pnpm @nestjs/cli

RUN git clone -b $MONOREPO_TARGET_BRANCH https://$GITHUB_ACCESS_TOKEN@github.com/iem-rd/$MONOREPO_TARGET_REPO.git 
RUN git clone -b $APP_TARGET_BRANCH https://$GITHUB_ACCESS_TOKEN@github.com/iem-rd/$APP_TARGET_REPO.git $MONOREPO_TARGET_REPO/apps/$APP_TARGET_REPO

RUN cd ./$MONOREPO_TARGET_REPO && pnpm install && nest build $APP_TARGET_REPO

RUN apt-get -y --purge autoremove git
RUN apt-get clean

EXPOSE 8080

CMD node "${MONOREPO_TARGET_REPO}/dist/apps/${APP_TARGET_REPO}/main.js"