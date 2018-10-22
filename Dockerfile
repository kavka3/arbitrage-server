FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install -g nodemon
# RUN npm install pm2 -g
# RUN pm2 start app.js
COPY . /app
CMD npm start
# RUN pm2 start app.js
EXPOSE 3000