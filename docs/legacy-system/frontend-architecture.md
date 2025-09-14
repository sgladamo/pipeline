# Frontend Architecture

## Overview

The React application is a single-page application (SPA) built with TypeScript and Material-UI, providing a comprehensive manufacturing operations dashboard.

## Application Structure

```
apps/web/src/
├── core/                    # Core application components
│   ├── RootView/           # Main application shell
│   ├── HomeView/           # Dashboard home page
│   ├── LoginContainer/     # Authentication UI
│   ├── CarouselView/       # Rotating dashboard view
│   ├── ActivationView/     # System activation
│   └── models.ts           # Core type definitions
├── operations/             # Operations management
│   ├── OperationsDashboardView/
│   ├── AssemblyDashboardView/
│   ├── PickingDashboardView/
│   ├── PickingView/
│   └── models.ts
├── capacity/               # Capacity planning
│   ├── CapacityView/
│   ├── CapacityManager/
│   ├── CapacityKPIView/
│   └── models.ts
├── despatch/               # Dispatch management
│   ├── DespatchDashboardView/
│   ├── DespatchTable/
│   └── models.ts
└── resources/              # Static assets
    ├── images/
    └── svgs/
```

## Key Components

### RootView
The main application shell that provides:
- Navigation bar with theme toggle
- User authentication
- Route management
- Global context providers
- Search functionality

### Dashboard Views

#### OperationsDashboardView
- Displays current operations across all work centers
- Shows job status, priorities, and next operations
- Provides drill-down to specific job details
- Includes KPI metrics and performance indicators

#### AssemblyDashboardView
- Cell-based assembly operations (CELL01-CELL07)
- Real-time job tracking within assembly cells
- Machine-specific operation views
- Assembly time tracking

#### PickingDashboardView
- Material picking operations
- Pick list management
- Bin location tracking
- Quantity validation

#### CapacityView
- Visual capacity planning interface
- Drag-and-drop job scheduling
- Cell capacity utilization
- Lost hours tracking

#### DespatchDashboardView
- Order fulfillment tracking
- Dispatch status management
- Customer order visibility
- Packing instructions

## State Management

### Context Providers
- **CoreContext**: Global application state (authentication, search, activation)
- **OperationsContext**: Operations-specific state (current picking operations)

### Local State
- Component-level state using React hooks
- Local storage for user preferences
- Session management for authentication

## Data Flow

```
API Endpoints ←→ Fetch Services ←→ Components ←→ UI State
```

### Fetch Services
Each domain has its own fetch service:
- `core/fetch.ts` - Authentication and activation
- `operations/fetch.ts` - Operations data
- `capacity/fetch.ts` - Capacity planning data
- `despatch/fetch.ts` - Dispatch data

## UI Components

### Material-UI Integration
- **DataGrid**: For tabular data display
- **Charts**: ApexCharts integration for KPIs
- **Dialogs**: Modal dialogs for detailed views
- **Carousel**: Rotating dashboard views
- **Drag & Drop**: React Beautiful DnD for capacity planning

### Custom Components
- **TableRow Components**: Color-coded rows for different statuses
- **KPI Cards**: Performance metric displays
- **Search Components**: Global search functionality
- **Navigation Components**: App bar and menu system

## Routing

The application uses React Router v6 with the following routes:

- `/` - Home dashboard
- `/activation` - System activation
- `/carousel` - Rotating dashboard view
- `/operations` - Operations dashboard
- `/operations/kpis` - Operations KPIs
- `/assembly` - Assembly operations
- `/picking` - Picking operations
- `/picking/:job` - Specific job picking
- `/despatch` - Dispatch dashboard
- `/capacity` - Capacity planning
- `/capacity/kpis` - Capacity KPIs

## Styling

- **Material-UI Theme**: Custom theme with light/dark mode support
- **Emotion**: CSS-in-JS styling
- **Responsive Design**: Mobile-friendly layouts
- **Color Coding**: Status-based color schemes

## Key Dependencies

```json
{
  "@mui/material": "^5.10.3",
  "@mui/x-data-grid": "^5.12.3",
  "react-router-dom": "^6.3.0",
  "apexcharts": "^3.35.5",
  "react-beautiful-dnd": "^13.1.1",
  "react-cookie": "^4.1.1",
  "date-fns": "^2.29.1"
}
```

## Performance Considerations

- **Code Splitting**: Domain-based module organization
- **Lazy Loading**: Route-based code splitting
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: DataGrid for large datasets
- **Real-time Updates**: Polling-based data refresh

## Development Patterns

- **TypeScript**: Strong typing throughout
- **Functional Components**: Hooks-based architecture
- **Custom Hooks**: Reusable logic extraction
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during data fetching
