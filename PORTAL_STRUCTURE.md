# Portal Structure

## 1. Business & Staff Portal (`/src/app/(business)`)
```
/src/app/(business)/
├── dashboard/               # Business dashboard
│   ├── appointments/       # Appointment management
│   ├── services/          # Service management
│   ├── staff/            # Staff management
│   └── settings/         # Business settings
├── staff/                 # Staff-specific features
│   ├── dashboard/        # Staff dashboard
│   ├── schedule/         # Schedule management
│   ├── availability/     # Availability management
│   └── patients/         # Patient management
└── auth/                  # Authentication
    ├── business/         # Business authentication
    └── staff/           # Staff authentication

## 2. Customer Portal (`/src/app/(customer)`)
```
/src/app/(customer)/
├── dashboard/            # Customer dashboard
├── book/                # Booking flow
│   ├── services/        # Service selection
│   ├── staff/          # Staff selection
│   ├── datetime/       # Date/time selection
│   └── confirmation/   # Booking confirmation
├── appointments/        # Appointment management
├── profile/            # Profile management
└── auth/               # Customer authentication

## 3. Admin Portal (`/src/app/(admin)`)
```
/src/app/(admin)/
├── dashboard/           # Admin dashboard
├── businesses/         # Business management
│   └── [id]/          # Individual business management
├── settings/          # System settings
├── activities/        # Activity logs
├── verifications/     # Business verifications
└── auth/              # Admin authentication
```

## API Structure
```
/src/app/api/
├── admin/             # Admin API endpoints
├── business/          # Business API endpoints
├── staff/            # Staff API endpoints
├── customer/         # Customer API endpoints
└── common/           # Shared API endpoints
```

## Shared Components
```
/src/components/
├── business/         # Business-specific components
├── staff/           # Staff-specific components
├── customer/        # Customer-specific components
├── admin/           # Admin-specific components
└── common/          # Shared components
``` 