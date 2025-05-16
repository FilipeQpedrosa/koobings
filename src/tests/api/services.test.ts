import { NextRequest } from 'next/server'
import { GET } from '@/app/api/services/route'
import { prisma } from '@/lib/prisma'
import { Service, ServiceCategory, Staff } from '@prisma/client'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    service: {
      findMany: jest.fn()
    }
  }
}))

describe('Services API', () => {
  const mockDate = new Date('2025-05-15T08:25:46.489Z')
  const mockServices: (Service & {
    category: ServiceCategory | null
    providers: Staff[]
  })[] = [
    {
      id: '1',
      name: 'Test Service 1',
      description: 'Test Description 1',
      duration: 60,
      price: '100' as any, // Mock Decimal as string for testing
      businessId: '1',
      categoryId: '1',
      createdAt: mockDate,
      updatedAt: mockDate,
      category: {
        id: '1',
        name: 'Test Category',
        description: null,
        color: null,
        businessId: '1',
        createdAt: mockDate,
        updatedAt: mockDate
      },
      providers: [
        {
          id: '1',
          name: 'Test Provider',
          email: 'test@example.com',
          role: 'PROVIDER',
          password: 'hashed',
          businessId: '1',
          lastActive: null,
          mfaEnabled: false,
          createdAt: mockDate,
          updatedAt: mockDate
        }
      ]
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns all services when no filters are applied', async () => {
    const mockPrismaFindMany = prisma.service.findMany as jest.Mock
    mockPrismaFindMany.mockResolvedValue(mockServices)

    const request = new NextRequest('http://localhost:3000/api/services')
    const response = await GET(request)
    const data = await response.json()

    expect(mockPrismaFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        OR: undefined,
        price: {
          gte: 0
        }
      },
      include: {
        category: true,
        providers: true
      },
      orderBy: {
        name: 'asc'
      }
    }))

    // Convert dates to strings for comparison
    const expectedServices = JSON.parse(JSON.stringify(mockServices))
    expect(data).toEqual(expectedServices)
  })

  it('applies search filter correctly', async () => {
    const mockPrismaFindMany = prisma.service.findMany as jest.Mock
    mockPrismaFindMany.mockResolvedValue(mockServices)

    const request = new NextRequest('http://localhost:3000/api/services?search=test')
    const response = await GET(request)
    await response.json()

    expect(mockPrismaFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        OR: [
          { name: { contains: 'test', mode: 'insensitive' } },
          { description: { contains: 'test', mode: 'insensitive' } },
          { category: { name: { contains: 'test', mode: 'insensitive' } } },
          { providers: { some: { name: { contains: 'test', mode: 'insensitive' } } } }
        ]
      })
    }))
  })

  it('applies price range filter correctly', async () => {
    const mockPrismaFindMany = prisma.service.findMany as jest.Mock
    mockPrismaFindMany.mockResolvedValue(mockServices)

    const request = new NextRequest('http://localhost:3000/api/services?minPrice=50&maxPrice=150')
    const response = await GET(request)
    await response.json()

    expect(mockPrismaFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        price: {
          gte: 50,
          lte: 150
        }
      })
    }))
  })

  it('applies duration filter correctly', async () => {
    const mockPrismaFindMany = prisma.service.findMany as jest.Mock
    mockPrismaFindMany.mockResolvedValue(mockServices)

    const request = new NextRequest('http://localhost:3000/api/services?duration=60')
    const response = await GET(request)
    await response.json()

    expect(mockPrismaFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        duration: 60
      })
    }))
  })

  it('applies sort correctly', async () => {
    const mockPrismaFindMany = prisma.service.findMany as jest.Mock
    mockPrismaFindMany.mockResolvedValue(mockServices)

    const request = new NextRequest('http://localhost:3000/api/services?sort=price-asc')
    const response = await GET(request)
    await response.json()

    expect(mockPrismaFindMany).toHaveBeenCalledWith(expect.objectContaining({
      orderBy: {
        price: 'asc'
      }
    }))
  })

  it('handles errors gracefully', async () => {
    const mockPrismaFindMany = prisma.service.findMany as jest.Mock
    mockPrismaFindMany.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/services')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Failed to fetch services' })
  })
}) 