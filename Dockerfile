# Сборка образа Next.js (standalone) + Prisma Client.
# На Vercel этот файл не используется — там сборка из Git без Docker.
#
# Сборка: docker build -t quiz .
# Запуск:  docker run --rm -p 3000:3000 -e DATABASE_URL="postgresql://..." quiz
#
# Миграции БД один раз (отдельно от контейнера или перед стартом):
#   DATABASE_URL=... npx prisma migrate deploy

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma: движок и клиент не всегда попадают в output tracing — дописываем явно.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
