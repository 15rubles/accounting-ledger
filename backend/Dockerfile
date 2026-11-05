# ---------- Stage 1: build the jar ----------
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copy only the wrapper and pom first, so dependencies get cached
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Now copy the source and build
COPY src src
RUN ./mvnw package -DskipTests -B

# ---------- Stage 2: run the jar ----------
FROM eclipse-temurin:25-jre
WORKDIR /app

RUN useradd --system --create-home appuser
USER appuser

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]