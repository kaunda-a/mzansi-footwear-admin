# Testing Guide

## Overview
This project uses Jest and React Testing Library for comprehensive testing of components, utilities, and API routes.

## Test Structure

```
src/
├── components/__tests__/          # Component tests
├── lib/__tests__/                 # Utility function tests
├── api-hooks/__tests__/           # API hook tests
__tests__/
├── api/                          # API route tests
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for CI
pnpm test:ci
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Uses Next.js Jest configuration
- JSdom test environment for React components
- Module path mapping for `@/` imports
- Coverage thresholds set to 70%

### Jest Setup (`jest.setup.js`)
- Testing Library Jest DOM matchers
- Mocks for Next.js router, NextAuth, React Query
- Polyfills for browser APIs

## Testing Patterns

### 1. Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', () => {
    const mockFn = jest.fn()
    render(<MyComponent onClick={mockFn} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockFn).toHaveBeenCalled()
  })
})
```

### 2. Utility Function Testing

```typescript
import { formatCurrency } from '../utils'

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1000)).toMatch(/R/)
  })
})
```

### 3. API Hook Testing

```typescript
import { renderHook } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { useDashboardStats } from '../get-dashboard-stats'

jest.mock('@tanstack/react-query')
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>

describe('useDashboardStats', () => {
  it('should call useQuery with correct parameters', () => {
    renderHook(() => useDashboardStats())
    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['dashboard-stats'],
      queryFn: expect.any(Function),
      staleTime: 5 * 60 * 1000,
    })
  })
})
```

### 4. API Route Testing

```typescript
import { GET } from '@/app/api/dashboard/stats/route'
import { getServerSession } from 'next-auth'

jest.mock('next-auth')
jest.mock('@/lib/prisma')

describe('/api/dashboard/stats', () => {
  it('should return 401 when not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null)
    
    const response = await GET()
    expect(response.status).toBe(401)
  })
})
```

## Mocking Strategies

### 1. Next.js APIs
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))
```

### 2. External Libraries
```typescript
jest.mock('react-countup', () => {
  return function MockCountUp({ end, prefix }) {
    return <span>{prefix}{end}</span>
  }
})
```

### 3. Database/Prisma
```typescript
jest.mock('@/lib/prisma', () => ({
  db: {
    user: { count: jest.fn() },
    order: { findMany: jest.fn() },
  },
}))
```

## Coverage Requirements

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking
- Mock external dependencies
- Use `jest.clearAllMocks()` in `beforeEach`
- Mock at the module level when possible

### 3. Assertions
- Use specific matchers (`toBeInTheDocument`, `toHaveBeenCalledWith`)
- Test both positive and negative cases
- Test edge cases (empty data, errors)

### 4. Component Testing
- Test user interactions, not implementation details
- Use `screen.getByRole` for accessibility
- Test error states and loading states

## Common Issues & Solutions

### 1. Next.js Response/Request Not Defined
```typescript
// In jest.setup.js
global.Response = Response
global.Request = Request
```

### 2. Module Path Resolution
```typescript
// In jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### 3. NextUI Component Warnings
```typescript
// Suppress console warnings in tests
beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})
```

## Test Examples

### Component with Error Boundary
```typescript
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error('Test error')
  return <div>No error</div>
}

it('should catch and display errors', () => {
  render(
    <ErrorBoundary>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )
  expect(screen.getByText('Something went wrong')).toBeInTheDocument()
})
```

### API Route with Authentication
```typescript
it('should require authentication', async () => {
  mockGetServerSession.mockResolvedValue(null)
  
  const response = await GET()
  const data = await response.json()
  
  expect(response.status).toBe(401)
  expect(data.success).toBe(false)
})
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Release builds

CI configuration includes:
- Coverage reporting
- Test result artifacts
- Failure notifications
