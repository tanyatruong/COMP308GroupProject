# 🎭 Demo Accounts & Test Data

This document contains all the demo accounts and test data created for the Community Platform.

## 🔑 Demo Account Credentials

**All passwords are: `password123`**

### 👥 Resident Accounts
1. **john_doe** - Community events, volunteering, local businesses
2. **sarah_johnson** - Technology, networking, food
3. **mike_chen** - Art, culture, community service
4. **emma_wilson** - Sports, fitness, outdoor activities
5. **david_brown** - Education, children, family events

### 🏢 Business Owner Accounts
1. **sarah_restaurant** - Sarah's Italian Bistro
2. **maria_cafe** - Maria's Coffee Corner
3. **john_gym** - FitLife Gym & Wellness
4. **sophie_salon** - Sophie's Beauty Studio
5. **alex_tech** - TechFix Computer Repair

### 👨‍💼 Community Organizer
1. **community_admin** - Community events and management

## 🏪 Business Profiles Created

### 1. Sarah's Italian Bistro
- **Location**: 123 King Street West, Toronto, M5V 3A8
- **Description**: Authentic Italian cuisine with fresh ingredients
- **Tags**: restaurant, italian, family-friendly, fine-dining
- **Rating**: 4.5/5
- **Offers**: 20% Off All Pasta Dishes (Tuesdays & Wednesdays)

### 2. Maria's Coffee Corner
- **Location**: 456 Bay Street, Toronto, M5H 2N2
- **Description**: Cozy neighborhood coffee shop
- **Tags**: coffee, cafe, pastries, wifi, remote-work
- **Rating**: 4.2/5
- **Offers**: Free Pastry with Coffee Purchase

### 3. FitLife Gym & Wellness
- **Location**: 789 Yonge Street, Toronto, M5B 2H1
- **Description**: State-of-the-art fitness facility
- **Tags**: gym, fitness, personal-training, group-classes, wellness
- **Rating**: 4.7/5
- **Offers**: New Member Special - 50% Off First Month

### 4. Sophie's Beauty Studio
- **Location**: 321 Bloor Street East, Toronto, M4Y 1W5
- **Description**: Full-service beauty salon
- **Tags**: salon, beauty, hair, nails, spa, styling
- **Rating**: 4.3/5
- **Offers**: Hair Cut & Style Package - $45

### 5. TechFix Computer Repair
- **Location**: 654 College Street, Toronto, M6G 1A1
- **Description**: Professional computer repair services
- **Tags**: computer-repair, tech-support, data-recovery, hardware, software
- **Rating**: 4.6/5
- **Offers**: Free Diagnostic for Computer Issues

## 📝 Community Posts Created

1. **Community Cleanup Day** - Monthly cleanup event
2. **Lost Dog - Please Help!** - Missing golden retriever
3. **New Art Gallery Opening** - Local art gallery announcement
4. **Block Party Planning Meeting** - Summer block party planning
5. **Free Computer Help Available** - Community tech support offer

## 🎉 Community Events Created

1. **Summer Music Festival** - Annual music festival with local bands
2. **Tech Workshop for Seniors** - Computer skills workshop
3. **Neighborhood Yard Sale** - Annual community yard sale

## ⭐ Sample Reviews Created

- **Sarah's Italian Bistro**: 5-star and 3-star reviews with responses
- **Maria's Coffee Corner**: 5-star review praising coffee and WiFi
- **FitLife Gym**: 5-star review highlighting facilities and staff
- **Sophie's Beauty Studio**: 4-star review praising haircut service
- **TechFix Computer Repair**: Reviews highlighting professional service

## 💡 Sample Offers Created

- Pasta discount at Italian restaurant
- Free pastry with coffee purchase
- Gym membership discount for new members
- Hair styling package deal
- Free computer diagnostic service

## 🧪 Testing Scenarios

### Business Owner Testing
1. Login as any business owner (e.g., `sarah_restaurant`)
2. View business profile and edit details
3. Create new promotional offers
4. Respond to customer reviews
5. View analytics and ratings

### Resident Testing
1. Login as any resident (e.g., `john_doe`)
2. Browse marketplace and view business details
3. Read and write reviews
4. Participate in community discussions
5. Join community events

### Community Organizer Testing
1. Login as `community_admin`
2. Create and manage community events
3. Moderate community discussions
4. View community engagement metrics

## 🌐 Access URLs

- **Business Dashboard**: http://localhost:3003
- **Resident Hub**: http://localhost:5173
- **Auth Interface**: http://localhost:3001
- **Events App**: http://localhost:5174
- **GraphQL Playground**: http://localhost:4000/graphql

## 📊 Database Statistics

- **Residents**: 5 accounts
- **Business Owners**: 5 accounts
- **Community Organizer**: 1 account
- **Business Profiles**: 5 profiles
- **Offers**: 5 promotional offers
- **Reviews**: 5 customer reviews
- **Community Posts**: 5 discussion posts
- **Comments**: 5 post comments
- **Events**: 3 community events

## 🔄 Data Refresh

To refresh the demo data, run:
```bash
node setup-demo-data.js
```

This will clear the existing data and create fresh demo accounts and content.

## 🚀 Production Deployment

After deploying to Render.com, you can seed the production database by:

1. **Connect to your deployed services**
2. **Run the setup script** with your production GraphQL endpoint:
   ```bash
   GRAPHQL_URL=https://your-gateway-url.onrender.com/graphql node setup-demo-data.js
   ```

This ensures your deployed application has all the demo data for testing.

---

**Note**: All demo data is created with realistic content and follows the platform's data structure. The accounts are designed to showcase different user types and business scenarios for comprehensive testing.
