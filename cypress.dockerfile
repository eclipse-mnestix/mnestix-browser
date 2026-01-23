FROM cypress/included:cypress-15.8.2-node-24.13.0-chrome-143.0.7499.192-1-ff-147.0-edge-143.0.3650.139-1

ENV NO_COLOR=1

RUN mkdir /cypress_Tests

WORKDIR /cypress_Tests

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN apt-get update && apt-get install -y python3 python3-setuptools make g++
RUN yarn install
 
# Enable setting additional argument on bin directly
ENTRYPOINT ["./node_modules/.bin/cypress"]