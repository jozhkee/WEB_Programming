# RecipeHub - Recipe Sharing Platform

RecipeHub is a comprehensive recipe sharing web application built with **Next.js**, **React**, and **PostgreSQL**. Users can share, discover, and interact with recipes across various categories.

---

## Features

- **User Authentication**: Sign up, login, and user profiles  
- **Recipe Management**: Create, view, edit, and delete your recipes  
- **Interactive Comments**: Engage with other users through recipe comments  
- **Category Organization**: Browse recipes by categories  
- **Responsive Design**: Works across desktop and mobile devices  
- **Admin Dashboard**: Manage users, recipes, comments, and categories  

---

## Tech Stack

- **Frontend**: React, Next.js, Bootstrap 5  
- **Backend**: Next.js API routes  
- **Database**: PostgreSQL with Drizzle ORM  
- **Authentication**: JWT-based authentication  
- **Styling**: Bootstrap 5 with custom styles  

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)  
- PostgreSQL database  
- npm or yarn  

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/recipehub.git
   cd recipehub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   - Create a `.env` file based on `env.template` and update with your config

4. **Set up the database**:
   ```bash
   npm run db:setup
   ```

5. **Seed the database (optional)**:
   ```bash
   npm run db:seed
   ```

---

## Running the Application

### Development mode:
```bash
npm run dev
```

### Production build:
```bash
npm run build
npm start
```

---

## Usage

### User Features

- Sign up for an account  
- Browse recipes by category  
- View detailed recipe instructions and ingredients  
- Add comments to recipes  
- Create and manage your own recipes  

### Admin Features

- Access the admin dashboard at `/admin`  
- Manage all users (promote to admin, delete accounts)  
- Moderate recipes and comments  
- Create and manage recipe categories  

---

## Demo Accounts

After seeding the database, you can use the following accounts:

### Admin Account

- **Email**: `admin@example.com`  
- **Password**: `admin123`

### Regular User Accounts

- **Email**: `chef@example.com`  
  **Password**: `chef123`  

- **Email**: `foodie@example.com`  
  **Password**: `foodie123`

---

## Deployment with Docker

The project includes Docker configuration for easy deployment.

1. **Run the deployment script**:
   ```bash
   chmod +x deployment/deploy.sh
   ./deployment/deploy.sh
   ```

   This script will:

    1. **Install Docker and Docker Compose** (if not already installed)
    2. **Create a `.env` file** from the template with a secure JWT secret
    3. **Build and start the Docker containers**
    4. **Run database migrations and seed the database**
    5. **Access the application**: Once deployed, visit [http://localhost:3000](http://localhost:3000)

---

### Docker Configuration Details

**Containers**:
- Web application (Node.js/Next.js)
- PostgreSQL database

**Ports**:
- Web app: `3000`
- PostgreSQL: `5432`

**Data Persistence**:
- PostgreSQL data is stored in a Docker volume (`postgres_data`)

---

## License

This project is licensed under the MIT License.