FROM node:22.12.0

RUN mkdir /app
WORKDIR /app

VOLUME /tmp

COPY package*.json ./

RUN npm install esbuild@0.25.4 --save-exact

RUN npm install --omit=dev --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3070

CMD ["npm", "run", "dev"]