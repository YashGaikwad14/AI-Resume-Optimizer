# AI Resume Optimizer

A comprehensive, mobile-friendly resume optimization platform that analyzes your PDF resume, scores it against job descriptions, generates tailored content, and provides premium career tools with user authentication and subscription management.

## ✨ Features

### 🆓 Free Tools
- **Resume Analysis** - Detailed AI-powered feedback with actionable improvements
- **Match Scoring** - ATS-compatible keyword matching and scoring
- **Cover Letter Generation** - Tailored cover letters for specific job applications

### 💎 Premium Tools (Subscription Required)
- **ATS Optimizer** - Advanced ATS parsing rules and formatting optimization
- **Rewrite Bullets** - STAR framework + quantified impact rewrites
- **Skills Gap Analysis** - Personalized learning roadmap and skill recommendations
- **Resume Tailoring** - JD keyword mapping and targeted phrasing suggestions
- **Interview Questions** - Behavioral and technical questions with talking points
- **LinkedIn Optimization** - Headline options and About section suggestions

### 📱 Mobile-First Design
- **Responsive Layout** - Optimized for all screen sizes (mobile, tablet, desktop)
- **Touch-Friendly UI** - Large buttons and intuitive mobile navigation
- **Hamburger Menu** - Clean mobile navigation with collapsible menu
- **Mobile-Optimized Forms** - Easy file upload and text input on mobile devices

### 🔐 User Management
- **Authentication System** - Secure sign-up, sign-in, and password reset
- **Premium Subscriptions** - Tiered access to advanced tools
- **User Profiles** - Personalized experience with subscription status
- **Session Management** - Secure token-based authentication

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS v3** with custom design system
- **Recoil** for efficient state management
- **React Router** for navigation
- **Mobile-First** responsive design

### Backend
- **Node.js** with Express.js
- **JWT Authentication** for secure sessions
- **Supabase** for database and user management
- **Multer** for PDF file handling
- **PDF-Parse** for text extraction
- **Google Gemini AI** for content generation

### Database
- **Supabase PostgreSQL** for user data and premium status
- **JWT tokens** for session management
- **Password hashing** with bcrypt

## 📁 Project Structure

```
AI-Resume-Optimizer/
├── backend/
│   ├── models/
│   │   ├── auth.js          # Authentication & user management
│   │   ├── supabase.js      # Database connection
│   │   └── gemini.js        # AI API configuration
│   ├── routes/
│   │   └── auth.js          # Auth endpoints (/signup, /signin, /me, /upgrade)
│   ├── server.js            # Main server with premium-gated endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NewHeader.jsx        # Mobile-responsive navigation
│   │   │   ├── ToolsSection.jsx     # Free & premium tools UI
│   │   │   ├── ResultsUnified.jsx   # Results display with mobile optimization
│   │   │   └── ProtectedRoute.jsx   # Route protection
│   │   ├── pages/
│   │   │   ├── SignIn.jsx           # Authentication pages
│   │   │   ├── SignUp.jsx
│   │   │   ├── Pricing.jsx          # Premium subscription page
│   │   │   └── ForgotPassword.jsx
│   │   ├── Atoms/
│   │   │   └── atoms.js             # Recoil state management
│   │   ├── App.jsx                  # Main application component
│   │   └── main.jsx                 # Router configuration
│   └── package.json
├── README.md
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Google Gemini API Key**
- **Supabase Account** (for database)

### 1. Clone & Install
```bash
git clone <repository-url>
cd AI-Resume-Optimizer-main

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend** (create `backend/.env`):
```env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent

# Database Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_SECURE=false
MAIL_FROM=your_email@gmail.com
APP_BASE_URL=http://localhost:5173
```

**Database Setup** (Supabase):
1. Create a new Supabase project
2. Run this SQL to create the users table:
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_premium BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE password_resets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Start Development Servers

**Backend** (Terminal 1):
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## 📱 Mobile Features

### Responsive Design
- **Mobile-First** approach with Tailwind CSS breakpoints
- **Touch-Optimized** buttons and form elements
- **Hamburger Navigation** for mobile devices
- **Flexible Grid** layouts that adapt to screen size

