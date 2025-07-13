# Ride and Food Delivery Backend System

This project is a scalable backend implementation for a ride and food delivery system, built with **NestJS**, **TypeScript**, **MongoDB**, **Socket.io**, **Kafka**, and **Google Maps APIs**. It supports ride requests, food orders, real-time updates, and location-based services, with a focus on scalability, performance, and error handling. The API is versioned under `/api/v1` to ensure future compatibility.

## Features

- **API Versioning**: All endpoints are prefixed with `/api/v1` (e.g., `/api/v1/rides`, `/api/v1/orders`).
- **Scalable APIs**: RESTful endpoints for authentication, user management, ride requests, and food orders.
- **Real-Time Updates**: Socket.io for real-time ride and order status updates.
- **Event-Driven Architecture**: Kafka for handling asynchronous events (e.g., ride/order creation and updates).
- **Location-Based Services**: Google Maps APIs for calculating distances and estimated times for rides.
- **Authentication**: JWT-based authentication with bcrypt for secure password hashing.
- **Error Handling**: Custom HTTP exception filter for consistent error responses.
- **Role-Based Access**: Decorators and guards for managing user roles (e.g., admin, user).
- **MongoDB**: Schemas for users, rides, and orders with indexing for performance.

## Project Structure

```
delivery-system-backend/
├── src/
│   ├── common/
│   │   ├── decorators/         # Custom decorators (e.g., roles)
│   │   ├── guards/            # Authentication guards
│   │   ├── interfaces/        # TypeScript interfaces
│   │   ├── dto/               # Data Transfer Objects
│   │   └── exceptions/        # Custom exception filters
│   ├── config/                # Configuration for MongoDB, Kafka, Google Maps
│   ├── modules/
│   │   ├── v1/
│   │   │   ├── auth/          # Authentication module (JWT login)
│   │   │   ├── users/         # User management module
│   │   │   ├── rides/         # Ride request module
│   │   │   ├── orders/        # Food order module
│   │   │   └── v1.module.ts   # Versioned module aggregator
│   │   └── kafka/             # Kafka producer and consumer services
│   ├── app.module.ts          # Root application module
│   ├── main.ts                # Application entry point
│   └── .env                   # Environment variables
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── test-delivery-system.ts    # Test script for APIs and Socket.io
└── README.md                  # Project documentation
```

## Prerequisites

- **Node.js** (v18 or later)
- **npm** (included with Node.js)
- **Docker** (for running MongoDB and Kafka)
- A valid **Google Maps API key** (obtain from [Google Cloud Console](https://console.cloud.google.com))

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
   Create a `.env` file in the root directory and add the following:

   ```
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=delivery_system
   KAFKA_BROKER=localhost:9092
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   JWT_SECRET=your_jwt_secret
   ```

   Replace `your_google_maps_api_key` and `your_jwt_secret` with valid values.

4. **Set Up MongoDB and Kafka with Docker**:
   - Start MongoDB:

     ```bash
     docker run -d -p 27017:27017 --name mongodb mongo
     ```

   - Start ZooKeeper and Kafka:

     ```bash
     docker run -d -p 2181:2181 --name zookeeper confluentinc/cp-zookeeper:7.3.0 \
       -e ZOOKEEPER_CLIENT_PORT=2181 \
       -e ZOOKEEPER_TICK_TIME=2000
     docker run -d -p 9092:9092 --name kafka --link zookeeper:zookeeper confluentinc/cp-kafka:7.3.0 \
       -e KAFKA_BROKER_ID=1 \
       -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
       -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
       -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
     ```

5. **Create Kafka Topics**:

   ```bash
   docker exec kafka kafka-topics --create --topic ride.created --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
   docker exec kafka kafka-topics --create --topic ride.updated --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
   docker exec kafka kafka-topics --create --topic order.created --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
   docker exec kafka kafka-topics --create --topic order.updated --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
   ```

## Running the Application

1. **Start the Application**:

   ```bash
   npm run start:dev
   ```

   The server will run on `http://localhost:3000` with APIs at `/api/v1` (e.g., `http://localhost:3000/api/v1/rides`).

2. **Verify Services**:
   - **MongoDB**: Ensure the container is running (`docker ps`) and the connection string is correct.
   - **Kafka**: Verify topics exist:

     ```bash
     docker exec kafka kafka-topics --list --bootstrap-server localhost:9092
     ```

   - **API**: Test endpoints using a tool like Postman or the provided test script.

## Testing the Application

A test script (`test-delivery-system.ts`) is included to verify the APIs, Kafka, and Socket.io integration.

1. **Install Test Dependencies**:

   ```bash
   npm install axios socket.io-client kafkajs
   ```

2. **Run the Test Script**:

   ```bash
   npx ts-node test-delivery-system.ts
   ```

3. **Expected Behavior**:
   - Creates a user and obtains a JWT token via `/api/v1/auth/login`.
   - Creates a ride (`POST /api/v1/rides`) and an order (`POST /api/v1/orders`).
   - Sends Kafka messages to `ride.created`, `ride.updated`, `order.created`, and `order.updated`.
   - Connects to Socket.io, joins ride/order rooms, and logs real-time updates.
   - Updates ride and order statuses, triggering Kafka and Socket.io events.

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
   - Connect a Socket.io client to `http://localhost:3000` with the JWT token in `auth.token`.
   - Emit `joinRide` or `joinOrder` with the respective `rideId` or `orderId`.
   - Listen for `rideUpdate` or `orderUpdate` events.

## Scalability Considerations

- **MongoDB**: Add indexes on `userId` and `status` fields for better query performance:

  ```javascript
  db.rides.createIndex({ userId: 1, status: 1 });
  db.orders.createIndex({ userId: 1, status: 1 });
  ```

- **Kafka**: Use multiple partitions for topics in production:

  ```bash
  docker exec kafka kafka-topics --alter --topic ride.created --partitions 4
  ```

- **Socket.io**: Implement a Redis adapter for scaling WebSocket connections.
- **Google Maps API**: Cache distance matrix results to reduce API calls.
- **Rate Limiting**: Add API rate limiting for production use.

## Troubleshooting

- **MongoDB Connection**: Verify the container is running (`docker ps`) and `MONGODB_URI` is correct.
- **Kafka Issues**: Check if the broker is running and topics exist. Reset consumer group offsets if needed:

  ```bash
  docker exec kafka kafka-consumer-groups --bootstrap-server localhost:9092 --group delivery-consumer --reset-offsets --to-earliest --execute --all-topics
  ```

- **Socket.io Errors**: Ensure clients send a valid JWT token in `auth.token`. Check server logs for connection issues.
- **Google Maps API**: Verify the API key is valid and has access to the Distance Matrix API.
- **Logs**: Add logging in `KafkaConsumerService` for debugging:

  ```typescript
  @MessagePattern('ride.created')
  async handleRideCreated(@Payload() message: any) {
    console.log('Received ride.created:', message);
    try {
      const data = JSON.parse(message.value.toString());
      this.ridesGateway.notifyRideUpdate(data._id, data);
    } catch (error) {
      console.error('Failed to parse ride.created message:', error);
    }
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
