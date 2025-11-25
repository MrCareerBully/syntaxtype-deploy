# # === Stage 1: Build the app ===
# FROM maven:3.9.9-eclipse-temurin-24-alpine AS builder

# WORKDIR /build

# COPY . .

# RUN mvn clean package -DskipTests -Dspring.main.web-application-type=none

# # === Stage 2: Run the app ===
# FROM openjdk:17-jdk-slim

# WORKDIR /app

# # Copy built jar from stage 1
# COPY --from=builder /build/target/demo-0.0.1-SNAPSHOT.jar app.jar

# EXPOSE 8080

# ENTRYPOINT ["java", "-jar", "/app/app.jar"]

# Build stage
FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -DskipTests package -DskipITs -B

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar --server.port=$PORT"]