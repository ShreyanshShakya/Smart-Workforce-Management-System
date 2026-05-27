# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies (cache step)
RUN mvn dependency:go-offline -B
COPY src ./src
# Build the jar
RUN mvn clean package -DskipTests

# Stage 2: Create the production image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar
# Expose the standard port
EXPOSE 8081
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]