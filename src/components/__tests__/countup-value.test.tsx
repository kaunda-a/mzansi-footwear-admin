import React from 'react'
import { render, screen } from '@testing-library/react'
import CountUpValue from '../countup-value'

// Mock react-countup
jest.mock('react-countup', () => {
  return function MockCountUp({ end, prefix }: { end: number; prefix?: string }) {
    return <span>{prefix}{end}</span>
  }
})

describe('CountUpValue', () => {
  it('should render value without currency prefix', () => {
    render(<CountUpValue value={100} />)
    
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('should render value with ZAR currency prefix when isCurrency is true', () => {
    render(<CountUpValue value={1000} isCurrency={true} />)
    
    expect(screen.getByText('R 1000')).toBeInTheDocument()
  })

  it('should handle zero value', () => {
    render(<CountUpValue value={0} isCurrency={true} />)
    
    expect(screen.getByText('R 0')).toBeInTheDocument()
  })

  it('should handle large values', () => {
    render(<CountUpValue value={1000000} isCurrency={true} />)
    
    expect(screen.getByText('R 1000000')).toBeInTheDocument()
  })

  it('should render without currency prefix by default', () => {
    render(<CountUpValue value={500} />)
    
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.queryByText('R 500')).not.toBeInTheDocument()
  })
})
