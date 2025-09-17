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
   Create `.env` files in each service directory with:
   ```
   MONGO_URI=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Application

1. **Start all server services**
   ```bash
   cd server
   MONGO_URI="your_mongodb_uri" SECRET_KEY="your_secret_key" GEMINI_API_KEY="your_gemini_key" npm run start:all
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

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for COMP308 - Emerging Technologies**
