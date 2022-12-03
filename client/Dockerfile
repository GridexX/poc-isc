FROM node:16-alpine
COPY . .
RUN npm install
ENV PORT=3000
ENV TCP_PORT=24950
ENV HOST="server"
CMD ["npm", "run", "start"]