import { redirect } from 'next/navigation'

export default function ClientPage() {
  // Redirect to the client profile dashboard
  redirect('/client/profile')
} 