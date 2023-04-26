# Project Build Script
# - Run this script from project root folder. Ex. ./build/build.sh

if [ $# != 1 ]
then
	echo "Build number is missing."
	echo "Give build number tag argument. Ex: $ build.sh v0.1.0"
	exit 1
fi

## Build angular project
cd finociate-ui
npm run build
#cp ./dist/finociate-ui ../backend/src/main/resources


## Build backend project
cd ../backend
mvn clean package
docker build -t finociate:$1 .
