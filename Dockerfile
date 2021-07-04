FROM node:16
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies
COPY . /app/
RUN npm install --only=production

ENTRYPOINT [ "node", "app" ]


# build environment
FROM node:16 as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@4.0 -g --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]   