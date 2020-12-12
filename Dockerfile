FROM node:14.15.0
 
WORKDIR /app
 
COPY package.json package.json
COPY package-lock.json package-lock.json
 
RUN npm install && npm run build
 
COPY . .
 
CMD [ "node", "dist/server.js" ]