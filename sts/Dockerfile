FROM node:16-alpine
COPY . .
RUN npm install
ENV PORT=3001
ENV HOST="0.0.0.0"
CMD ["npm", "run", "start"]