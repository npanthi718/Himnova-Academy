# Himnova AI Career Launchpad - Production Deployment Guide

## 1. Prerequisites & Cloud Architecture

The platform is architected for zero-downtime deployment on **AWS** utilizing:
- **AWS ECS (Fargate)** for containerized Next.js frontend and NestJS backend tasks.
- **AWS RDS (PostgreSQL 16)** with Multi-AZ redundancy and automatic daily snapshots.
- **AWS ElastiCache (Redis 7)** for BullMQ background queues and token rate limiting.
- **AWS S3 & CloudFront** for direct media uploads, HLS video delivery, and static assets.
- **AWS Secrets Manager** for centralized runtime credential rotation.

---

## 2. Docker Compose (Local Staging / On-Premise)

To spin up the complete self-contained stack locally:

```bash
# 1. Clone repository
git clone https://github.com/himnova/career-launchpad.git
cd himnova-career-launchpad

# 2. Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Launch full stack with Postgres, Redis, NestJS, and Next.js
docker compose up -d --build

# 4. Run database migrations and seed realistic development records
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run seed
```

Access points:
- **Frontend App**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:4000/api/v1`
- **Interactive Swagger Documentation**: `http://localhost:4000/api/docs`

---

## 3. AWS ECS Deployment Pipeline

### Step 1: Push Container Images to Amazon ECR
```bash
# Authenticate Docker to AWS ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-south-1.amazonaws.com

# Build & Push Backend
docker build -t himnova/backend -f infrastructure/docker/Dockerfile.backend .
docker tag himnova/backend:latest 123456789012.dkr.ecr.ap-south-1.amazonaws.com/himnova/backend:latest
docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/himnova/backend:latest

# Build & Push Frontend
docker build -t himnova/frontend -f infrastructure/docker/Dockerfile.frontend .
docker tag himnova/frontend:latest 123456789012.dkr.ecr.ap-south-1.amazonaws.com/himnova/frontend:latest
docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/himnova/frontend:latest
```

### Step 2: Register ECS Task & Update Service
```bash
aws ecs register-task-definition --cli-input-json file://infrastructure/aws/ecs-task-definition.json
aws ecs update-service --cluster himnova-prod-cluster --service himnova-launchpad-service --force-new-deployment
```
