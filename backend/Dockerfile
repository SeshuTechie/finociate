FROM openjdk:19-jdk-alpine
RUN apk add --no-cache tzdata
ARG JAR_FILE=target/finociate-*.jar
ADD ${JAR_FILE} finociate.jar
ENV APP_HOME=/usr/app
WORKDIR $APP_HOME
EXPOSE 8080
ENTRYPOINT ["java","-jar","/finociate.jar"]
