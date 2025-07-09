import { formatCurrency, formateDate, success200, error401, error500 } from '../utils'

describe('Utils Functions', () => {
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

  describe('API Response Functions', () => {
    describe('success200', () => {
      it('should return success response with data', () => {
        const testData = { message: 'Test success' }
        const response = success200(testData)
        
        expect(response.status).toBe(200)
        // Parse the response body
        const body = JSON.parse(response.body)
        expect(body.success).toBe(true)
        expect(body.message).toBe('Test success')
      })

      it('should handle empty data', () => {
        const response = success200({})
        expect(response.status).toBe(200)
        
        const body = JSON.parse(response.body)
        expect(body.success).toBe(true)
      })
    })

    describe('error401', () => {
      it('should return 401 error response', () => {
        const response = error401('Unauthorized access')
        expect(response.status).toBe(401)
        
        const body = JSON.parse(response.body)
        expect(body.success).toBe(false)
        expect(body.message).toBe('Unauthorized access')
      })

      it('should handle default message', () => {
        const response = error401()
        expect(response.status).toBe(401)
        
        const body = JSON.parse(response.body)
        expect(body.success).toBe(false)
        expect(body.message).toBeDefined()
      })
    })

    describe('error500', () => {
      it('should return 500 error response', () => {
        const testData = { error: 'Internal server error' }
        const response = error500(testData)
        expect(response.status).toBe(500)
        
        const body = JSON.parse(response.body)
        expect(body.success).toBe(false)
        expect(body.error).toBe('Internal server error')
      })

      it('should handle empty error data', () => {
        const response = error500({})
        expect(response.status).toBe(500)
        
        const body = JSON.parse(response.body)
        expect(body.success).toBe(false)
      })
    })
  })
})
