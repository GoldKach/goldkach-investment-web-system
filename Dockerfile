# # -----------------------------
# # 1️⃣ Dependencies stage
# # -----------------------------
# FROM node:18-alpine AS deps
# WORKDIR /app

# COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
# RUN \
#   if [ -f package-lock.json ]; then npm ci; \
#   elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
#   fi

# # -----------------------------
# # 2️⃣ Build stage
# # -----------------------------
# FROM node:18-alpine AS builder
# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# ENV NEXT_TELEMETRY_DISABLED=1

# RUN npm run build

# # -----------------------------
# # 3️⃣ Production stage
# # -----------------------------
# FROM node:18-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1

# # Create non-root user
# RUN addgroup -g 1001 -S nodejs \
#   && adduser -S nextjs -u 1001

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# USER nextjs

# EXPOSE 3000

# CMD ["npm", "start"]




# -----------------------------
# 1️⃣ Dependencies stage
# -----------------------------
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
  fi

# -----------------------------
# 2️⃣ Build stage
# -----------------------------
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# ✅ Declare build args and expose them as ENV so Next.js bakes them into the bundle
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY

RUN npm run build

# -----------------------------
# 3️⃣ Production stage
# -----------------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
