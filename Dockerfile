# --- deps ---
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# --- build ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_WP_REST_ENDPOINT
ENV NEXT_PUBLIC_WP_REST_ENDPOINT=$NEXT_PUBLIC_WP_REST_ENDPOINT
ARG WP_HOME
ENV WP_HOME=$WP_HOME

RUN npm run build

# --- runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# standalone runtime
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/drizzle ./drizzle

# injects secrets from the shared secrets volume, then execs CMD
COPY docker/web-entrypoint.sh ./web-entrypoint.sh
ENTRYPOINT ["sh", "/app/web-entrypoint.sh"]

EXPOSE 3000

CMD ["node", "server.js"]
