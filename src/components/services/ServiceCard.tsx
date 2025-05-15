'use client'

import { useState } from 'react'
import { Service, ServiceCategory, Staff } from '@prisma/client'
import { useRouter } from 'next/navigation'
import EditServiceDialog from './EditServiceDialog'
import { useToast } from '@/components/ui/use-toast'

type ServiceWithRelations = Service & {
  category: ServiceCategory | null
  providers: Staff[]
}

interface ServiceCardProps {
  service: ServiceWithRelations
  categories: ServiceCategory[]
  providers: Staff[]
}

export default function ServiceCard({ service, categories, providers }: ServiceCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this service?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/business/services/${service.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete service')

      toast({
        title: 'Success',
        description: 'Service deleted successfully'
      })
      router.refresh()
    } catch (error) {
      console.error('Error deleting service:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete service. Please try again.',
        variant: 'destructive'
      })
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{service.name}</h3>
            {service.category && (
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600 mt-2">
                {service.category.name}
              </span>
            )}
          </div>
          <div className="flex items-start space-x-2">
            <div className="text-right">
              <p className="text-xl font-bold">${service.price.toString()}</p>
              <p className="text-sm text-gray-500">{service.duration} min</p>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-600 hover:text-blue-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-600 hover:text-red-600 p-1 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {service.description && (
          <p className="text-gray-600 mt-2">{service.description}</p>
        )}
        
        {service.providers.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Available Providers:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {service.providers.map(provider => (
                <span key={provider.id} className="text-sm bg-blue-50 text-blue-700 rounded-full px-2 py-1">
                  {provider.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {isEditing && (
        <EditServiceDialog
          service={service}
          categories={categories}
          providers={providers}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  )
}
