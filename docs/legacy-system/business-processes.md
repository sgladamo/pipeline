# Business Processes

## Overview

This document describes the business processes and workflows implemented in the manufacturing pipeline system.

## Core Business Domains

### 1. Operations Management

#### Current Operations Tracking
**Process:** Real-time monitoring of jobs in production
- Jobs are tracked through various work centers
- Each job has a current operation and next operation
- Priority-based scheduling determines job sequence
- Hold flags can pause job progression

**Key Work Centers:**
- `CELL01-CELL07`: Assembly cells
- `SA02`, `PICK01`: Picking operations
- `TROL01`, `TRST01`: Trolley storage
- `BOXI01`: Boxing operations
- `ASSY01`: Assembly operations

#### Job Priority Management
**Process:** Dynamic priority adjustment for production scheduling
- Priorities are decimal values (lower = higher priority)
- Can be updated in real-time via API
- Affects capacity planning and scheduling
- Used for job sequencing within cells

#### Assembly Operations
**Process:** Cell-based assembly tracking
- Jobs are assigned to specific assembly cells
- Each cell has capacity constraints
- Assembly times are calculated and tracked
- Machine assignments are managed per cell

### 2. Capacity Planning

#### Daily Capacity Management
**Process:** Planning and tracking daily production capacity
- 7 assembly cells (CELL01-CELL07)
- Each cell has 7.25 hours available per day (weekdays)
- Weekend capacity is set to 0
- Capacity spans from 2020-2030

#### Job Scheduling
**Process:** Allocating jobs to capacity days
- Jobs are scheduled based on priority
- Assembly times are calculated from job data
- Jobs are distributed across available capacity
- Overruns are handled by extending to next day

#### Capacity Updates
**Process:** Real-time capacity recalculation
- Runs every 60 seconds via background service
- Recalculates all cell capacities
- Updates job allocations based on current priorities
- Maintains capacity vs. demand balance

#### Lost Hours Tracking
**Process:** Monitoring and recording production downtime
- Quality-related lost hours
- Other lost hours (maintenance, etc.)
- Monthly tracking from 2020-2030
- Used for capacity analysis and reporting

### 3. Material Management

#### Picking Operations
**Process:** Material picking and preparation
- Jobs generate pick lists for required materials
- Bin locations are tracked for each item
- Quantities are validated against requirements
- Issued quantities are tracked

#### Pick List Management
**Process:** Managing material requirements
- Each job has associated pick list items
- Stock codes and descriptions are maintained
- UOM (Unit of Measure) tracking
- Balance tracking for partial issues

### 4. Dispatch Operations

#### Order Fulfillment
**Process:** Managing customer orders through dispatch
- Orders progress through various statuses
- Priority-based dispatch scheduling
- Packing instructions are maintained
- Customer information is tracked

#### Dispatch Status Tracking
**Process:** Monitoring order progress
- **To Be Picked**: Orders ready for picking
- **Large Shipments**: Oversized orders
- **Packing**: Orders in packing process
- **Completed**: Ready for dispatch

#### Customer Management
**Process:** Customer order tracking
- Account numbers and customer names
- Delivery date management
- Sales order references
- Collection readiness tracking

## Workflow Processes

### 1. Job Creation and Planning
1. Job is created in SYSPRO system
2. Job appears in WipMaster with initial priority
3. Operations are defined in WipJobAllLab
4. Assembly times are calculated
5. Job is scheduled in capacity planning

### 2. Production Execution
1. Job appears in current operations
2. Materials are picked based on pick list
3. Job progresses through work centers
4. Assembly operations are completed in cells
5. Job moves to next operation or completion

### 3. Capacity Planning Cycle
1. Capacity days are generated (2020-2030)
2. Jobs are allocated based on priority
3. Capacity is updated every 60 seconds
4. Lost hours are tracked and recorded
5. Capacity adjustments are made as needed

### 4. Dispatch Process
1. Order is created in SYSPRO
2. Order appears in dispatch dashboard
3. Materials are picked and packed
4. Order status is updated
5. Order is marked as ready for dispatch

## Business Rules

### Priority Management
- Lower priority numbers = higher priority
- Priorities can be updated in real-time
- Priority changes trigger capacity recalculation
- Jobs are scheduled in priority order

### Capacity Rules
- Weekday capacity: 7.25 hours per cell
- Weekend capacity: 0 hours
- Jobs cannot exceed available capacity
- Overruns are moved to next available day

### Work Center Rules
- Each job has a current work center
- Next work center is determined by routing
- Machine assignments are cell-specific
- Hold flags can pause job progression

### Quality and Lost Hours
- Lost hours are tracked monthly
- Quality and other categories are separate
- Lost hours affect capacity calculations
- Historical data is maintained for analysis

## Integration Points

### SYSPRO Database
- Direct database access via Entity Framework
- Real-time data synchronization
- Master data integration (jobs, customers, etc.)
- Transaction data integration (operations, dispatch)

### External Systems
- SYSPRO ERP system (source of truth)
- Manufacturing execution systems
- Quality management systems
- Customer management systems

## Performance Considerations

### Real-time Updates
- Capacity updates every 60 seconds
- Session cleanup every 60 seconds
- Database queries are optimized
- Caching is used where appropriate

### Data Volume
- Capacity days: ~25,000 records
- Operations data: Variable based on production
- Lost hours: ~120 records
- Dispatch data: Variable based on orders

## Future SYSPRO Integration

### Business Objects Integration
- Replace direct database access
- Implement proper API integration
- Add business rule validation
- Improve data consistency

### Enhanced Workflows
- Automated job creation
- Real-time status updates
- Advanced scheduling algorithms
- Integration with other SYSPRO modules

### Reporting and Analytics
- KPI dashboards
- Performance metrics
- Capacity utilization reports
- Quality and lost hours analysis
