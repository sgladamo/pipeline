# Backend Architecture

## Overview

The backend is a .NET 6 Web API that provides RESTful endpoints for the manufacturing operations dashboard. It follows a layered architecture with clear separation of concerns.

## Project Structure

```
apps/api/
├── SA.Shield.Api/              # Main API project
│   ├── Controllers/            # API controllers
│   ├── Program.cs              # Application entry point
│   └── AuthoriseAttribute.cs   # Custom authorization
├── SA.Shield.Core/             # Core business logic
│   ├── Authentication/         # Auth services
│   ├── Activation/             # System activation
│   ├── Logging/                # Custom logging
│   └── Models/                 # Core models
├── SA.Shield.Operations/       # Operations domain
├── SA.Shield.Capacity/         # Capacity planning domain
├── SA.Shield.Despatch/         # Dispatch domain
└── SA.Shield.Boxing/           # Boxing operations domain
```

## Architecture Layers

### 1. API Layer (Controllers)
- **OperationsController**: Operations management endpoints
- **CapacityController**: Capacity planning endpoints
- **DespatchController**: Dispatch management endpoints
- **AuthenticationController**: Authentication endpoints
- **ActivationController**: System activation endpoints

### 2. Service Layer
- **OperationsService**: Business logic for operations
- **CapacityService**: Capacity planning and scheduling
- **DespatchService**: Dispatch operations
- **AuthenticationService**: User authentication
- **ActivationService**: System activation management

### 3. Data Access Layer
- **DbContext Classes**: Entity Framework contexts
- **Entity Models**: Database entity mappings
- **Repository Pattern**: Data access abstraction

### 4. Core Services
- **Logging**: Custom color console logging
- **Session Management**: User session handling
- **Configuration**: Environment-based settings

## Key Services

### OperationsService
Handles all operations-related business logic:
- Current operations retrieval
- Assembly operations management
- Picking operations
- Job priority updates
- Cell assignment updates

### CapacityService
Manages capacity planning and scheduling:
- Daily capacity generation (2020-2030)
- Cell capacity updates (7 cells: CELL01-CELL07)
- Job scheduling and allocation
- Lost hours tracking
- Priority-based job distribution

### AuthenticationService
Provides session-based authentication:
- Password-based login
- Session caching
- Session cleanup (60-second intervals)
- Remote IP tracking

## Database Integration

### Connection Management
All DbContexts use environment variables for connection:
```csharp
var server = Environment.GetEnvironmentVariable("SYSPRO_DB_SERVER");
var database = Environment.GetEnvironmentVariable("SYSPRO_DB_NAME");
var userId = Environment.GetEnvironmentVariable("SYSPRO_DB_USERID");
var password = Environment.GetEnvironmentVariable("SYSPRO_DB_PASSWORD");
```

### DbContext Classes
- **CapacityDbContext**: Capacity and WIP data
- **OperationsDbContext**: Operations and job data
- **OperationsKPIDbContext**: KPI-specific data
- **DespatchDbContext**: Dispatch data
- **BoxingJobDbContext**: Boxing operations

## Application Startup

### Program.cs Configuration
```csharp
// Services
builder.Services.AddControllers();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

// CORS
app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Custom logging
builder.Host.ConfigureLogging(builder => builder.ClearProviders().AddColorConsoleLogger());

// Initialization
var activationService = new ActivationService();
activationService.GenerateActivationCode();

var capacityService = new CapacityService();
capacityService.InitialiseCapacityTables();
capacityService.StartUpdater();
```

## Background Services

### Capacity Updater
- Runs every 60 seconds
- Updates all cell capacities
- Recalculates job allocations
- Maintains capacity vs. demand balance

### Session Manager
- Cleans expired sessions every 60 seconds
- Maintains active user sessions
- Tracks remote connections

## Security

### Authentication
- **AuthoriseAttribute**: Custom authorization filter
- **Session-based**: No JWT tokens
- **Password-based**: Simple password authentication
- **IP Tracking**: Remote connection logging

### CORS Configuration
- Allows all origins, methods, and headers
- Development-friendly configuration
- Should be restricted in production

## Logging

### Custom Logging System
- **ColorConsoleLogger**: Colored console output
- **LoggerSingleton**: Global logger instance
- **Structured Logging**: Consistent log format
- **Remote Info**: IP and port tracking

### Log Levels
- **Info**: General application flow
- **Debug**: Detailed operation information
- **Error**: Exception handling and errors

## Error Handling

### Exception Management
- Try-catch blocks in service methods
- Detailed error logging
- Graceful degradation
- User-friendly error responses

### Validation
- Model validation attributes
- Input sanitization
- Business rule validation

## Performance Considerations

### Database Access
- **Entity Framework**: ORM for data access
- **Connection Pooling**: Automatic connection management
- **Query Optimization**: Efficient LINQ queries
- **Async Operations**: Non-blocking database calls

### Caching
- **Distributed Memory Cache**: Session storage
- **In-Memory Caching**: Service-level caching
- **Database Caching**: Entity Framework caching

## Configuration

### Environment Variables
- **SYSPRO_DB_SERVER**: Database server
- **SYSPRO_DB_NAME**: Database name
- **SYSPRO_DB_USERID**: Database user
- **SYSPRO_DB_PASSWORD**: Database password

### Application Settings
- **appsettings.json**: Base configuration
- **appsettings.Development.json**: Development overrides
- **launchSettings.json**: Launch profiles

## Deployment

### Docker Support
- **Dockerfile**: Container configuration
- **Multi-stage builds**: Optimized images
- **Environment variables**: Runtime configuration

### Production Considerations
- **CORS restrictions**: Limit allowed origins
- **HTTPS enforcement**: Secure connections
- **Logging configuration**: Production log levels
- **Database security**: Connection string protection
