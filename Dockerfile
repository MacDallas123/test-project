FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:22-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3070

# L'option "-n" dans la commande "serve" signifie "--no-clipboard", c'est-à-dire que le serveur ne va pas tenter de copier l'URL dans le presse-papiers lors du démarrage.
# Pour exposer le serveur sur toutes les interfaces, il faut utiliser l'option "-l 0.0.0.0:3070"
# CMD ["serve", "-s", "dist", "-l", "0.0.0.0:3070", "-n"]

CMD ["serve", "-s", "dist", "-l", "3070"]