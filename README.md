# 🏘️ Community Platform - COMP308 Group Project

A comprehensive community platform built with modern web technologies, featuring microservices architecture and AI-powered features.

## 📋 Project Overview

This is a full-stack community platform that connects residents, businesses, and community organizers. The platform includes features for business management, community discussions, help requests, and AI-powered insights.

### 🎯 Key Features

- **Business Dashboard**: Manage business profiles, promotions, and customer reviews
- **Resident Hub**: Access bulletin board, marketplace, and help requests
- **AI Integration**: Sentiment analysis for reviews and intelligent matching
- **Real-time Communication**: Community discussions and help request system
- **Modern UI**: Responsive design with professional styling

## 🏗️ Architecture

### Backend Services (Node.js + GraphQL)
- **Auth Service** (Port 4001): User authentication and authorization
- **AI Service** (Port 4003): AI-powered features and analysis
- **Business Events Service** (Port 4002): Business profiles, offers, and events
- **Community Service** (Port 4004): Community posts and discussions
- **Gateway** (Port 4000): Apollo Gateway for federated GraphQL

### Frontend Applications (React + Vite)
- **Shell App** (Port 5173): Main application shell
- **Auth App** (Port 3001): Authentication interface
- **Business App** (Port 3003): Business owner dashboard
- **Events App** (Port 5174): Events management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Gemini API key
- Render.com account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd COMP308GroupProject
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client/shell-app && npm install
   cd ../auth-app && npm install
   cd ../business-app && npm install
   cd ../events-app && npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy the environment template
   cp env.example .env
   
   # Edit the .env file with your actual credentials
   # MONGO_URI=your_mongodb_connection_string
   # SECRET_KEY=your_jwt_secret_key
   # GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Application

**Option 1: Use the startup script (Recommended)**
```bash
./start-project.sh
```

**Option 2: Manual startup**
1. **Start all server services**
   ```bash
   cd server
   npm run start:all
   ```

2. **Start client applications** (in separate terminals)
   ```bash
   # Shell App
   cd client/shell-app && npm run dev
   
   # Auth App
   cd client/auth-app && npm run dev
   
   # Business App
   cd client/business-app && npm run dev
   
   # Events App
   cd client/events-app && npm run dev
   ```

3. **Access the applications**
   - Main Shell: http://localhost:5173
   - Business Dashboard: http://localhost:3003
   - Auth Interface: http://localhost:3001
   - Events: http://localhost:5174
   - GraphQL Gateway: http://localhost:4000/graphql

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Apollo Server** - GraphQL server
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Google Gemini AI** - AI features

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Apollo Client** - GraphQL client
- **Bootstrap 5** - CSS framework
- **Bootstrap Icons** - Icon library
- **Formik + Yup** - Form handling

## 📁 Project Structure

```
COMP308GroupProject/
├── server/
│   ├── auth-service/          # Authentication service
│   ├── ai-service/           # AI features service
│   ├── business-events-service/ # Business & events service
│   ├── community-service/    # Community features service
│   └── gateway.js           # Apollo Gateway
├── client/
│   ├── shell-app/           # Main application shell
│   ├── auth-app/            # Authentication interface
│   ├── business-app/        # Business dashboard
│   └── events-app/          # Events management
└── README.md
```

## 🎨 Features

### Business Owner Features
- Create and manage business profiles
- Create promotional offers
- View and respond to customer reviews
- AI-powered sentiment analysis
- Dashboard with analytics

### Resident Features
- Community bulletin board
- Neighborhood help requests
- Local business marketplace
- Review and rate businesses
- Community discussions

### AI Features
- Review sentiment analysis
- Intelligent volunteer matching
- Community discussion summarization
- Business insights generation

## 🔧 Development

### Available Scripts

**Server:**
- `npm run start:all` - Start all services
- `npm run start:auth` - Start auth service only
- `npm run start:ai` - Start AI service only
- `npm run start:business` - Start business service only
- `npm run start:community` - Start community service only
- `npm run start:gateway` - Start gateway only

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- ESLint for code linting
- Prettier for code formatting
- Consistent naming conventions
- Component-based architecture

## 📊 Database Schema

### Key Collections
- **Users**: Residents, Business Owners, Community Organizers
- **Business Profiles**: Business information and settings
- **Offers**: Promotional offers and deals
- **Reviews**: Customer reviews and ratings
- **Posts**: Community bulletin board posts
- **Help Requests**: Neighborhood help requests
- **Events**: Community events and activities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of COMP308 - Emerging Technologies course at Centennial College.

## 👥 Team

**Group 1 - Winter 2025**
- **Tanya Truong** - Business Owner Features
- [Other team members]

## 🐛 Known Issues

- Some deprecated Apollo Server warnings (non-critical)
- MongoDB connection requires proper environment setup
- AI features require valid Gemini API key

## 🔮 Future Enhancements

- Real-time notifications
- Mobile app development
- Advanced AI features
- Payment integration
- Multi-language support
- Advanced analytics dashboard

## 🚀 Deployment on Render.com

### Quick Deploy with Blueprint

1. **Fork this repository** to your GitHub account
2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Sign up/login with your GitHub account
   - Click "New +" → "Blueprint"
   - Connect your forked repository
3. **Configure Environment Variables**:
   - Set `MONGO_URI` to your MongoDB Atlas connection string
   - Set `GEMINI_API_KEY` to your Google Gemini API key
   - Set `SECRET_KEY` (Render will auto-generate this)
4. **Deploy**: Click "Apply" and wait for all services to deploy
5. **Access your app**: Use the provided URLs from Render dashboard

### Manual Deployment

If you prefer manual setup:

1. **Create a MongoDB Database**:
   - Go to Render dashboard → "New +" → "Database"
   - Choose "MongoDB" → "Free" plan
   - Note the connection string

2. **Deploy Services** (in this order):
   ```
   1. auth-service
   2. business-service  
   3. community-service
   4. ai-service
   5. community-gateway
   6. shell-app (static site)
   7. business-app (static site)
   ```

3. **Environment Variables for each service**:
   ```
   NODE_ENV=production
   MONGO_URI=<your_mongodb_connection_string>
   SECRET_KEY=<generate_a_secure_random_string>
   GEMINI_API_KEY=<your_gemini_api_key>
   ```

4. **For Static Sites**, add:
   ```
   VITE_GRAPHQL_URL=https://your-gateway-url.onrender.com/graphql
   VITE_BUSINESS_APP_URL=https://your-business-app-url.onrender.com
   VITE_AUTH_APP_URL=https://your-shell-app-url.onrender.com
   ```

### Post-Deployment Setup

1. **Seed Demo Data**:
   ```bash
   # Run the setup script to create demo users and data
   node setup-demo-data.js
   ```

2. **Test the Application**:
   - Visit your shell app URL
   - Use demo credentials from `DEMO_ACCOUNTS.md`
   - Test all features and user flows

### Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ | - |
| `SECRET_KEY` | JWT secret key | ✅ | Auto-generated |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ | - |
| `NODE_ENV` | Environment mode | ❌ | `development` |
| `PORT` | Server port | ❌ | Service-specific |
| `VITE_GRAPHQL_URL` | GraphQL endpoint for clients | ❌ | `http://localhost:4000/graphql` |
| `VITE_BUSINESS_APP_URL` | Business app URL | ❌ | `http://localhost:3003` |
| `VITE_AUTH_APP_URL` | Auth app URL | ❌ | `http://localhost:5173` |

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for COMP308 - Emerging Technologies**
