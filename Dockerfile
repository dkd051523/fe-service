FROM node:16.16.0

WORKDIR /app

COPY source/ .

RUN npm run build

#RUN npm install -g serve

EXPOSE 3000

ENTRYPOINT ["npx", "serve", "-s", "build", "-l", "3000"]