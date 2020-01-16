FROM node:10.16.0

USER node

WORKDIR /home/node

COPY --chown=node:node . .

RUN npm install --production --verbose

EXPOSE 3000

CMD ["node", "src/index.js"]
