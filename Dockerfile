FROM node:22-alpine AS base
RUN apk update && apk add --no-cache openssl

FROM base AS deps
WORKDIR /app
COPY package*.json yarn.lock* ./
RUN apk add --no-cache python3 py-setuptools make g++
# network-timeout is a workaround for yarn QEMU support
# https://github.com/docker/build-push-action/issues/471
# https://github.com/nodejs/docker-node/issues/1335
RUN yarn install --frozen-lockfile --production --network-timeout 1000000

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Comment the following line to enable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED=1

FROM deps AS builder
WORKDIR /app
COPY . .

RUN yarn prisma migrate deploy
RUN yarn prisma generate

RUN yarn build

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
EXPOSE 3000
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma/database/mnestix-database.db ./prisma/database/mnestix-database.db
COPY --from=builder --chown=nextjs:nodejs /app/dist/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dist/static ./public/_next/static

COPY ./scripts scripts

ENTRYPOINT [ "/bin/sh" ]
CMD [ "/app/scripts/start.sh" ]

FROM deps AS dev
ENV NODE_ENV=development
COPY . .

RUN yarn prisma migrate deploy
RUN yarn prisma generate

CMD [ "yarn", "dev"]
