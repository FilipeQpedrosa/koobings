'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'service', label: 'Service', path: '/book' },
  { id: 'datetime', label: 'Date & Time', path: '/book/datetime' },
  { id: 'staff', label: 'Provider', path: '/book/staff' },
  { id: 'details', label: 'Details', path: '/book/details' },
  { id: 'confirm', label: 'Confirm', path: '/book/confirm' }
];

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex(step => pathname === step.path);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8 hidden md:block">
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                          isActive && "border-primary bg-primary text-white",
                          isCompleted && "border-primary bg-primary text-white",
                          !isActive && !isCompleted && "border-gray-300 bg-white text-gray-500"
                        )}
                        initial={false}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                          backgroundColor: isActive || isCompleted ? "var(--primary)" : "#fff",
                        }}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </motion.div>
                      <span
                        className={cn(
                          "mt-2 text-sm font-medium",
                          isActive ? "text-primary" : "text-gray-500"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="mb-6 md:hidden">
            <div className="flex items-center justify-between px-4">
              <span className="text-sm font-medium text-gray-500">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {steps[currentStepIndex]?.label}
              </span>
            </div>
            <div className="mt-2 h-1 w-full bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 