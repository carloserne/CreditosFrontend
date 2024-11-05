# Etapa de construcción
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de configuración de npm
COPY package*.json ./

# Instalar las dependencias
RUN npm install --legacy-peer-deps

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar el código de la aplicación
COPY . .

# Construir la aplicación en modo producción
RUN ng build --configuration=production

# Etapa para servir la aplicación con Node.js
FROM node:18-alpine

# Crear un directorio para la aplicación en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos de la aplicación construida en la etapa de construcción
COPY --from=build /usr/src/app/dist/creditos-front-end /usr/src/app

# Instalar el paquete de servidor HTTP (http-server) para servir la aplicación
RUN npm install -g http-server

# Exponer el puerto que usará http-server
EXPOSE 8080

# Comando para iniciar http-server y servir la aplicación
CMD ["http-server", "-p", "8080", "."]
