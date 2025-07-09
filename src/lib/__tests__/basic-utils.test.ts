import { formatCurrency, formateDate } from '../utils'

describe('Basic Utils Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency in ZAR', () => {
      const result = formatCurrency(1000)
      expect(result).toMatch(/R/)
      expect(result).toMatch(/1/)
    })

    it('should handle zero amount', () => {
      const result = formatCurrency(0)
      expect(result).toMatch(/R/)
      expect(result).toMatch(/0/)
    })

    it('should handle decimal amounts', () => {
      const result = formatCurrency(1234.56)
      expect(result).toMatch(/R/)
      expect(result).toMatch(/1/)
    })

    it('should handle large amounts', () => {
      const result = formatCurrency(1000000)
      expect(result).toMatch(/R/)
    })
  })

  describe('formateDate', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2024-01-15T10:30:00Z')
      const result = formateDate(testDate)
      
      // Should return a formatted date string
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle current date', () => {
      const result = formateDate(new Date())
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
