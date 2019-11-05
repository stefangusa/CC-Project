# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app
COPY public /app/public
COPY src /app/src
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm install axios@0.19.0 -g --silent
RUN npm install react-autosuggest@9.3.2 -g --silent

# start app
CMD ["npm", "start"]