ARG account=latest
ARG region=us-east-2

FROM ${account}.dkr.ecr.${region}.amazonaws.com/nginx:1.12-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

RUN rm /etc/nginx/conf.d/default.conf

COPY default.conf /etc/nginx/conf.d/default.conf

COPY ./dist .

CMD ["nginx","-g","daemon off;"]
