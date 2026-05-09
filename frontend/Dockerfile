FROM node:18-alpine
WORKDIR /app

# Recibir la URL de la API como argumento de build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]