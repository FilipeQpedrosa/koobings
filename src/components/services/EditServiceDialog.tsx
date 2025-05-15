'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Service, ServiceCategory, Staff } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  categoryId: z.string().min(1, 'Category is required'),
  providerIds: z.array(z.string()).min(1, 'At least one provider is required')
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  service: Service & {
    category: ServiceCategory | null
    providers: Staff[]
  }
  categories: ServiceCategory[]
  providers: Staff[]
  onClose: () => void
}

export default function EditServiceDialog({ service, categories, providers, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service.name,
      description: service.description || '',
      price: Number(service.price),
      duration: service.duration,
      categoryId: service.category?.id || '',
      providerIds: service.providers.map(p => p.id)
    }
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/business/services/${service.id}`, {
        method: 'PATCH',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to update service')

      toast({
        title: 'Success',
        description: 'Service updated successfully',
      })
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error updating service:', error)
      toast({
        title: 'Error',
        description: 'Failed to update service. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="providerIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Providers</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value, value])}
                    value={field.value[field.value.length - 1]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select providers" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map(providerId => {
                      const provider = providers.find(p => p.id === providerId)
                      return provider ? (
                        <div
                          key={provider.id}
                          className="flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full px-2 py-1"
                        >
                          <span className="text-sm">{provider.name}</span>
                          <button
                            type="button"
                            onClick={() => field.onChange(field.value.filter(id => id !== providerId))}
                            className="text-blue-700 hover:text-blue-900"
                          >
                            ×
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
