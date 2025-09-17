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

# Set environment variables
export MONGO_URI="mongodb+srv://ttruong2811_db_user:QtOWE6rQXdM8eE5Q@clustercommunityhub.n3he34v.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCommunityHub"
export SECRET_KEY="4902a8b7f31345b8d3c4b1a6492acb594de87b4af133b2075bada73c2b07f9e076046de3b568bb7cf8dd0859fd1aa2ae01a4342bbaa5bd35d0ce31e2aab289c0adbca33064774ca9ad78ce05d44f54c51e577a22718a1cc997e0b46dfa518b942fa4962baa072761aaae628bc2486e912058f7388a1854fbb8889fe9fffb4bedc3523184f42d534bc78da33084a503c0234c6d1e225ad7d2ad8efdef723bfe0a9577bc8c8220a287d16db3f7cf3ba18875bb970575efe3812a1e1fca76780eecf4525e4425c3bb32e166d73c3b51af11774b6156522b4fb81ebda1d208b6c1dfc3b8b8de7bdc7aab861f21db5447a0cf1d42340d96f5dd61ec0d0f6818e02429"
export GEMINI_API_KEY="AIzaSyAPQ8MXrjfnP2FepffP26vNStUD1AHbDLs"

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
