FROM node:22-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install --omit=dev


COPY . .

EXPOSE 3001

# Comando para levantar la aplicación.
CMD ["node", "server-db-mongo.js"]


