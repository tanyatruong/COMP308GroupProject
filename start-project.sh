#!/bin/bash

# Community Platform Startup Script
# COMP308 Group Project - Winter 2025

echo "🏘️ Starting Community Platform..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install server dependencies
echo -e "${YELLOW}Installing server dependencies...${NC}"
cd server
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install server dependencies${NC}"
    exit 1
fi

# Install client dependencies
echo -e "${YELLOW}Installing client dependencies...${NC}"
cd ../client/shell-app && npm install
cd ../auth-app && npm install
cd ../business-app && npm install
cd ../events-app && npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install client dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All dependencies installed successfully!${NC}"

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    echo -e "${YELLOW}Loading environment variables from .env file...${NC}"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}Please create a .env file with the following variables:${NC}"
    echo "MONGO_URI=your_mongodb_connection_string"
    echo "SECRET_KEY=your_jwt_secret_key"
    echo "GEMINI_API_KEY=your_gemini_api_key"
    echo ""
    echo -e "${YELLOW}You can copy .env.example to .env and fill in your values.${NC}"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$MONGO_URI" ] || [ -z "$SECRET_KEY" ] || [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}❌ Missing required environment variables!${NC}"
    echo -e "${YELLOW}Please ensure all required variables are set in your .env file:${NC}"
    echo "- MONGO_URI"
    echo "- SECRET_KEY" 
    echo "- GEMINI_API_KEY"
    exit 1
fi

echo -e "${BLUE}🚀 Starting server services...${NC}"
cd ../../server

# Start server services in background
echo -e "${YELLOW}Starting server services...${NC}"
npm run start:all &
SERVER_PID=$!

# Wait a moment for services to start
sleep 5

echo -e "${BLUE}🌐 Starting client applications...${NC}"

# Start client applications in background
cd ../client/shell-app
npm run dev &
SHELL_PID=$!

cd ../auth-app
npm run dev &
AUTH_PID=$!

cd ../business-app
npm run dev &
BUSINESS_PID=$!

cd ../events-app
npm run dev &
EVENTS_PID=$!

# Wait a moment for clients to start
sleep 3

echo -e "${GREEN}🎉 Community Platform is now running!${NC}"
echo "=================================="
echo -e "${BLUE}📱 Client Applications:${NC}"
echo -e "  • Shell App:     ${GREEN}http://localhost:5173${NC}"
echo -e "  • Auth App:      ${GREEN}http://localhost:3001${NC}"
echo -e "  • Business App:  ${GREEN}http://localhost:3003${NC}"
echo -e "  • Events App:    ${GREEN}http://localhost:5174${NC}"
echo ""
echo -e "${BLUE}🔧 Server Services:${NC}"
echo -e "  • Gateway:       ${GREEN}http://localhost:4000/graphql${NC}"
echo -e "  • Auth Service:  ${GREEN}http://localhost:4001/graphql${NC}"
echo -e "  • AI Service:    ${GREEN}http://localhost:4003/graphql${NC}"
echo -e "  • Business:      ${GREEN}http://localhost:4002/graphql${NC}"
echo -e "  • Community:     ${GREEN}http://localhost:4004/graphql${NC}"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all services${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all services...${NC}"
    kill $SERVER_PID $SHELL_PID $AUTH_PID $BUSINESS_PID $EVENTS_PID 2>/dev/null
    echo -e "${GREEN}✅ All services stopped.${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
