'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import CompanyInfoForm from '@/components/business/CompanyInfoForm';
import BusinessHoursForm from '@/components/business/BusinessHoursForm';
import ServiceSetupForm from '@/components/business/ServiceSetupForm';
import StaffSetupForm from '@/components/business/StaffSetupForm';

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOTAL_STEPS = 4;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/business/complete-onboarding', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      toast({
        title: 'Success',
        description: 'Onboarding completed successfully!',
      });

      router.push('/business/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to complete onboarding',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Company Info' },
    { number: 2, title: 'Business Hours' },
    { number: 3, title: 'Services' },
    { number: 4, title: 'Staff' },
  ];

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to Service Scheduler!</h1>
        <p className="text-gray-500 mt-2">Let's get your business set up in just a few steps.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.number === currentStep
                    ? 'bg-blue-600 text-white'
                    : step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              {step.number < TOTAL_STEPS && (
                <div
                  className={`w-16 h-1 ${
                    step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex space-x-2 text-sm text-gray-500">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <span className={currentStep === step.number ? 'text-blue-600 font-medium' : ''}>
                {step.title}
              </span>
              {index < steps.length - 1 && <span className="mx-2">•</span>}
            </div>
          ))}
        </div>
      </div>

      <Card className="max-w-4xl mx-auto p-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Company Information</h2>
            <CompanyInfoForm />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Business Hours</h2>
            <BusinessHoursForm />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Services</h2>
            <ServiceSetupForm />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Staff</h2>
            <StaffSetupForm />
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button
            onClick={currentStep === TOTAL_STEPS ? handleComplete : handleNext}
            disabled={isSubmitting}
          >
            {currentStep === TOTAL_STEPS
              ? isSubmitting
                ? 'Completing...'
                : 'Complete Setup'
              : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
} 