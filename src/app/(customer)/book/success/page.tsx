import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function BookingSuccessPage() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-xl mx-auto text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Appointment Booked Successfully!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your appointment has been confirmed. You will receive a confirmation
          email with the details shortly.
        </p>
        <div className="mt-8 space-x-4">
          <Link
            href="/my-appointments"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View My Appointments
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 