# Factory-X Consumer Gateway image
#
# Based on the reference Dockerfile from the Factory-X
# "mxport-leo-gateway" project (openresty-sts-module/docker/Dockerfile).

FROM openresty/openresty:bookworm-fat

# Install lua-resty-http for STS HTTP calls
RUN opm get ledgetech/lua-resty-http

# Forward logs to stdout/stderr
RUN ln -sf /dev/stdout /usr/local/openresty/nginx/logs/access.log \
 && ln -sf /dev/stderr /usr/local/openresty/nginx/logs/error.log

COPY sts.lua /usr/local/openresty/lualib/sts.lua
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

EXPOSE 80
STOPSIGNAL SIGTERM
CMD ["openresty", "-g", "daemon off;"]
