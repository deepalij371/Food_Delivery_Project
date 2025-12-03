# Food Delivery Application

A microservices-based food delivery application built with Spring Boot, Spring Cloud, and React.

## Architecture

This project follows a microservices architecture with the following components:

### Backend Services

- **Discovery Server** (Port 8761) - Eureka service registry
- **API Gateway** (Port 8080) - Entry point for all client requests with JWT authentication
- **User Service** (Port 8081) - Handles user registration, authentication, and profile management
- **Restaurant Service** (Port 8082) - Manages restaurants and menu items
- **Order Service** (Port 8083) - Handles order creation and management

### Frontend

- **React Application** (Port 3000) - User interface for the application

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.1.5
- Spring Cloud 2022.0.4
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Netflix Eureka (Service Discovery)
- Spring Cloud Gateway
- Lombok

### Frontend
- React 19.2.0
- React Router DOM
- Axios
- React Scripts

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- MySQL 8.0+

## Environment Variables

Create a `.env` file or set the following environment variables:

```bash
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
```

## Getting Started

### 1. Start MySQL Database

Ensure MySQL is running and create the required databases:

```sql
CREATE DATABASE user_service_db;
CREATE DATABASE restaurant_service_db;
CREATE DATABASE order_service_db;
```

### 2. Build the Project

From the root directory:

```bash
mvn clean install
```

### 3. Start Services (in order)

```bash
# 1. Start Discovery Server
cd discovery-server
mvn spring-boot:run

# 2. Start API Gateway
cd api-gateway
mvn spring-boot:run

# 3. Start User Service
cd user-service
mvn spring-boot:run

# 4. Start Restaurant Service
cd restaurant-service
mvn spring-boot:run

# 5. Start Order Service
cd order-service
mvn spring-boot:run
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm start
```

## Access Points

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **User Service**: http://localhost:8081
- **Restaurant Service**: http://localhost:8082
- **Order Service**: http://localhost:8083

## API Endpoints

All requests go through the API Gateway (http://localhost:8080):

### User Service
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (authenticated)

### Restaurant Service
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/{id}` - Get restaurant details
- `GET /api/restaurants/{id}/menu` - Get restaurant menu

### Order Service
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details

## Project Structure

```
food-delivery-app/
├── discovery-server/       # Eureka Server
├── api-gateway/           # API Gateway with JWT filter
├── user-service/          # User management service
├── restaurant-service/    # Restaurant management service
├── order-service/         # Order management service
├── frontend/              # React frontend application
└── pom.xml               # Parent POM
```

## Development

### Adding a New Service

1. Create a new module in the parent POM
2. Add Spring Boot and Spring Cloud dependencies
3. Configure Eureka client
4. Add routes in API Gateway configuration

### Running Tests

```bash
mvn test
```

## License

This project is for educational purposes.
