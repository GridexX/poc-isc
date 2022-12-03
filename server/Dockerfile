FROM node:16-alpine AS builder
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/", "start"]

FROM node:16-alpine AS runner
COPY --from=builder . .
ENV PORT=3000
ENV TCP_PORT=24950
CMD ["node", "dist/index.js"]