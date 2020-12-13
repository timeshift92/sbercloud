FROM node:14.15.0
 
WORKDIR /app
 
COPY package.json package.json

COPY . .

RUN npm install && npm run build2
 
EXPOSE 4000
 
CMD [ "node", "dist" ]