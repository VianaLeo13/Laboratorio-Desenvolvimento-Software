# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar arquivo pom.xml primeiro (para cache de dependências)
COPY pom.xml .

# Baixar dependências (cache layer - otimiza builds futuros)
RUN mvn dependency:go-offline -B || true

# Copiar código fonte
COPY src ./src

# Compilar e criar o JAR
RUN mvn clean package -DskipTests

# Listar JARs gerados para debug
RUN ls -lh /app/target/*.jar

# Preparar o JAR executável
# O shade plugin substitui o JAR original (moedas-0.1.jar) com Main-Class
# Pega o JAR principal (não -sources, não -javadoc)
RUN JAR_FILE=$(find /app/target -name "moedas-*.jar" -not -name "*-sources.jar" -not -name "*-javadoc.jar" -type f | head -1) && \
    if [ -z "$JAR_FILE" ]; then \
      echo "ERRO: JAR não encontrado!" && \
      ls -lh /app/target/*.jar && \
      exit 1; \
    fi && \
    cp "$JAR_FILE" /app/target/app.jar && \
    echo "JAR copiado: $JAR_FILE" && \
    ls -lh /app/target/app.jar

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup -S appuser && adduser -S appuser -G appuser

# Copiar o JAR da aplicação preparado no stage de build
COPY --from=build --chown=appuser:appuser /app/target/app.jar app.jar

USER appuser:appuser

# Expor a porta (Render usa a variável PORT)
EXPOSE 8080

# Comando para executar a aplicação
# Render injeta a variável PORT automaticamente
ENTRYPOINT ["java", "-jar", "app.jar"]

