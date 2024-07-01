# Étape 1 : Construction
FROM node:22-alpine as build

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Serveur Nginx pour déployer l'application
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée, si nécessaire
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
