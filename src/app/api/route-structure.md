# API Route Structure

## Authentication Routes
```
/api/auth/
├── [...nextauth]/      # NextAuth.js configuration
├── business/          # Business authentication
│   ├── signin/       # Business signin
│   └── signup/       # Business registration
├── staff/            # Staff authentication
│   ├── signin/       # Staff signin
│   └── signup/       # Staff registration
└── customer/         # Customer authentication
    ├── signin/       # Customer signin
    └── signup/       # Customer registration
```

## Business Routes
```
/api/business/
├── [businessId]/     # Business-specific operations
│   ├── metrics/     # Business metrics
│   ├── settings/    # Business settings
│   └── staff/       # Staff management
├── appointments/    # Appointment management
└── services/       # Service management
```

## Staff Routes
```
/api/staff/
├── [staffId]/       # Staff-specific operations
│   ├── schedule/   # Schedule management
│   └── services/   # Assigned services
└── availability/   # Availability management
```

## Customer Routes
```
/api/customer/
├── appointments/    # Customer appointments
├── bookings/       # Booking management
└── profile/        # Customer profile
```

## Admin Routes
```
/api/admin/
├── businesses/     # Business management
├── verifications/  # Business verification
└── settings/      # System settings
```

## Shared Routes
```
/api/shared/
├── health/        # Health check endpoint
└── utils/         # Utility endpoints
```

## Best Practices
1. Use middleware for:
   - Authentication
   - Rate limiting
   - Request validation
   - Error handling
   - Logging

2. API Versioning:
   - Include version in URL (/api/v1/...)
   - Or use Accept header

3. Response Format:
   ```typescript
   interface ApiResponse<T> {
     success: boolean;
     data?: T;
     error?: {
       code: string;
       message: string;
     };
     metadata?: {
       page?: number;
       limit?: number;
       total?: number;
     };
   }
   ```

4. Error Handling:
   - Use consistent error codes
   - Include helpful error messages
   - Log errors appropriately

5. Rate Limiting:
   - Implement per-route limits
   - Use Redis for distributed rate limiting
   - Include rate limit headers 