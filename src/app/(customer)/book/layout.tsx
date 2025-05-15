'use client';

import { usePathname, useSearchParams } from 'next/navigation';

const steps = [
  { id: 'service', label: 'Service' },
  { id: 'info', label: 'Your Information' },
  { id: 'date', label: 'Select Date' },
  { id: 'staff', label: 'Choose Staff' },
  { id: 'time', label: 'Select Time' },
  { id: 'summary', label: 'Review & Book' }
];

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentStep = pathname.split('/').pop() || 'service';
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                        ${isActive ? 'border-primary bg-primary text-white' : 
                          isCompleted ? 'border-primary bg-primary text-white' : 
                          'border-gray-300 bg-white text-gray-500'}`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className={`mt-2 text-xs ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
              
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200 -z-10">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 