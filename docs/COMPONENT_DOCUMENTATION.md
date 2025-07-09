# Component Documentation

## Overview
This document provides detailed documentation for all React components in the Quirkify Dashboard application.

## Component Architecture

### Structure
```
src/components/
├── nav/                    # Navigation components
├── dashboard/              # Dashboard-specific components
├── forms/                  # Form components
├── error-boundary/         # Error handling components
├── ui/                     # Reusable UI components
└── shared/                 # Shared utility components
```

## Navigation Components

### Nav Component
Main navigation wrapper that provides the layout structure.

**Location:** `src/components/nav/nav.tsx`

**Props:**
```typescript
interface NavProps {
  children: React.ReactNode
}
```

**Usage:**
```tsx
<Nav>
  <DashboardContent />
</Nav>
```

**Features:**
- Responsive sidebar navigation
- Theme switching
- User authentication status
- Mobile-friendly hamburger menu

### Sidebar Component
Collapsible sidebar navigation with animated transitions.

**Location:** `src/components/nav/sidebar.tsx`

**Props:**
```typescript
interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}
```

**Features:**
- Framer Motion animations
- Role-based menu items
- Responsive behavior
- Icon-only collapsed state

## Dashboard Components

### DashboardClient Component
Main dashboard container that orchestrates all dashboard widgets.

**Location:** `src/components/dashboard/dashboard-client.tsx`

**Features:**
- Real-time data fetching
- Error boundary integration
- Loading states
- Responsive grid layout

### SummaryCard Component
Displays key metrics with percentage changes.

**Location:** `src/components/dashboard/summary/summary-card.tsx`

**Props:**
```typescript
interface SummaryCardProps {
  icon: LucideIcon
  title: string
  url: string
  color: string
  bgcolor: string
  value: number
  percentage?: {
    increased: boolean
    value: number
  } | null
  isCurrency?: boolean
}
```

**Usage:**
```tsx
<SummaryCard
  icon={Wallet}
  title="Total Revenue"
  url="/dashboard/revenue"
  color="text-indigo-500"
  bgcolor="bg-indigo-500"
  value={50000}
  percentage={{ increased: true, value: 10 }}
  isCurrency={true}
/>
```

### RevenueOverview Component
Interactive revenue chart with period selection.

**Location:** `src/components/dashboard/revenue/revenue-overview.tsx`

**Props:**
```typescript
interface RevenueOverviewProps {
  data: {
    weeklyData: Array<{ name: string; total: number }>
    monthlyData: Array<{ name: string; total: number }>
    yearlyData: Array<{ name: string; total: number }>
  }
}
```

**Features:**
- Recharts integration
- Period switching (weekly/monthly/yearly)
- Responsive design
- Tooltip interactions

### TopCustomers Component
Displays list of top customers by spending.

**Location:** `src/components/dashboard/top-customers.tsx`

**Props:**
```typescript
interface TopCustomersProps {
  data: Array<{
    id: string
    name: string
    email: string
    image: string
    amountSpent: number
    purchases: number
    lastPurchase: string
  }>
}
```

**Features:**
- Avatar images with fallbacks
- Formatted currency display
- Responsive list layout
- Click-to-view customer details

## Form Components

### ProductForm Component
Comprehensive form for creating and editing products.

**Location:** `src/components/forms/products/product-form.tsx`

**Props:**
```typescript
interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: ProductFormData) => void
  isLoading?: boolean
}
```

**Features:**
- React Hook Form integration
- Zod validation
- Image upload with Cloudinary
- Color variant management
- Category selection

### OrderForm Component
Form for creating and updating orders.

**Location:** `src/components/forms/orders/order-form.tsx`

**Features:**
- Customer selection
- Product selection with variants
- Address management
- Payment method selection
- Order total calculation

## Error Boundary Components

### ErrorBoundary Component
React error boundary with retry functionality.

**Location:** `src/components/error-boundary/error-boundary.tsx`

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}
```

**Usage:**
```tsx
<ErrorBoundary onError={handleError}>
  <SomeComponent />
