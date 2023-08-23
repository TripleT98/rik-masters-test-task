FROM node:16.14.2
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm i
RUN npm i -g @angular/cli@16.2.0
COPY . /app
RUN ng serve
