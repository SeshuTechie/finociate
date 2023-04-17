# Project Build Script
# - Run this script from project root folder. Ex. ./build/build.sh

## Build angular project
cd finociate-ui
npm run build
#cp ./dist/finociate-ui ../backend/src/main/resources


## Build backend project
cd ../backend
mvn clean package
#docker build -t finociate:v0.1.0 .
