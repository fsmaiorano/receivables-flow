FROM nginx:alpine

# Copy pre-built app from the browser directory
COPY ./ui/receivables-flow-ui/dist/receivables-flow-ui/browser /usr/share/nginx/html

# Copy nginx configuration
COPY ./ui/receivables-flow-ui/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
