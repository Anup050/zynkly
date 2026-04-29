# Stage 1: Build the React Application
FROM node:18-alpine as build

WORKDIR /usr/src/app

# Build argument for the backend API URL
ARG REACT_APP_API_URL=http://localhost:30050/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm install

COPY . .
# We use npm run build (standard for create-react-app or vite)
RUN npm run build

# Stage 2: Serve the application with NGINX
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
# Note: create-react-app outputs to 'build/', Vite outputs to 'dist/'
# We'll assume build/ based on standard React, but can be updated to dist/ if it's Vite
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
