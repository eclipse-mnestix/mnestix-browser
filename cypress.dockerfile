FROM node:18-slim
ENV NO_COLOR=1
RUN mkdir /cypress_Tests
WORKDIR /cypress_Tests
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN apt-get update && apt-get install -y --no-install-recommends \
  libgtk2.0-0 \
  libx11-xcb1 \
  libxkbcommon-x11-0 \
  libasound2 \
  fonts-chrome \
  chromium
RUN apt-get install -y python3 python3-setuptools make g++
 
RUN yarn add cypress --dev
 
RUN yarn install
# Enable setting additional argument on bin directly
ENTRYPOINT ["./node_modules/.bin/cypress"]
