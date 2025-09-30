# Bazaar API

Bazaar API is a Node.js + Express backend project designed as a modern online marketplace backend.  
It integrates **AWS services** (DynamoDB, Cognito, S3, etc.) to handle authentication, data persistence, and media storage.  
This project is meant to serve as both a portfolio-ready example and a playground for exploring scalable backend patterns.

---

## Features

- **User Authentication & Authorization**  
  - JWT-based authentication  
  - Role-based access (buyers, sellers, admins)  

- **Marketplace Functionality**  
  - User registration/login  
  - Sellers can list products  
  - Buyers can browse and purchase products  
  - Orders stored with DynamoDB  

- **AWS Integrations**  
  - DynamoDB: scalable NoSQL data storage  
  - S3: product image uploads  
  - Cognito (optional): managed authentication provider  
  - CloudWatch: logging & monitoring  

- **Middleware Examples**  
  - Global middleware for logging, request validation  
  - Route-specific middleware for access control  

- **Testing & CI/CD**  
  - Jest + Supertest for unit/integration tests  
  - GitHub Actions (or other CI/CD) for automated testing & deployment  

---

## Project Goals

- Build a **scalable Node.js/Express backend**  
- Gain hands-on experience with **AWS tools**  
- Showcase **authentication, middleware, testing, and deployment practices**  
- Provide a strong **portfolio project** for demonstrating backend engineering skills  

---

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/bazaar-api.git
   cd bazaar-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (e.g., AWS credentials, JWT secret, DynamoDB table names).

4. Run in development:
   ```bash
   npm run dev
   ```

5. Run tests:
   ```bash
   npm test
   ```

---

## Roadmap

- [ ] Set up project structure (Express + TypeScript optional)  
- [ ] Add authentication system (JWT + middleware)  
- [ ] Implement basic marketplace routes (users, products, orders)  
- [ ] Integrate AWS DynamoDB for persistence  
- [ ] Add image upload with S3  
- [ ] Add unit + integration tests  
- [ ] Configure GitHub Actions for CI/CD  

---

## License

MIT
