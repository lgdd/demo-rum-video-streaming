FROM node:lts-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY . /app
WORKDIR /app

RUN pnpm install
RUN pnpm run build

EXPOSE 8000

CMD [ "pnpm", "start" ]