FROM cypress/included:cypress-16.2.1-node-24.22.1-chrome-156.0.8078.73-1-ff-159.0-edge-156.0.4314.50-1

ENV NO_COLOR=1

RUN mkdir /cypress_Tests

WORKDIR /cypress_Tests

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN apt-get update && apt-get install -y python3 python3-setuptools make g++
RUN yarn install
 
# Enable setting additional argument on bin directly
ENTRYPOINT ["./node_modules/.bin/cypress"]