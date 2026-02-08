FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
RUN echo "Copiando coisas"
COPY . .
RUN ls -la
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
RUN echo "jar copiado\n"
RUN pwd
RUN ls -la
ENTRYPOINT ["java", "-jar", "/app/app.jar"]