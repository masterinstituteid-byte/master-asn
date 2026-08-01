# ============================================================
# MASTER ASN — image produksi (Next.js 16 + Prisma + SQLite)
# Dipakai oleh Coolify / Docker di Hostinger VPS.
# ============================================================

# ---- Tahap build ----
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Alat untuk mengompilasi modul native (better-sqlite3) bila perlu.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install dependency (schema disalin dulu agar `prisma generate` di postinstall jalan).
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# Salin sisa kode lalu build.
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Tahap runtime ----
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Bawa hasil build + dependency (termasuk binary native & Prisma Client).
COPY --from=builder /app ./

# Folder data permanen (di-mount volume oleh Coolify).
RUN mkdir -p /app/data
EXPOSE 3000

# Terapkan migrasi database lalu jalankan server.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
