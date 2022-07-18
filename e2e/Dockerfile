FROM cypress/base:16
WORKDIR /app

# dependencies will be installed only if the package files change
COPY package.json .
COPY package-lock.json .

ENV CI=1
RUN npm ci
RUN npm install axios
RUN npx cypress verify
