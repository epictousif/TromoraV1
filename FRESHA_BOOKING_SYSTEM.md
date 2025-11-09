# Fresha-Style Salon Booking System

A complete, modern salon booking system built with React (frontend) and Node.js + MongoDB (backend), featuring a step-by-step booking flow similar to Fresha.

## 🚀 Features

### Frontend Features
- **Service Selection**: Interactive service catalog with cart functionality
- **Professional Selection**: Choose specific professionals or "Any Professional"
- **Date & Time Selection**: Real-time availability calendar with time slots
- **Payment Options**: Pay online or at salon with discount incentives
- **Booking Confirmation**: Instant confirmation with WhatsApp/SMS sharing
- **Mobile-First Design**: Responsive UI built with Tailwind CSS
- **Progress Tracking**: Visual step-by-step progress indicator

### Backend Features
- **RESTful API**: Complete booking flow endpoints
- **Real-time Availability**: Dynamic slot calculation based on bookings
- **Referral System Integration**: First booking discounts for referred users
- **WhatsApp Integration**: Automated booking confirmation messages
- **Flexible Payment**: Support for online and offline payment methods
- **Professional Management**: Link services to specific professionals

## 📁 Project Structure

### Backend (`/trimora_backend`)
```
controllers/
├── freshaBookingController.js    # Main booking flow logic
routes/
├── freshaBookingRoutes.js        # Booking API endpoints
models/
├── Booking.js                    # Enhanced booking model
├── Saloon.js                     # Salon model with services
├── Employee.js                   # Professional model
├── EmployeeService.js            # Service-professional mapping
└── User.js                       # Customer model
```

### Frontend (`/Trimora/src/components/booking`)
```
booking/
├── FreshaBookingFlow.tsx         # Main orchestrator component
├── ServiceSelection.tsx          # Step 1: Service selection with cart
├── ProfessionalSelection.tsx     # Step 2: Professional choice
├── DateTimeSelection.tsx         # Step 3: Date & time picker
├── PaymentSelection.tsx          # Step 4: Payment options
├── BookingConfirmation.tsx       # Step 5: Confirmation & sharing
├── BookingPage.tsx              # Route wrapper component
└── BookingDemo.tsx              # Demo page with sample salons
```

## 🛠 API Endpoints

### Fresha Booking API (`/api/v1/fresha`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/salon/:id/services` | Get salon services grouped by category |
| GET | `/salon/:id/professionals` | Get salon professionals with ratings |
| GET | `/salon/:id/slots?date=YYYY-MM-DD` | Get available time slots for date |
| POST | `/book` | Create new booking |
| GET | `/confirmation/:bookingId` | Get booking confirmation details |

### Request/Response Examples

#### Get Salon Services
```javascript
GET /api/v1/fresha/salon/66b8f123456789abcdef0001/services

Response:
{
  "status": "success",
  "services": {
    "Hair": [
      {
        "id": "service_id",
        "name": "Hair Cut",
        "price": 199,
        "duration": 30,
        "description": "Professional haircut",
        "category": "Hair",
        "employee": {
          "name": "John Doe",
          "rating": 4.8
        }
      }
    ]
  }
}
```

#### Create Booking
```javascript
POST /api/v1/fresha/book

Request:
{
  "salonId": "66b8f123456789abcdef0001",
  "services": [
    {
      "id": "service_id",
      "name": "Hair Cut",
      "price": 199,
      "duration": 30
    }
  ],
  "professionalId": "employee_id", // or null for any professional
  "appointmentDate": "2024-08-28",
  "appointmentTime": "14:30",
  "paymentMethod": "pay_at_salon", // or "pay_online"
  "notes": "Please use organic products"
}

Response:
{
  "status": "success",
  "booking": {
    "id": "TR-ABC123-XYZ",
    "totalPrice": 199,
    "discountApplied": true,
    "discountAmount": 20,
    // ... other booking details
  }
}
```

## 🎯 User Flow

### 1. Service Selection
- Browse services by category (Hair, Facial, Nail, etc.)
- Add services to cart with [+] button
- View live total price and duration
- Remove or adjust quantities
- Continue to professional selection

### 2. Professional Selection
- Choose "Any Professional" for fastest booking
- Or select specific professional with ratings/experience
- View professional specializations and booking count
- Continue to date/time selection

