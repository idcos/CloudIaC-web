FROM nginx:1.21.6-alpine
ENV APPNAME cloudiac-web
ENV APPHOME /usr/nginx/$APPNAME
ADD *.tar ${APPHOME}
COPY iac.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/nginx/$APPNAME
COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]