FROM node:16.10.0

WORKDIR /app/FE

# Copy the rest of the project files
COPY ./ .

# Install dependencies
#RUN npm install -g serve
RUN npm install -f

# Build the React application
RUN npm run build

# RUN npm install -g serve

# Expose port 3010
EXPOSE 3000

# Serve the built application using serve
ENTRYPOINT ["npx", "serve", "-s", "build", "-l", "3000"]
