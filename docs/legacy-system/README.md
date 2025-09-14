# Legacy System Documentation

This document provides a comprehensive overview of the current manufacturing pipeline system before SYSPRO business object integration.

## System Overview

The system is a manufacturing operations dashboard that provides real-time visibility into production workflows, capacity planning, and dispatch operations. It consists of a React frontend and a .NET Web API backend that integrates with a SYSPRO database.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   .NET API      │    │  SYSPRO DB      │
│   (apps/web)    │◄──►│   (apps/api)    │◄──►│   (External)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Main Business Domains

### 1. Operations Management
- **Current Operations**: Real-time view of jobs currently in production
- **Assembly Operations**: Cell-based assembly tracking (CELL01-CELL07)
- **Picking Operations**: Material picking and preparation
- **Boxing Operations**: Final packaging and preparation for dispatch

### 2. Capacity Planning
- **Cell Capacity**: Daily capacity tracking for 7 assembly cells
- **Job Scheduling**: Priority-based job allocation across cells
- **Resource Utilization**: Hours used vs. available capacity
- **Lost Hours Tracking**: Quality and other downtime tracking

### 3. Dispatch Management
- **To Be Picked**: Orders ready for picking
- **Large Shipments**: Oversized orders requiring special handling
- **Packing**: Orders in packing process
- **Completed**: Ready for dispatch

## Key Features

- **Real-time Dashboard**: Live updates of production status
- **Carousel View**: Rotating display of key metrics
- **Capacity Planning**: Visual capacity management with drag-and-drop scheduling
- **Priority Management**: Dynamic job priority adjustment
- **Authentication**: Session-based authentication system
- **Responsive Design**: Material-UI based modern interface

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **React Router** for navigation
- **ApexCharts** for data visualization
- **React Beautiful DnD** for drag-and-drop functionality

### Backend
- **.NET 6** Web API
- **Entity Framework Core** for data access
- **SQL Server** database integration
- **Session-based authentication**
- **Custom logging system**

### Database
- **SYSPRO Database** (external system)
- **Entity Framework DbContexts** for different domains
- **Environment-based connection strings**

## Documentation Structure

- [Frontend Architecture](frontend-architecture.md) - React application structure and components
- [Backend Architecture](backend-architecture.md) - .NET API structure and services
- [API Endpoints](api-endpoints.md) - Complete API documentation
- [Database Architecture](database-architecture.md) - Database schema and relationships
- [Data Models](data-models.md) - Entity models and DTOs
- [Business Processes](business-processes.md) - Workflow and business logic

## Integration Points

The system currently integrates with SYSPRO through direct database access using Entity Framework. Key integration points include:

- **WIP (Work in Progress) Tables**: Job tracking and operations
- **Capacity Tables**: Resource planning and scheduling
- **Dispatch Tables**: Order fulfillment tracking
- **Master Data**: Job priorities and configurations

## Future SYSPRO Integration

This system is being prepared for integration with SYSPRO Business Objects to replace direct database access with proper API integration, improving data consistency and system maintainability.
