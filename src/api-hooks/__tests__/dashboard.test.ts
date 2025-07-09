import { renderHook } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { useDashboardStats } from '../dashboard/get-dashboard-stats'
import { useRevenueData } from '../dashboard/get-revenue-data'
import { useTopCustomers } from '../dashboard/get-customer-analytics'

// Mock the actual API calls
jest.mock('@/config/axios.config', () => ({
  get: jest.fn(),
}))

// Mock useQuery to return controlled data
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>

describe('Dashboard API Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useDashboardStats', () => {
    it('should call useQuery with correct parameters', () => {
      const mockData = {
        success: true,
        message: 'Success',
        stats: {
          pendingOrders: { value: 5, percentage: null },
          totalRevenue: { value: 50000, percentage: { increased: true, value: 10 } },
          totalCustomers: { value: 100, percentage: { increased: true, value: 5 } },
          totalSales: { value: 200, percentage: { increased: false, value: 2 } },
        },
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any)

      const { result } = renderHook(() => useDashboardStats())

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['dashboard-stats'],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
      })

      expect(result.current.data).toEqual(mockData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('should handle loading state', () => {
      mockUseQuery.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      } as any)

      const { result } = renderHook(() => useDashboardStats())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBe(null)
    })

    it('should handle error state', () => {
      const mockError = new Error('API Error')
      mockUseQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      } as any)

      const { result } = renderHook(() => useDashboardStats())

      expect(result.current.error).toBe(mockError)
      expect(result.current.data).toBe(null)
    })
  })

  describe('useRevenueData', () => {
    it('should call useQuery with correct parameters for weekly data', () => {
      const mockData = {
        success: true,
        message: 'Success',
        revenueData: [
          { name: 'Mon', total: 1000 },
          { name: 'Tue', total: 1500 },
        ],
        period: 'weekly',
        totalRevenue: 2500,
        orderCount: 10,
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any)

      const { result } = renderHook(() => useRevenueData('weekly'))

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['revenue-data', 'weekly'],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
      })

      expect(result.current.data).toEqual(mockData)
    })

    it('should handle different periods', () => {
      mockUseQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any)

      renderHook(() => useRevenueData('monthly'))

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['revenue-data', 'monthly'],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
      })
    })
  })

  describe('useTopCustomers', () => {
    it('should call useQuery with correct parameters', () => {
      const mockData = {
        success: true,
        message: 'Success',
        topCustomers: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            image: 'https://example.com/avatar.jpg',
            amountSpent: 5000,
            purchases: 10,
            lastPurchase: '2 days ago',
          },
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any)

      const { result } = renderHook(() => useTopCustomers())

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['top-customers'],
        queryFn: expect.any(Function),
        staleTime: 10 * 60 * 1000,
      })

      expect(result.current.data).toEqual(mockData)
    })

    it('should handle empty customer data', () => {
      const mockData = {
        success: true,
        message: 'Success',
        topCustomers: [],
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any)

      const { result } = renderHook(() => useTopCustomers())

      expect(result.current.data?.topCustomers).toEqual([])
    })
  })
})
