# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js/Prisma"

# Node.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="development"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3


# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev --legacy-peer-deps

# Generate Prisma Client
COPY prisma .
RUN npx prisma generate

# Copy application code
COPY . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev --legacy-peer-deps


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

RUN apt-get update \
 && apt-get install -y openssh-server \
 && cp /etc/ssh/sshd_config /etc/ssh/sshd_config-original \
 && sed -i 's/^#\s*Port.*/Port 2222/' /etc/ssh/sshd_config \
 && sed -i 's/^#\s*PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config \
 && mkdir -p /root/.ssh \
 && chmod 700 /root/.ssh \
 && mkdir /var/run/sshd \
 && chmod 755 /var/run/sshd \
 && rm -rf /var/lib/apt/lists /var/cache/apt/archives


# Copy and setup SSH entrypoint script
COPY run_ssh /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/run_ssh"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "preview" ]
