FROM node:20-alpine

WORKDIR /app

# Copy only package files first
COPY apps/message-service/package.json  ./

RUN npm install

# Copy the source code
COPY apps/message-service ./apps/message-service
COPY libs ./libs

WORKDIR /app/apps/message-service

EXPOSE 4002

CMD ["node", "src/app.js"]
