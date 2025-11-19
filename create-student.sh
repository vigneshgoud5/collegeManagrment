#!/bin/bash
# Script to create a student via API

# Check if server is running
if ! curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "❌ Server is not running. Please start the server first:"
    echo "   cd server && npm run dev"
    exit 1
fi

# Create student data
# Note: You'll need to login as academic first to get auth token
# For now, this shows the curl command structure

echo "Creating student: Sunny Reddy"
echo ""

# Convert dob from DD-MM-YYYY to ISO format
DOB="2005-03-18T00:00:00.000Z"

curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=YOUR_ACCESS_TOKEN_HERE" \
  -d "{
    \"email\": \"sunny@gmail.com\",
    \"password\": \"qwertyuiop\",
    \"firstName\": \"Sunny\",
    \"lastName\": \"Reddy\",
    \"dob\": \"$DOB\",
    \"contact\": {
      \"phone\": \"9948891448\"
    },
    \"department\": \"CSE\",
    \"year\": 3,
    \"avatarUrl\": \"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8hUz-P7Cz2ZKn2DEN_EvFhjwmRiURX7r9TA&s\"
  }"

echo ""
echo ""
echo "Note: You need to be logged in as academic user first."
echo "Replace YOUR_ACCESS_TOKEN_HERE with actual access token from login."

