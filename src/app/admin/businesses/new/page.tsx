import BusinessOnboardingForm from '@/components/admin/BusinessOnboardingForm';

export default function NewBusinessPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Business</h1>
      <BusinessOnboardingForm />
    </div>
  );
} 