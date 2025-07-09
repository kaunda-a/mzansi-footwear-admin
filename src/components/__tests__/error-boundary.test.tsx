import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../error-boundary/error-boundary'

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Mock useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress console.error for these tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should render error fallback when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Go Home')).toBeInTheDocument()
  })

  it('should show error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('should call retry function when Try Again is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const tryAgainButton = screen.getByText('Try Again')
    fireEvent.click(tryAgainButton)

    // After retry, the error should be cleared and children should render
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('should navigate to dashboard when Go Home is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const goHomeButton = screen.getByText('Go Home')
    fireEvent.click(goHomeButton)

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('should call custom error handler when provided', () => {
    const mockErrorHandler = jest.fn()

    render(
      <ErrorBoundary onError={mockErrorHandler}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(mockErrorHandler).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )
  })

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })
})
