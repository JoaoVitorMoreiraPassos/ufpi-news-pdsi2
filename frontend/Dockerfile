# Docker file for frontend application with nextjs

# Use the official lightweight Node.js 14 image
FROM node:20.17.0-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the frontend source code to the working directory less the node_modules
COPY . .

# Expose the port the app runs on
EXPOSE 3000


#  The Dockerfile is a text file that contains all the commands a user could call on the command line to assemble an image. Using the Dockerfile, we can create a Docker image that contains the frontend application. 
#  The Dockerfile starts by using the official lightweight Node.js 14 image as the base image. It sets the working directory to /usr/src/app and copies the package.json and package-lock.json files to the working directory. It then installs the dependencies using npm install. 
#  Next, it copies the frontend source code to the working directory and builds the frontend application using npm run build. The Dockerfile exposes port 3000 and serves the app using npm start. 
#  Step 3: Create a Dockerfile for the backend application 
#  Next, create a Dockerfile for the backend application.