#!/bin/bash

# Exit on error
set -e

# Update packages
sudo apt update
sudo apt upgrade -y

# Install Docker and Docker Compose
echo "Installing Docker..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

# Create .env file from template
echo "Creating .env file..."
if [ ! -f ".env" ]; then
  # Generate a random JWT secret
  JWT_SECRET=$(openssl rand -hex 64)
  sed "s/replace_with_your_secret_key/$JWT_SECRET/g" .env.template > .env
  echo "Created .env file with generated JWT secret"
else
  echo ".env file already exists, using existing configuration"
fi

# Build and start containers
echo "Building and starting Docker containers..."
sudo docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Run database migrations and seeding
echo "Running database migrations and seeding..."
sudo docker-compose exec app npx drizzle-kit push
sudo docker-compose exec app npx tsx scripts/seed.ts

echo "Deploy script executed successfully! The application is now running at http://localhost:3000"