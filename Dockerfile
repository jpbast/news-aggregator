FROM node:20.16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json yarn.lock ./

# Install dependencies
RUN rm -rf node_modules yarn.lock && yarn install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]