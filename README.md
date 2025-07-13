# Ride and Food Delivery Backend System

This project is a scalable backend for a ride and food delivery system, built with **NestJS**, **TypeScript**, **MongoDB**, **Socket.io**, **Kafka**, **Redis**, and **Google Maps APIs**. It supports ride requests, food orders, real-time updates, and location-based services, emphasizing scalability, performance, and error handling. APIs are versioned under `/api/v1`.

## Features

- **API Versioning**: Endpoints prefixed with `/api/v1` (e.g., `/api/v1/rides`, `/api/v1/orders`).
- **Scalable APIs**: RESTful endpoints for authentication, user management, rides, and orders.
- **Real-Time Updates**: Socket.io with Redis adapter for real-time ride/order updates.
- **Event-Driven Architecture**: Kafka for asynchronous events (e.g., ride/order creation, updates).
- **Location-Based Services**: Google Maps APIs for distance and time calculations.
- **Authentication**: JWT-based with bcrypt password hashing.
- **Error Handling**: Custom HTTP exception filter for consistent responses.
- **Role-Based Access**: Decorators and guards for user roles (e.g., admin, user).
- **MongoDB**: Schemas for users, rides, and orders with indexing.

## Project Structure

```text
delivery-system-backend/
├── src/
│   ├── common/
│   │   ├── decorators/         # Custom decorators (e.g., roles)
│   │   ├── guards/             # Authentication guards
│   │   ├── interfaces/         # TypeScript interfaces
│   │   ├── dto/                # Data Transfer Objects
│   │   └── exceptions/         # Custom exception filters
│   ├── config/                 # Configuration for MongoDB, Kafka, Google Maps
│   ├── modules/
│   │   ├── v1/
│   │   │   ├── auth/           # Authentication module (JWT login)
│   │   │   ├── users/          # User management module
│   │   │   ├── rides/          # Ride request module
│   │   │   ├── orders/         # Food order module
│   │   │   └── v1.module.ts    # Versioned module aggregator
│   │   └── kafka/              # Kafka producer and consumer services
│   ├── app.module.ts           # Root application module
│   ├── main.ts                 # Application entry point
│   └── .env                    # Environment variables
├── docker-compose.yml          # Docker Compose for MongoDB, Kafka, Redis
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── test-delivery-system.ts     # Test script for APIs and Socket.io
└── README.md                   # Project documentation
```

## Prerequisites

