# FROM node:20-alpine
# RUN apk add --no-cache openssl

# EXPOSE 3000
# WORKDIR /app
# ENV NODE_ENV=production

# # Copy package files first
# COPY package.json package-lock.json* ./

# # Copy Prisma schema
# COPY prisma ./prisma

# # Install all dependencies including dev dependencies temporarily
# RUN npm install

# # Generate Prisma client for linux-musl
# RUN npx prisma generate
# RUN npx prisma migrate deploy

# # Remove dev dependencies to keep image light
# RUN npm prune --production

# # Copy rest of the application
# COPY . .

# # Build your project
# RUN npm run build

# # Start the app
# # CMD ["npm", "run", "docker-start"]\
# CMD ["npm", "start"]
#newww......
FROM node:20

# install OS deps
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# 1) copy only package files to leverage cache
COPY package.json package-lock.json ./

# 2) install dependencies (including dev so prisma CLI is present)
RUN npm install

# 3) copy the rest of the repo
COPY . .

# 4) generate prisma client now that schema exists in the container (generates debian engine)
RUN npx prisma generate

# 5) build the app
RUN npm run build

# 6) expose and start
EXPOSE 3000
CMD ["npm", "run", "docker-start"]
