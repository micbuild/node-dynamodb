FROM node:8.15.1

USER node

WORKDIR /home/node

COPY --chown=node:node . .

RUN npm install --production --verbose

EXPOSE 3000

CMD ["node", "src/index.js"]