- **Node.js** (v18 or later)
- **npm** (included with Node.js)
- **Docker** and **Docker Compose** (v2 or later)
- A valid **Google Maps API key** ([Google Cloud Console](https://console.cloud.google.com))

## Installation

1. **Clone the Repository**:

    ```bash
    git clone <repository-url>
    cd delivery-system-backend
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:  
    Create a `.env` file:

    ```env
    MONGODB_URI=mongodb://mongodb:27017
    MONGODB_DB_NAME=delivery_system
    KAFKA_BROKER=kafka:9092
    GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    JWT_SECRET=your_jwt_secret
    REDIS_HOST=redis
    REDIS_PORT=6379
    ```

    Replace `your_google_maps_api_key` and `your_jwt_secret` with valid values.

4. **Start Services with Docker Compose**:

    ```bash
    docker compose up -d
    ```

    This starts:
    - MongoDB (port `27018`)
    - ZooKeeper (port `2181`)
    - Kafka (port `9092`)
    - Redis (port `6379`)

5. **Create Kafka Topics**:

    ```bash
    docker exec delivery-app-backend-kafka-1 kafka-topics --create --topic ride.created --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1 --if-not-exists
    docker exec delivery-app-backend-kafka-1 kafka-topics --create --topic ride.updated --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1 --if-not-exists
    docker exec delivery-app-backend-kafka-1 kafka-topics --create --topic order.created --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1 --if-not-exists
    docker exec delivery-app-backend-kafka-1 kafka-topics --create --topic order.updated --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1 --if-not-exists
    ```

    Verify topics:

    ```bash
    docker exec delivery-app-backend-kafka-1 kafka-topics --list --bootstrap-server kafka:9092
    ```

6. **Verify Services**:

    ```bash
    docker ps
    ```

    Ensure `mongodb`, `zookeeper`, `kafka`, and `redis` are running.

## Running the Application

1. **Start the Application**:

    ```bash
    npm run start:dev
    ```

    The server runs on `http://localhost:3000` with APIs at `/api/v1`.

2. **Verify Connections**:
    - **MongoDB**: `mongodb://mongodb:27017/delivery_system`
    - **Kafka**: Consumes `ride.created`, `ride.updated`, `order.created`, `order.updated`
    - **Redis**: Socket.io scaling at `redis:6379`
    - **API**: Test endpoints with Postman or the test script

## Testing the Application

The `test-delivery-system.ts` script verifies APIs, Kafka, and Socket.io.

1. **Install Test Dependencies**:

    ```bash
    npm install axios socket.io-client kafkajs
    ```

2. **Run the Test Script**:

    ```bash
    npx ts-node test-delivery-system.ts
    ```

3. **Expected Behavior**:
    - Creates a user and JWT token (`/api/v1/auth/login`).
    - Creates a ride (`POST /api/v1/rides`) and order (`POST /api/v1/orders`).
    - Sends Kafka messages to `ride.created`, `ride.updated`, `order.created`, `order.updated`.
    - Socket.io client (with Redis adapter) joins rooms and logs `rideUpdate`, `orderUpdate` events.
    - Updates ride/order statuses, triggering Kafka and Socket.io events.

4. **Sample API Requests**:
    - **Create User**:

      ```bash
      curl -X POST http://localhost:3000/api/v1/users \
         -H "Content-Type: application/json" \
         -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
      ```

    - **Login**:

      ```bash
      curl -X POST http://localhost:3000/api/v1/auth/login \
         -H "Content-Type: application/json" \
         -d '{"email":"test@example.com","password":"password123"}'
      ```

    - **Create Ride** (use token from login):

      ```bash
      curl -X POST http://localhost:3000/api/v1/rides \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer <your_jwt_token>" \
         -d '{"userId":"test-user-id","pickupLocation":{"lat":40.7128,"lng":-74.0060},"dropoffLocation":{"lat":40.7589,"lng":-73.9851}}'
      ```

5. **Socket.io Testing**:  
    Connect a Socket.io client:

    ```javascript
    const io = require('socket.io-client');
    const socket = io('http://localhost:3000', { auth: { token: '<your_jwt_token>' } });
    socket.on('connect', () => {
      console.log('Connected');
      socket.emit('joinRide', '123');
    });
    socket.on('rideUpdate', (data) => console.log('Ride Update:', data));
    ```

    Save as `test-socket.js`, install `socket.io-client`, and run:

    ```bash
    node test-socket.js
    ```

6. **Kafka Testing**:  
    Test Kafka message consumption:

    ```bash
    docker exec -it delivery-app-backend-kafka-1 kafka-console-producer --topic ride.created --bootstrap-server kafka:9092
    ```

    Enter:

    ```json
    {"_id":"123","userId":"test-user-id","status":"pending"}
    ```

    Check application logs for:

    ```text
    Received ride.created: { value: { _id: '123', userId: 'test-user-id', status: 'pending' }, ... }
    ```

## Scalability Considerations

- **MongoDB**: Add indexes:

  ```javascript
  db.rides.createIndex({ userId: 1, status: 1 });
  db.orders.createIndex({ userId: 1, status: 1 });
  ```

- **Kafka**: Increase partitions for high throughput:

  ```bash
  docker exec delivery-app-backend-kafka-1 kafka-topics --alter --topic ride.created --partitions 4 --bootstrap-server kafka:9092
  ```

- **Socket.io**: Redis adapter ensures WebSocket scaling.
- **Google Maps API**: Cache distance matrix results.
- **Rate Limiting**: Implement API rate limiting for production.

## Troubleshooting

- **ZooKeeper Unhealthy**:
  - Check logs: `docker logs delivery-app-backend-zookeeper-1`.
  - Verify port `2181`: `sudo netstat -tuln | grep 2181`.
  - Test ZooKeeper:  
     `docker exec -it delivery-app-backend-zookeeper-1 echo ruok | nc localhost 2181`
- **Kafka Not Running**:
  - Check logs: `docker logs delivery-app-backend-kafka-1`.
  - Verify port `9092`: `sudo netstat -tuln | grep 9092`.
  - Reset consumer group offsets:

     ```bash
     docker exec delivery-app-backend-kafka-1 kafka-consumer-groups --bootstrap-server kafka:9092 --group delivery-consumer --reset-offsets --to-earliest --execute --all-topics
     ```

- **MongoDB Connection**: Ensure `mongodb:27017` is accessible.
- **Redis**: Verify `redis:6379` is running.
- **Socket.io Errors**: Ensure valid JWT token in `auth.token`.
- **Google Maps API**: Confirm API key is valid for Distance Matrix API.
- **Logs**: Check Kafka message processing:

  ```typescript
  @MessagePattern('ride.created')
  async handleRideCreated(@Payload() message: any) {
     console.log('Received ride.created:', message);
     // ...
  }
  ```

## Contributing

Contributions are welcome! Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
