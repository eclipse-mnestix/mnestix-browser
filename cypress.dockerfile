FROM cypress/included:cypress-15.5.0-node-22.21.0-chrome-141.0.7390.107-1-ff-144.0-edge-141.0.3537.92-1

ENV NO_COLOR=1

RUN mkdir /cypress_Tests

WORKDIR /cypress_Tests

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN apt-get update && apt-get install -y python3 python3-setuptools make g++
RUN yarn install
 
# Enable setting additional argument on bin directly
ENTRYPOINT ["./node_modules/.bin/cypress"]