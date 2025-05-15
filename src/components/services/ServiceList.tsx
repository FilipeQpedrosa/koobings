import { Service, ServiceCategory, Staff } from '@prisma/client'
import ServiceCard from './ServiceCard'
import { Skeleton } from '@/components/ui/skeleton'

type ServiceWithRelations = Service & {
  category: ServiceCategory | null
  providers: Staff[]
}

interface ServiceListProps {
  services: ServiceWithRelations[]
  categories: ServiceCategory[]
  providers: Staff[]
  isLoading?: boolean
}

export default function ServiceList({ services, categories, providers, isLoading = false }: ServiceListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No services found. Create your first service to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map(service => (
        <ServiceCard
          key={service.id}
          service={service}
          categories={categories}
          providers={providers}
        />
      ))}
    </div>
  )
}