### 3. Date & Time Selection
- Interactive calendar with available dates
- Real-time slot availability based on salon hours
- 30-minute interval time slots
- Prevents booking past dates/times
- Shows salon working hours

### 4. Payment Selection
- **Pay at Salon**: No advance payment, pay on arrival
- **Pay Online**: 5% discount, instant confirmation
- Booking summary with total price and duration
- Secure payment processing (Stripe/Razorpay ready)

### 5. Confirmation
- Instant booking confirmation with unique ID
- WhatsApp sharing with formatted message
- SMS sharing option
- Booking details with salon information
- Option to make another booking

## 🔧 Setup Instructions

### Backend Setup
1. Navigate to backend directory:
```bash
cd trimora_backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/trimora
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd Trimora
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Access the System
- **Demo Page**: `http://localhost:5173/booking-demo`
- **Direct Booking**: `http://localhost:5173/book/:salonId`
- **Backend API**: `http://localhost:3000/api/v1/fresha`

## 🧪 Testing the System

### 1. Using the Demo Page
Visit `/booking-demo` to see sample salons and test the complete booking flow.

### 2. Sample Salon IDs for Testing
```javascript
// Use these IDs in the booking URL: /book/:salonId
const sampleSalonIds = [
  '66b8f123456789abcdef0001', // Cheveux Vuitton
  '66b8f123456789abcdef0002', // Elite Hair Studio  
  '66b8f123456789abcdef0003'  // Royal Cuts Salon
];
```

### 3. Required Data Setup
For full functionality, ensure your database has:
- Salon records with services and working hours
- Employee records linked to salons
- EmployeeService records with pricing and duration
- User accounts for booking (authentication required)

## 🎨 UI/UX Features

### Design Principles
- **Mobile-First**: Responsive design optimized for mobile devices
- **Progressive Disclosure**: Step-by-step flow reduces cognitive load
- **Visual Feedback**: Progress indicators and loading states
- **Error Handling**: Graceful error messages and retry options
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Key Components
- **Service Cart**: Real-time price calculation with quantity controls
- **Professional Cards**: Rich profiles with ratings and specializations
- **Calendar Widget**: Custom calendar with availability highlighting
- **Payment Cards**: Clear payment options with discount indicators
- **Confirmation Page**: Comprehensive booking summary with sharing

## 🔗 Integration Points

### WhatsApp Integration
- Automatic message generation with booking details
- Direct salon contact via WhatsApp Business API
- Formatted messages with emoji and structure

### Payment Integration
- Ready for Stripe/Razorpay integration
- Discount system for online payments
- Referral system integration for first-booking discounts

### Notification System
- SMS integration ready
- Email confirmation system ready
- Push notification support ready

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables for production
3. Deploy to services like Heroku, Railway, or DigitalOcean
4. Update CORS settings for production frontend URL

### Frontend Deployment
1. Update API base URL in `src/utils/api.ts`
2. Build the project: `npm run build`
3. Deploy to Netlify, Vercel, or similar service
4. Configure routing for SPA (Single Page Application)

## 📊 Key Metrics & Analytics

### Booking Funnel Tracking
- Service selection completion rate
- Professional selection preferences
- Date/time selection patterns
- Payment method preferences
- Booking completion rate

### Performance Metrics
- Average booking completion time
- Most popular services and professionals
- Peak booking hours and days
- Revenue per booking session

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (customer, salon owner, admin)
- Secure password hashing with bcrypt

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting on API endpoints

## 🎯 Future Enhancements

### Planned Features
- **Real-time Chat**: Customer-salon communication
- **Review System**: Post-booking reviews and ratings
- **Loyalty Program**: Points and rewards system
- **Multi-location**: Support for salon chains
- **Advanced Scheduling**: Recurring appointments
- **AI Recommendations**: Service suggestions based on history

### Technical Improvements
- **Caching**: Redis for improved performance
- **Real-time Updates**: WebSocket for live availability
- **Offline Support**: PWA capabilities
- **Advanced Analytics**: Detailed booking insights
- **Multi-language**: Internationalization support

## 📞 Support

For questions or issues with the Fresha-style booking system:
1. Check the API documentation above
2. Review the component structure and props
3. Test with the demo page first
4. Ensure backend services are running
5. Verify database connections and sample data

---

**Built with ❤️ using React, Node.js, MongoDB, and Tailwind CSS**
