import { redirect } from 'next/navigation';

export default function AdminDashboardRedirect() {
  redirect('/admin/businesses');
  return null;
} 