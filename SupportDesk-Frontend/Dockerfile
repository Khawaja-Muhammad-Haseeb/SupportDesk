FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package*.json ./
RUN npm install

# Copy the rest of the source.
COPY . .

EXPOSE 5173

# Run the Vite dev server bound to all interfaces so the container is reachable.
# The "/api" proxy target is controlled via the BACKEND_URL env var.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
