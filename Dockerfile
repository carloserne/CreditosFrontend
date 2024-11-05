# Usar una versión específica de Node.js
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación en modo producción
RUN ng build --configuration=production

# Usar nginx para servir la aplicación en producción
FROM nginx:alpine

# Eliminar la configuración predeterminada de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar el archivo de configuración personalizado de nginx
COPY nginx.conf /etc/nginx/conf.d

# Copiar la aplicación Angular construida en el directorio de nginx
COPY --from=build ./dist/creditos-front-end /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar el servidor de nginx
CMD ["nginx", "-g", "daemon off;"]
