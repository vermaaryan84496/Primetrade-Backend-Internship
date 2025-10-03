# Scalability Note

This application is built for horizontal scaling based on industry best practices:

1.  **Stateless Design (JWT):** The API uses **JWT (JSON Web Tokens)**, making the service entirely stateless. This allows any incoming request to be handled by any server instance, which is crucial for scaling out.

2.  **Horizontal Scaling:** The application is designed to be placed behind a **Load Balancer (e.g., Nginx, AWS ELB)**. Scaling is achieved by simply increasing the number of running Spring Boot instances.

3.  **Potential for Microservices:** For extreme scaling, the current monolithic structure could be split into dedicated services, such as a separate **Authentication Service** and a **Task Management Service**, communicating via internal APIs or a message queue (Kafka/RabbitMQ).
