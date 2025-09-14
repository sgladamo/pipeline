# Database Architecture

## Overview

The system integrates with a SYSPRO database through Entity Framework Core. The database contains manufacturing operations data including work-in-progress (WIP), capacity planning, and dispatch information.

## Database Connection

### Connection Configuration
All database connections use environment variables:
- `SYSPRO_DB_SERVER`: Database server address
- `SYSPRO_DB_NAME`: Database name
- `SYSPRO_DB_USERID`: Database username
- `SYSPRO_DB_PASSWORD`: Database password

### Connection String Format
```csharp
Server={server};Database={database};User ID={userId};Password={password};
```

## DbContext Architecture

### CapacityDbContext
Manages capacity planning and WIP data.

**Tables:**
- `CapacityDays` - Daily capacity for each cell
- `CapacityJobs` - Jobs allocated to capacity days
- `CapacityLostHours` - Lost hours tracking
- `WipAssemblyTimes` - Assembly time calculations
- `WipMasters` - Job master data
- `WipJobAllLabs` - Job operation details

### OperationsDbContext
Handles operations and job tracking.

**Tables:**
- `WipJobAllLab` - Job operation details
- `WipCurrentOps` - Current operations view
- `WipJobPickList` - Material picking lists
- `WipMasters` - Job master data

### OperationsKPIDbContext
Manages KPI-specific data.

**Tables:**
- `KPIMRPForecasts` - MRP forecast data
- `KPIWIPCompleteJobs` - Completed jobs tracking

### DespatchDbContext
Handles dispatch operations.

**Tables:**
- `DespDashboard` - Dispatch dashboard data

### BoxingJobDbContext
Manages boxing operations.

**Tables:**
- `BoxingJobDetails` - Boxing job information

## Core Tables

### WipMaster
Job master data table.

```sql
CREATE TABLE WipMaster (
    Job NVARCHAR(50) PRIMARY KEY,
    Priority DECIMAL(18,2)
);
```

**Fields:**
- `Job` (string, PK): Job identifier
- `Priority` (decimal): Job priority for scheduling

### WipCurrentOp
Current operations view (keyless entity).

```sql
CREATE VIEW WIPCurrentOp AS
SELECT 
    Job,
    JobDescription,
    WorkCentre,
    StockCode,
    StockDescription,
    LowestOP,
    Priority,
    NextWorkCentre,
    NextWorkCentreIMachine,
    QtyToMake,
    IMachine,
    HoldFlag,
    DefaultBin,
    ExplodedDiagram,
    SOP,
    Complete
FROM [WIP Operations View];
```

**Fields:**
- `Job` (string): Job identifier
- `JobDescription` (string): Job description
- `WorkCentre` (string): Current work center
- `StockCode` (string): Stock code
- `StockDescription` (string): Stock description
- `LowestOP` (decimal): Lowest operation number
- `Priority` (decimal): Job priority
- `NextWorkCentre` (string): Next work center
- `NextWorkCentreIMachine` (string): Next machine
- `QtyToMake` (decimal): Quantity to manufacture
- `IMachine` (string): Current machine
- `HoldFlag` (char): Hold status
- `DefaultBin` (string): Default bin location
- `ExplodedDiagram` (string): Diagram reference
- `SOP` (string): Standard operating procedure
- `Complete` (char): Completion status

### WipJobAllLab
Job operation details.

```sql
CREATE TABLE WipJobAllLab (
    Job NVARCHAR(50),
    Operation INT,
    WorkCentre NVARCHAR(50),
    WorkCentreDesc NVARCHAR(100),
    OperCompleted CHAR(1),
    PlannedEndDate DATETIME,
    IMachine NVARCHAR(50),
    PRIMARY KEY (Job, Operation)
);
```

**Fields:**
- `Job` (string, PK): Job identifier
- `Operation` (int, PK): Operation number
- `WorkCentre` (string): Work center code
- `WorkCentreDesc` (string): Work center description
- `OperCompleted` (char): Operation completion status
- `PlannedEndDate` (datetime): Planned completion date
- `IMachine` (string): Machine assignment

### CapacityDay
Daily capacity tracking.

```sql
CREATE TABLE CapacityDay (
    CapacityDayId NVARCHAR(50) PRIMARY KEY,
    Day DATETIME NOT NULL,
    AvailableHours FLOAT NOT NULL,
    HoursUsed FLOAT NOT NULL,
    Cell NVARCHAR(50) NOT NULL
);
```

**Fields:**
- `CapacityDayId` (string, PK): Unique identifier
- `Day` (datetime): Date
- `AvailableHours` (double): Available capacity hours
- `HoursUsed` (double): Hours used by jobs
- `Cell` (string): Cell identifier (CELL01-CELL07)

### CapacityJob
Jobs allocated to capacity days.

```sql
CREATE TABLE CapacityJob (
    CapacityJobId NVARCHAR(50) PRIMARY KEY,
    CapacityDayId NVARCHAR(50) NOT NULL,
    Job NVARCHAR(50) NOT NULL,
    TimeUsed FLOAT NOT NULL,
    StockCode NVARCHAR(50),
    StockDescription NVARCHAR(100),
    Cell NVARCHAR(50),
    Priority FLOAT,
    Qty FLOAT,
    WorkCentre NVARCHAR(50),
    FOREIGN KEY (CapacityDayId) REFERENCES CapacityDay(CapacityDayId)
);
```

