FROM node:20-alpine as builder

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install

# Copy source code and config
COPY src ./src
COPY tsconfig.json ./
COPY database ./database

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/database ./database

EXPOSE 4000

CMD ["npm", "start"]
