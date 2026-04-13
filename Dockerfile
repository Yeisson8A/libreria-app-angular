# ---------- STAGE 1: Build ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- libreria-app-angular --configuration=production


# ---------- STAGE 2: Nginx ----------
FROM nginx:alpine

# Borrar config default
RUN rm /etc/nginx/conf.d/default.conf

# Copiar config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build Angular
COPY --from=build /app/dist/libreria-app-angular/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]