import { redirect } from 'next/navigation'

export default function CustomerPage() {
  // Redirect to the customer profile dashboard
  redirect('/customer/profile')
} 