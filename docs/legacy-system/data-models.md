# Data Models

## Overview

This document describes the data models used throughout the system, including Entity Framework models, TypeScript interfaces, and data transfer objects.

## Core Models

### WipMaster
Job master data model.

```csharp
[Table("WipMaster")]
public class WipMaster
{
    [Key]
    public string? Job { get; set; }
    public decimal? Priority { get; set; }
}
```

**Purpose:** Central job management with priority tracking.

### WipCurrentOp
Current operations view model.

```csharp
[Keyless]
[Table("WIPCurrentOp")]
public class WipCurrentOp
{
    public string? Job { get; set; }
    public string? JobDescription { get; set; }
    public string? WorkCentre { get; set; }
    public string? StockCode { get; set; }
    public string? StockDescription { get; set; }
    public decimal? LowestOP { get; set; }
    public decimal? Priority { get; set; }
    public string? NextWorkCentre { get; set; }
    public string? NextWorkCentreIMachine { get; set; }
    public decimal? QtyToMake { get; set; }
    public string? IMachine { get; set; }
    public char? HoldFlag { get; set; }
    public string? DefaultBin { get; set; }
    public string? ExplodedDiagram { get; set; }
    public string? SOP { get; set; }
    public char? Complete { get; set; }
}
```

**Purpose:** Real-time view of current production operations.

## Capacity Models

### CapacityDay
Daily capacity tracking model.

```csharp
[Table("CapacityDay")]
public class CapacityDay
{
    [Key]
    public string CapacityDayId { get; set; }
    public DateTime Day { get; set; }
    public double AvailableHours { get; set; }
    public double HoursUsed { get; set; }
    public string Cell { get; set; }
    public ICollection<CapacityJob> CapacityJobs { get; set; }
}
```

**Purpose:** Daily capacity management for each cell.

### CapacityJob
Job allocation to capacity days.

```csharp
[Table("CapacityJob")]
public class CapacityJob
{
    [Key]
    public string CapacityJobId { get; set; }
    public string CapacityDayId { get; set; }
    public string Job { get; set; }
    public double TimeUsed { get; set; }
    public string StockCode { get; set; }
    public string StockDescription { get; set; }
    public string Cell { get; set; }
    public double Priority { get; set; }
    public double Qty { get; set; }
    public string WorkCentre { get; set; }
}
```

**Purpose:** Job scheduling and capacity allocation.

### CapacityLostHours
Lost hours tracking model.

```csharp
[Table("CapacityLostHours")]
public class CapacityLostHours
{
    [Key]
    public DateTime Date { get; set; }
    public double Quality { get; set; }
    public double Other { get; set; }
}
```

**Purpose:** Track downtime and lost production hours.

## Operations Models

### WipJobAllLab
Job operation details model.

```csharp
[Table("WipJobAllLab")]
public class WipJobAllLab
{
    public string? Job { get; set; }
    public int? Operation { get; set; }
    public string? WorkCentre { get; set; }
    public string? WorkCentreDesc { get; set; }
    public string? OperCompleted { get; set; }
    public DateTime? PlannedEndDate { get; set; }
    public string? IMachine { get; set; }
}
```

**Purpose:** Detailed operation tracking for jobs.

### WipJobPickList
Material picking list model.

```csharp
[Table("WipJobPickList")]
public class WipJobPickList
{
    public string? Job { get; set; }
    public string? StockDescription { get; set; }
    public string? StockCode { get; set; }
    public string? LongDesc { get; set; }
    public string? UOM { get; set; }
    public decimal? TotalReqd { get; set; }
    public decimal? Balance { get; set; }
    public string? Bin { get; set; }
    public decimal? QtyIssued { get; set; }
}
```

**Purpose:** Material picking and inventory management.

## Dispatch Models

### DespDashboard
Dispatch dashboard model.

```csharp
[Keyless]
[Table("DESPDashboard")]
public class DespDashboard
{
    public string? DispatchNote { get; set; }
    public char? DispatchNoteStatus { get; set; }
    public decimal? Priority { get; set; }
    public string? PackingInstructions { get; set; }
    public string? AccountNumber { get; set; }
    public string? Customer { get; set; }
    public DateTime? ActualDeliveryDate { get; set; }
    public char? ActiveFlag { get; set; }
    public string? Status { get; set; }
    public string? ReadyToCollect { get; set; }
    public string? Comment { get; set; }
    public string? SalesOrder { get; set; }
}
```

**Purpose:** Dispatch operations and order fulfillment tracking.

## Frontend TypeScript Models

### Core Models
```typescript
export type View = {
  name?: string;
  description?: string;
  route: string;
  icon?: any;
};

export type ActivationState = {
  status?: boolean;
  code?: string;
  key?: string;
  endDate?: Date;
};
```

### Operations Models
```typescript
export type WipCurrentOp = {
  job?: string;
  jobDescription?: string;
  workCentre?: string;
  stockCode?: string;
  stockDescription?: string;
  lowestOP?: number;
  priority?: number;
  nextWorkCentre?: string;
  nextWorkCentreIMachine?: string;
  qtyToMake?: number;
  iMachine?: string;
  holdFlag?: string;
  defaultBin?: string;
  explodedDiagram?: string;
  sop?: string;
};

export type WipJobPickList = {
  job?: string;
  stockDescription?: string;
  stockCode?: string;
  longDesc?: string;
  uom?: string;
  totalReqd?: number;
  balance?: number;
  bin?: string;
  qtyIssued?: number;
};
```

### Capacity Models
```typescript
export type CapacityDay = {
  capacityDayId: string;
  day: Date;
  cell: string;
  availableHours: number;
  hoursUsed: number;
  capacityJobs: CapacityJob[];
};

export type CapacityJob = {
  capacityJobId: string;
  job: string;
  timeUsed: number;
  capacityDayId: string;
  stockCode: string;
  stockDescription: string;
  cell: string;
  priority: number;
  qty: number;
  workCentre: string;
};

export type CapacityLostHours = {
  date: Date;
  quality: number;
  other: number;
};
```

## Model Relationships

### Primary Relationships
1. **CapacityDay → CapacityJob**: One-to-many
2. **WipMaster → WipJobAllLab**: One-to-many
3. **WipMaster → WipCurrentOp**: One-to-many
4. **WipMaster → WipAssemblyTime**: One-to-many

### Key Constraints
- `WipJobAllLab` uses composite key (Job, Operation)
- `CapacityJob` references `CapacityDay` via `CapacityDayId`
- All capacity models use GUID strings as primary keys

## Data Validation

### Business Rules
- Job priorities must be positive numbers
- Capacity hours cannot be negative
- Dates must be within valid ranges
- Work centers must exist in system

### Validation Attributes
- `[Required]` for mandatory fields
- `[Key]` for primary key identification
- `[Table]` for database table mapping
- `[Keyless]` for view-based entities

## Model Usage Patterns

### Entity Framework
- Models are mapped to database tables/views
- Navigation properties for relationships
- Lazy loading for related data
- Change tracking for updates

### Frontend Integration
- TypeScript interfaces match C# models
- Optional properties for flexibility
- Date handling with proper formatting
- Null safety with optional chaining

## Future Considerations

### SYSPRO Integration
- Models may need adaptation for Business Objects
- Consider DTOs for API communication
- Implement proper validation rules
- Add audit fields for tracking changes
