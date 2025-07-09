import { GET } from '@/app/api/dashboard/stats/route'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/prisma'

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  db: {
    order: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockDb = db as jest.Mocked<typeof db>

describe('/api/dashboard/stats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 when user is not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.message).toContain('Unauthorized')
  })

  it('should return dashboard stats when user is authenticated', async () => {
    // Mock authenticated session
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
    } as any)

    // Mock database responses
    mockDb.order.count
      .mockResolvedValueOnce(5) // pending orders
      .mockResolvedValueOnce(150) // total sales

    mockDb.order.aggregate.mockResolvedValue({
      _sum: { total: 50000 },
    } as any)

    mockDb.user.count
      .mockResolvedValueOnce(100) // total customers
      .mockResolvedValueOnce(10) // recent customers
      .mockResolvedValueOnce(8) // previous customers

    mockDb.order.findMany.mockResolvedValue([
      {
        total: 1000,
        orderDate: new Date('2024-01-15'),
        payment_verified: true,
        status: 'delivered',
      },
      {
        total: 1500,
        orderDate: new Date('2024-01-10'),
        payment_verified: true,
        status: 'ongoing',
      },
    ] as any)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.stats).toBeDefined()
    expect(data.stats.pendingOrders.value).toBe(5)
    expect(data.stats.totalRevenue.value).toBe(50000)
    expect(data.stats.totalCustomers.value).toBe(100)
    expect(data.stats.totalSales.value).toBe(150)
  })

  it('should handle database errors gracefully', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
    } as any)

    // Mock database error
    mockDb.order.count.mockRejectedValue(new Error('Database connection failed'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
  })

  it('should calculate percentage changes correctly', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
    } as any)

    // Mock database responses with specific data for percentage calculation
    mockDb.order.count
      .mockResolvedValueOnce(5) // pending orders
      .mockResolvedValueOnce(150) // total sales

    mockDb.order.aggregate.mockResolvedValue({
      _sum: { total: 50000 },
    } as any)

    mockDb.user.count
      .mockResolvedValueOnce(100) // total customers
      .mockResolvedValueOnce(12) // recent customers (last 15 days)
      .mockResolvedValueOnce(10) // previous customers (15-30 days ago)

    // Mock orders for revenue calculation
    const now = new Date()
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    mockDb.order.findMany.mockResolvedValue([
      {
        total: 2000,
        orderDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        payment_verified: true,
        status: 'delivered',
      },
      {
        total: 1000,
        orderDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        payment_verified: true,
        status: 'delivered',
      },
    ] as any)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.stats.totalCustomers.percentage).toBeDefined()
    expect(data.stats.totalCustomers.percentage.increased).toBe(true)
    expect(data.stats.totalCustomers.percentage.value).toBe(20) // (12-10)/10 * 100 = 20%
  })
})