**Fields:**
- `CapacityJobId` (string, PK): Unique identifier
- `CapacityDayId` (string, FK): Reference to CapacityDay
- `Job` (string): Job identifier
- `TimeUsed` (double): Time allocated to job
- `StockCode` (string): Stock code
- `StockDescription` (string): Stock description
- `Cell` (string): Cell assignment
- `Priority` (double): Job priority
- `Qty` (double): Quantity
- `WorkCentre` (string): Work center

### CapacityLostHours
Lost hours tracking.

```sql
CREATE TABLE CapacityLostHours (
    Date DATETIME PRIMARY KEY,
    Quality FLOAT NOT NULL,
    Other FLOAT NOT NULL
);
```

**Fields:**
- `Date` (datetime, PK): Date
- `Quality` (double): Quality-related lost hours
- `Other` (double): Other lost hours

### WipAssemblyTime
Assembly time calculations.

```sql
CREATE TABLE WipAssemblyTime (
    Job NVARCHAR(50),
    StockCode NVARCHAR(50),
    StockDescription NVARCHAR(100),
    QtyToMake DECIMAL(18,2),
    IExpUnitRunTim DECIMAL(18,2),
    IMachine NVARCHAR(50),
    WorkCentre NVARCHAR(50),
    Priority DECIMAL(18,2),
    ConfirmedFlag CHAR(1),
    TotalTime DECIMAL(18,2),
    Complete CHAR(1)
);
```

**Fields:**
- `Job` (string): Job identifier
- `StockCode` (string): Stock code
- `StockDescription` (string): Stock description
- `QtyToMake` (decimal): Quantity to manufacture
- `IExpUnitRunTim` (decimal): Expected unit run time
- `IMachine` (string): Machine assignment
- `WorkCentre` (string): Work center
- `Priority` (decimal): Job priority
- `ConfirmedFlag` (char): Confirmation status
- `TotalTime` (decimal): Total assembly time
- `Complete` (char): Completion status

### WipJobPickList
Material picking lists.

```sql
CREATE TABLE WipJobPickList (
    Job NVARCHAR(50),
    StockDescription NVARCHAR(100),
    StockCode NVARCHAR(50),
    LongDesc NVARCHAR(200),
    UOM NVARCHAR(10),
    TotalReqd DECIMAL(18,2),
    Balance DECIMAL(18,2),
    Bin NVARCHAR(50),
    QtyIssued DECIMAL(18,2)
);
```

**Fields:**
- `Job` (string): Job identifier
- `StockDescription` (string): Stock description
- `StockCode` (string): Stock code
- `LongDesc` (string): Long description
- `UOM` (string): Unit of measure
- `TotalReqd` (decimal): Total required quantity
- `Balance` (decimal): Remaining balance
- `Bin` (string): Bin location
- `QtyIssued` (decimal): Quantity issued

### DespDashboard
Dispatch dashboard data (keyless entity).

```sql
CREATE VIEW DESPDashboard AS
SELECT 
    DispatchNote,
    DispatchNoteStatus,
    Priority,
    PackingInstructions,
    AccountNumber,
    Customer,
    ActualDeliveryDate,
    ActiveFlag,
    Status,
    ReadyToCollect,
    Comment,
    SalesOrder
FROM [Dispatch View];
```

**Fields:**
- `DispatchNote` (string): Dispatch note number
- `DispatchNoteStatus` (char): Dispatch status
- `Priority` (decimal): Priority level
- `PackingInstructions` (string): Packing instructions
- `AccountNumber` (string): Customer account
- `Customer` (string): Customer name
- `ActualDeliveryDate` (datetime): Delivery date
- `ActiveFlag` (char): Active status
- `Status` (string): Current status
- `ReadyToCollect` (string): Collection readiness
- `Comment` (string): Additional comments
- `SalesOrder` (string): Sales order reference

## Data Relationships

### Primary Relationships
1. **CapacityDay → CapacityJob**: One-to-many
2. **WipMaster → WipJobAllLab**: One-to-many (by Job)
3. **WipMaster → WipCurrentOp**: One-to-many (by Job)
4. **WipMaster → WipAssemblyTime**: One-to-many (by Job)

### Key Constraints
- `WipJobAllLab` has composite primary key (Job, Operation)
- `CapacityJob` references `CapacityDay` via `CapacityDayId`
- All capacity-related tables use string GUIDs as primary keys

## Data Generation

### Capacity Days Generation
- Generates capacity days from 2020-01-01 to 2030-01-01
- Creates 7 cells (CELL01-CELL07)
- Sets default available hours to 7.25 (weekdays), 0 (weekends)
- Initializes with 0 hours used

### Lost Hours Generation
- Generates monthly lost hours records from 2020-01-01 to 2030-01-01
- Initializes with 0 quality and other lost hours

## Performance Considerations

### Indexing
- Primary keys are automatically indexed
- Consider adding indexes on frequently queried fields:
  - `WipCurrentOp.WorkCentre`
  - `WipCurrentOp.Job`
  - `CapacityDay.Cell`
  - `CapacityDay.Day`

### Query Optimization
- Use specific date ranges for capacity queries
- Filter by work center for operations queries
- Use composite key lookups for job operations

### Data Volume
- Capacity days: ~25,000 records (10 years × 7 cells × 365 days)
- Lost hours: ~120 records (10 years × 12 months)
- Operations data: Variable based on production volume

## Migration Strategy

### Current State
- Direct database access via Entity Framework
- Environment-based connection strings
- No migration scripts (data generated at runtime)

### Future SYSPRO Integration
- Replace direct database access with SYSPRO Business Objects
- Implement proper data synchronization
- Add data validation and business rules
- Consider data caching strategies
