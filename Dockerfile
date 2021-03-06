# FROM keymetrics/pm2:latest-alpine

# WORKDIR /app
# COPY . /app
# RUN npm install
# EXPOSE 3000
# CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

FROM node:8
WORKDIR /app
COPY . /app
RUN npm install
CMD npm start
EXPOSE 3000

# FROM node:8
# WORKDIR /app
# COPY package.json /app
# RUN npm install
# RUN npm install -g nodemon
# RUN npm install pm2 -g
# COPY . /app
# CMD npm start && pm2 monit
# EXPOSE 3000