# Service Scheduler

A modern service management application for businesses like hair salons and medical practices. Built with Next.js, TypeScript, Tailwind CSS, Prisma, and Supabase.

## Features

- 🔐 Authentication with Supabase
- 📅 Business hours management
- 🛠️ Service management
- 👥 Staff management
- 📧 Email notifications
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase
- **Email**: Resend.com
- **Deployment**: Vercel (recommended)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/service-scheduler.git
cd service-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=your_database_url

# Email
RESEND_API_KEY=your_resend_api_key
```

4. Run database migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
service-scheduler/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   └── dashboard/      # Protected routes
│   ├── components/         # React components
│   │   └── onboarding/    # Onboarding wizard components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript types
├── prisma/                # Database schema and migrations
└── supabase/             # Supabase configurations
```

## API Routes

- `POST /api/business/hours` - Update business hours
- `POST /api/business/services` - Update services
- `GET /api/business/services` - Get services
- `POST /api/business/staff` - Update staff
- `GET /api/business/staff` - Get staff

## Database Schema

The application uses the following main models:

- `Business` - Business information
- `BusinessHours` - Operating hours
- `Service` - Available services
- `Staff` - Staff members
- `Appointment` - Scheduled appointments

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
