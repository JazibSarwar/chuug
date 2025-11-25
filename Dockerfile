FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

# copy package files first
COPY package.json package-lock.json* ./

# --- FIX: copy prisma before npm ci ---
COPY prisma ./prisma

# install dependencies (prisma generate runs here)
RUN npm ci --omit=dev && npm cache clean --force

# now copy rest of the project
COPY . .

RUN npm run build

CMD ["npm", "run", "docker-start"]
