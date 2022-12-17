FROM node:16-alpine
COPY . .
RUN npm install
ENV PORT=3000
ENV TCP_PORT=24950
ENV STS_PORT=3001
ENV HOST="server"
ENV HOST_API="0.0.0.0"
ENV HOST_STS="sts"
CMD ["npm", "run", "start"]