</ErrorBoundary>
```

**Features:**
- Custom fallback UI
- Error logging
- Retry mechanism
- Development error details

### ApiErrorBoundary Component
Specialized error boundary for API errors.

**Location:** `src/components/error-boundary/api-error-boundary.tsx`

**Props:**
```typescript
interface ApiErrorBoundaryProps {
  error?: Error | null
  isLoading?: boolean
  onRetry?: () => void
  children: React.ReactNode
  fallbackMessage?: string
}
```

**Features:**
- Network error detection
- Timeout error handling
- HTTP status code recognition
- Retry functionality

## UI Components

### CountUpValue Component
Animated number counter with currency support.

**Location:** `src/components/countup-value.tsx`

**Props:**
```typescript
interface CountUpValueProps {
  value: number
  isCurrency?: boolean
}
```

**Usage:**
```tsx
<CountUpValue value={1000} isCurrency={true} />
// Displays: R 1,000
```

**Features:**
- React CountUp integration
- ZAR currency formatting
- Smooth animations

### LoadingSpinner Component
Reusable loading indicator.

**Location:** `src/components/ui/loading-spinner.tsx`

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}
```

### Modal Component
Reusable modal dialog.

**Location:** `src/components/ui/modal.tsx`

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
```

**Features:**
- NextUI Modal integration
- Keyboard navigation
- Focus management
- Responsive sizing

## Table Components

### DataTable Component
Generic data table with sorting and pagination.

**Location:** `src/components/tables/data-table.tsx`

**Props:**
```typescript
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
  }
  isLoading?: boolean
}
```

**Features:**
- TanStack Table integration
- Sorting capabilities
- Pagination support
- Loading states
- Responsive design

### RecentOrders Component
Specialized table for displaying recent orders.

**Location:** `src/components/dashboard/tables/recent-orders.tsx`

**Features:**
- Order status badges
- Customer information
- Payment status indicators
- Action buttons

## Chart Components

### AreaChart Component
Reusable area chart component.

**Location:** `src/components/charts/area-chart.tsx`

**Props:**
```typescript
interface AreaChartProps {
  data: Array<Record<string, any>>
  xKey: string
  yKey: string
  color?: string
  height?: number
}
```

### BarChart Component
Reusable bar chart component.

**Location:** `src/components/charts/bar-chart.tsx`

**Features:**
- Recharts integration
- Responsive design
- Custom tooltips
- Color theming

## Styling Guidelines

### CSS Classes
- Use Tailwind CSS utility classes
- Follow consistent spacing patterns
- Implement responsive design patterns

### Color Scheme
```css
/* Primary Colors */
--primary: #3B82F6      /* Blue */
--secondary: #10B981    /* Green */
--danger: #EF4444       /* Red */
--warning: #F59E0B      /* Yellow */

/* Neutral Colors */
--background: #FFFFFF   /* White */
--foreground: #1F2937   /* Dark Gray */
--muted: #6B7280        /* Gray */
```

### Typography
```css
/* Font Sizes */
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
```

## Best Practices

### Component Design
1. **Single Responsibility**: Each component should have one clear purpose
2. **Prop Validation**: Use TypeScript interfaces for all props
3. **Error Handling**: Wrap components in error boundaries
4. **Loading States**: Always handle loading and error states
5. **Accessibility**: Include proper ARIA labels and keyboard navigation

### Performance
1. **Memoization**: Use React.memo for expensive components
2. **Code Splitting**: Lazy load heavy components
3. **Image Optimization**: Use Next.js Image component
4. **Bundle Size**: Keep component dependencies minimal

### Testing
1. **Unit Tests**: Test component logic and rendering
2. **Integration Tests**: Test component interactions
3. **Accessibility Tests**: Ensure components are accessible
4. **Visual Tests**: Test responsive design

## Common Patterns

### Data Fetching
```tsx
function MyComponent() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData
  })

  return (
    <ApiErrorBoundary error={error} isLoading={isLoading} onRetry={refetch}>
      {data && <DataDisplay data={data} />}
    </ApiErrorBoundary>
  )
}
```

### Form Handling
```tsx
function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData
  })

  const onSubmit = (data) => {
    // Handle form submission
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### Modal Usage
```tsx
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
        <ModalContent />
      </Modal>
    </>
  )
}
```

## Migration Guide

### From Class to Function Components
When converting class components to function components:
1. Replace `componentDidMount` with `useEffect`
2. Replace state with `useState`
3. Replace lifecycle methods with appropriate hooks
4. Add proper TypeScript types

### NextUI Integration
When using NextUI components:
1. Import from `@nextui-org/react`
2. Wrap application in `NextUIProvider`
3. Use NextUI theme system
4. Follow NextUI component patterns
