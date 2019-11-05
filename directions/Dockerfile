FROM node:10

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN npm install -g nodemon
RUN npm install --silent

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]