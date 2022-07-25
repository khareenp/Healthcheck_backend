FROM node:18-alpine
ARG ENVIRONMENT
ARG PORT
ENV SENTRYCLI_CDNURL=https://fs.demo-portal.com:12345/public/sentry-cli-Linux-x86_64

# set timezone
RUN  echo 'http://mirrors.ustc.edu.cn/alpine/v3.5/main' > /etc/apk/repositories \
    && echo 'http://mirrors.ustc.edu.cn/alpine/v3.5/community' >>/etc/apk/repositories \
    && apk update && apk add tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \ 
    && echo "Asia/Shanghai" > /etc/timezone

# Update
# RUN apk update && apk upgrade


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN ls -al /usr/src/app
RUN npm install --production --registry=https://registry.npm.taobao.org

#Set node env
ENV NODE_ENV $ENVIRONMENT

EXPOSE $PORT
CMD [ "npm", "start" ]
