FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json* ./
ENV NPM_CONFIG_INCLUDE_OPTIONAL=true
RUN npm install --include=optional

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
