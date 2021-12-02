FROM node:14.16.1 as builder
WORKDIR /workspace
RUN npm i cross-env rimraf -g

COPY . .
# 构建前端执行代码包
RUN npm i \
    && npm run build

# 打包镜像
FROM nginx:1.11.6-alpine
RUN rm /etc/nginx/conf.d/default.conf
WORKDIR /usr/nginx/cloudiac-web
COPY --from=builder /workspace/build /usr/nginx/cloudiac-web
COPY --from=builder /workspace/iac.conf /etc/nginx/conf.d/
RUN chown -R nginx:nginx /usr/nginx/cloudiac-web