### Mobile Navigation
- **Collapsible Menu** with smooth animations
- **Auto-Close** on navigation
- **Touch-Friendly** spacing and sizing

### Mobile Forms
- **Responsive Textarea** with appropriate height
- **File Upload** optimized for mobile
- **Touch-Friendly** buttons and inputs

## 🔐 Authentication & Premium Features

### User Authentication
- **Secure Sign-Up/Sign-In** with email validation
- **Password Reset** via email (SMTP configured)
- **JWT Token** based session management
- **Protected Routes** for authenticated users

### Premium Subscription
- **Tiered Access** - Free vs Premium tools
- **Subscription Management** - Easy upgrade/downgrade
- **Premium Gating** - Tools locked behind subscription
- **User Status** - Visual premium indicators

## 🎨 UI/UX Features

### Design System
- **Dark Theme** with HSL color variables
- **Gradient Accents** for visual appeal
- **Glow Effects** for interactive elements
- **Consistent Spacing** with Tailwind utilities

### User Experience
- **Copy-to-Clipboard** for all generated content
- **Collapsible Sections** for better organization
- **Auto-Scroll** to results when generated
- **Loading States** with visual feedback
- **Error Handling** with user-friendly messages

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `GET /auth/me` - Get user profile
- `POST /auth/upgrade` - Upgrade to premium (demo)
- `POST /auth/forgot` - Password reset request
- `POST /auth/reset` - Password reset confirmation

### Free Tools
- `POST /analyze` - Resume analysis
- `POST /score` - Match scoring
- `POST /cover-letter` - Cover letter generation

### Premium Tools (Requires Authentication + Premium)
- `POST /premium/ats-optimizer` - ATS optimization
- `POST /premium/rewrite-bullets` - Bullet rewriting
- `POST /premium/skills-gap` - Skills gap analysis
- `POST /premium/tailor` - Resume tailoring
- `POST /premium/interview-questions` - Interview prep
- `POST /premium/linkedin` - LinkedIn optimization

## 🛡 Security Features

- **Password Hashing** with bcrypt
- **JWT Token** authentication
- **CORS** protection
- **Input Validation** with Zod schemas
- **Rate Limiting** (recommended for production)
- **Environment Variables** for sensitive data

## 📊 State Management

### Recoil Atoms
- **File States**: `resumeFileState`, `jobDescriptionState`
- **UI States**: `loadingState`, `errorState`, `activeSectionState`
- **Results**: `resultsState`, `scoreState`, `coverLetterState`
- **Premium Tools**: `atsOptimizerState`, `rewriteBulletsState`, etc.
- **User Profile**: `userProfileState` (includes premium status)

### Benefits
- **No Prop Drilling** - Direct state access
- **Selective Re-renders** - Performance optimization
- **Clean Architecture** - Separation of concerns
- **Easy Debugging** - Recoil DevTools support

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku/DigitalOcean)
```bash
cd backend
# Set environment variables
npm start
```

### Environment Variables for Production
- Set all required environment variables
- Use production database URLs
- Configure proper CORS origins
- Set up email service for password resets

## 🐛 Troubleshooting

### Common Issues
- **"Unknown at rule @tailwind"** - Editor linting issue, build works fine
- **CORS errors** - Ensure backend CORS is configured for frontend URL
- **Database connection** - Verify Supabase credentials and table setup
- **Premium not working** - Check `is_premium` column exists in users table

### Development Tips
- Use Recoil DevTools for state debugging
- Check browser console for API errors
- Verify environment variables are loaded
- Test mobile responsiveness with browser dev tools

## 🗺 Roadmap

### Planned Features
- **Payment Integration** - Stripe/PayPal for real subscriptions
- **Export Functionality** - Generate updated DOCX/PDF files
- **Resume Templates** - Pre-designed resume layouts
- **Analytics Dashboard** - Usage statistics and insights
- **Multi-Language Support** - Internationalization
- **Team Accounts** - Shared premium subscriptions
- **API Rate Limiting** - Production-ready rate limiting
- **Advanced ATS Rules** - Industry-specific ATS optimization

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially mobile)
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub

---

**Built with ❤️ for job seekers everywhere**