# a lot of build-time dependencies and files are not needed for running your application. With
# multi-stage builds these resources can be used during build while the runtime environment
# contains only what's necessary.
FROM node:20-alpine AS builder

# set our node environment.
ENV NODE_ENV build


RUN mkdir -p /usr/src/app \
    && chown node:node /usr/src/app
WORKDIR /usr/src/app

# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app.
USER node

# copy in our source code last, as it changes the most
# copy in as node user, so permissions match what we need
COPY --chown=node:node . .
# https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm ci \
    && npm run build

# ---

FROM node:20-alpine

# set our node environment.
ENV NODE_ENV production

RUN mkdir -p /usr/src/app \
    && chown node:node /usr/src/app
WORKDIR /usr/src/app

USER node

# copy only necessary production artifacts.
COPY --from=builder /usr/src/app/package*.json /usr/src/app/
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist/


# clean-up dependencies before production.
RUN npm ci --production \
    && npm cache clean --force

# default to port 4001 for node,
ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT

# using npm scripts don't pass OS signals to the code.
# This prevents problems with child-process, signal handling, graceful shutdown and having processes.
CMD ["node", "dist/main"]
