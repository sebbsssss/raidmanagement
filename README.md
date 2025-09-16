# X Raider Tracker System

A comprehensive solution for managing and monitoring X (Twitter) raiders with modern UI, role-based access, and automation capabilities.

## 🚀 Features

### Admin Dashboard
- **Complete Raider Management**: Monitor all 30 raiders with detailed profiles and activity tracking
- **Performance Analytics**: Real-time KPI tracking with 1,000+ impression requirements
- **Private Payment System**: Secure payment tracking ($10/day) visible only to admins
- **Verification Status**: Track X account verification status for all raiders
- **Modern UI**: Clean, professional interface with gradient cards and smooth animations

### Raider Dashboard
- **Personal Performance Tracking**: Submit and monitor individual performance metrics
- **X Account Integration**: Connect X accounts for streamlined verification
- **KPI Status Monitoring**: Real-time feedback on meeting daily impression requirements
- **Submission Management**: Easy-to-use forms for reporting engagement metrics

### Automation Features
- **X API Integration**: Automated verification of raider activity and engagement
- **Batch Processing**: Verify multiple raiders efficiently with rate limiting
- **Daily Reporting**: Automated generation of performance reports
- **Profile Verification**: Automatic checking of X account verification status

## 📁 Project Structure

```
raider-tracker/
├── src/
│   ├── App.jsx              # Main application with authentication and dashboards
│   ├── App.css              # Styling and animations
│   └── components/ui/       # Reusable UI components (shadcn/ui)
├── public/
├── package.json
└── vite.config.js

Additional Files:
├── x_api_automation.py      # Python automation script for X API integration
├── raider-tracker-docs.md   # Comprehensive documentation
├── system_design.md         # System architecture and design decisions
└── x_api_research.md        # X API capabilities and limitations research
```

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Authentication**: Mock authentication system (ready for backend integration)
- **Automation**: Python with X API integration
- **Deployment**: Ready for Vercel, Netlify, or AWS Amplify

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for automation features)

### Installation

1. **Clone and setup the React application:**
   ```bash
   cd raider-tracker
   npm install
   npm run dev
   ```

2. **Access the application:**
   - Open http://localhost:5173
   - **Admin Login**: username: `admin`, password: `password`
   - **Raider Login**: username: `raider1`, password: `password`

3. **Setup automation (optional):**
   ```bash
   python3 x_api_automation.py
   ```

## 👥 User Roles & Access

### Admin Access
- Full system overview with payment visibility toggle
- Raider management and verification status
- Performance analytics and KPI tracking
- Payment processing and earnings management

### Raider Access
- Personal dashboard with performance metrics
- Submission forms for daily reporting
- X account connection interface
- Individual KPI status and earnings (when applicable)

## 🔧 X API Integration

The system includes comprehensive X API integration for:

### Automated Verification
- **Profile Verification**: Check if raiders have verified X accounts
- **Activity Tracking**: Monitor retweets, likes, and engagement
- **Impression Validation**: Verify reported impression counts
- **Batch Processing**: Handle multiple raiders efficiently

### Rate Limiting & Compliance
- Built-in rate limiting to comply with X API restrictions
- Efficient batching to minimize API calls
- Error handling and retry mechanisms

### Usage Example
```python
from x_api_automation import RaiderTracker

tracker = RaiderTracker()

# Verify single raider
result = tracker.verify_raider_activity(
    'raider1', 
    'https://x.com/user/status/1234567890'
)

# Generate daily report for all raiders
raiders_data = [
    {'username': 'raider1', 'target_post_url': 'https://x.com/user/status/123'},
    {'username': 'raider2', 'target_post_url': 'https://x.com/user/status/123'},
    # ... up to 30 raiders
]

daily_report = tracker.generate_daily_report(raiders_data)
```

## 📊 KPI Requirements

### Daily Requirements (Per Raider)
- **Minimum Impressions**: 1,000+ daily
- **Payment Rate**: $10/day for meeting KPI
- **Verification**: Must have verified X account
- **Activity**: Must engage with specified posts

### Tracking Metrics
- Impressions count
- Likes, retweets, replies
- Account verification status
- Payment status and earnings
- Success rate percentage

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Option 2: Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Option 3: AWS Amplify
```bash
amplify init
amplify add hosting
amplify publish
```

## 🔮 Future Enhancements

### Immediate Improvements
- **Real Database**: Replace mock data with PostgreSQL/MongoDB
- **Secure Authentication**: Implement JWT-based auth with proper backend
- **Payment Integration**: Connect with Stripe/PayPal for automated payments
- **Real-time Updates**: WebSocket integration for live dashboard updates

### Advanced Features
- **AI-Powered Analytics**: Engagement prediction and optimization
- **Multi-Platform Support**: Extend to Instagram, TikTok, LinkedIn
- **Advanced Reporting**: Custom date ranges, export capabilities
- **Mobile App**: React Native companion app for raiders

## 📝 API Documentation

### X API Endpoints Used
- `GET /2/users/by/username/{username}` - User profile data
- `GET /2/users/{id}/tweets` - User timeline
- `GET /2/tweets/search/recent` - Tweet search

### Rate Limits
- **User lookup**: 300 requests per 15 minutes
- **Tweet lookup**: 300 requests per 15 minutes
- **Search**: 180 requests per 15 minutes

## 🤝 Support

For questions, issues, or feature requests:
1. Check the comprehensive documentation in `raider-tracker-docs.md`
2. Review the system design in `system_design.md`
3. Examine X API capabilities in `x_api_research.md`

## 📄 License

This project is created for raider management and tracking purposes. Ensure compliance with X API terms of service and applicable regulations when deploying to production.

---

**Built with ❤️ using modern web technologies and X API integration**
