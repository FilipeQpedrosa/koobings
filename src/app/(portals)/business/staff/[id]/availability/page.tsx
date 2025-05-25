'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StaffAvailabilityManager } from '@/components/Staff/StaffAvailabilityManager';

export default function StaffAvailabilityPage() {
  const params = useParams();
  const staffId = params?.id;
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStaff() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/business/staff/${staffId}`);
        if (!res.ok) throw new Error('Failed to fetch staff');
        const data = await res.json();
        setStaff(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching staff');
      } finally {
        setLoading(false);
      }
    }
    if (staffId) fetchStaff();
  }, [staffId]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Staff Availability</h1>
      <div className="mb-4 text-gray-600">Staff ID: {staffId}</div>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : staff ? (
        <StaffAvailabilityManager staff={[staff]} />
      ) : (
        <div className="text-gray-400">Staff not found.</div>
      )}
    </div>
  );
} 