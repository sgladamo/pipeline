# API Endpoints Documentation

## Base URL
All endpoints are relative to the API base URL. The API uses standard HTTP methods and returns JSON responses.

## Authentication
Most endpoints require authentication via the `[Authorise]` attribute. Authentication is session-based using the `/authentication/login` endpoint.

## Controllers

### AuthenticationController
Base route: `/authentication`

#### POST /authentication/login
Authenticates a user with a password.

**Request Body:**
```json
"password_string"
```

**Response:**
- **200 OK**: Returns session ID
- **401 Unauthorized**: Invalid password

**Example:**
```bash
curl -X POST /authentication/login \
  -H "Content-Type: application/json" \
  -d "my_password"
```

#### POST /authentication/authenticate
Validates an existing session.

**Request Body:**
```json
"session_id"
```

**Response:**
- **200 OK**: Session is valid
- **403 Forbidden**: Invalid or expired session

### OperationsController
Base route: `/operations`

#### GET /operations/current-ops
Retrieves current operations with optional filtering.

**Query Parameters:**
- `job` (string, optional): Filter by job number
- `w` (string, optional): Filter by work center

**Response:**
```json
[
  {
    "job": "JOB001",
    "jobDescription": "Product Assembly",
    "workCentre": "CELL01",
    "stockCode": "STK001",
    "stockDescription": "Main Assembly",
    "lowestOP": 10,
    "priority": 1,
    "nextWorkCentre": "CELL02",
    "nextWorkCentreIMachine": "MACH001",
    "qtyToMake": 100,
    "iMachine": "MACH001",
    "holdFlag": "N",
    "defaultBin": "BIN001",
    "explodedDiagram": "DIAG001",
    "sop": "SOP001",
    "complete": "N"
  }
]
```

#### GET /operations/all-ops
Retrieves all operations for a job.

**Query Parameters:**
- `job` (string, optional): Job number

**Response:**
```json
[
  {
    "job": "JOB001",
    "operation": 10,
    "workCentre": "CELL01",
    "workCentreDesc": "Assembly Cell 1",
    "operCompleted": "N",
    "plannedEndDate": "2024-01-15T10:00:00Z",
    "iMachine": "MACH001"
  }
]
```

#### GET /operations/assembly-ops
Retrieves assembly operations.

**Query Parameters:**
- `cell` (string, optional): Assembly cell identifier

**Response:**
Array of `WipCurrentOp` objects for assembly operations.

#### GET /operations/trolley-storage-ops
Retrieves trolley storage operations.

**Query Parameters:**
- `nextWorkCentreIMachine` (string, optional): Next machine identifier

**Response:**
Array of `WipCurrentOp` objects for trolley operations.

#### GET /operations/picking-ops
Retrieves picking operations.

**Response:**
Array of `WipCurrentOp` objects for picking operations.

#### GET /operations/pick-list
Retrieves pick list for a specific job.

**Query Parameters:**
- `job` (string, required): Job number

**Response:**
```json
[
  {
    "job": "JOB001",
    "stockDescription": "Component A",
    "stockCode": "COMP001",
    "longDesc": "Main Component A",
    "uom": "EA",
    "totalReqd": 10,
    "balance": 5,
    "bin": "BIN001",
    "qtyIssued": 5
  }
]
```

#### GET /operations/boxing-ops
Retrieves boxing operations.

**Response:**
Array of `WipCurrentOp` objects for boxing operations.

#### PUT /operations/jobs/{job}/priority
Updates job priority.

**Path Parameters:**
- `job` (string): Job number

**Request Body:**
```json
1.5
```

**Response:**
- **200 OK**: Priority updated successfully

#### PUT /operations/jobs/{job}/cell
Updates job cell assignment.

**Path Parameters:**
- `job` (string): Job number

**Request Body:**
```json
"CELL02"
```

**Response:**
- **200 OK**: Cell assignment updated successfully

### CapacityController
Base route: `/capacity`

#### GET /capacity/days/{cell}
Retrieves capacity days for a specific cell.

**Path Parameters:**
- `cell` (string): Cell identifier (CELL01-CELL07)

**Query Parameters:**
- `from` (string, required): Start date (ISO format)
- `to` (string, required): End date (ISO format)

**Response:**
```json
[
  {
    "capacityDayId": "guid",
    "day": "2024-01-15T00:00:00Z",
    "availableHours": 7.25,
    "hoursUsed": 5.5,
    "cell": "CELL01",
    "capacityJobs": [
      {
        "capacityJobId": "guid",
        "job": "JOB001",
        "timeUsed": 2.5,
        "capacityDayId": "guid",
        "stockCode": "STK001",
        "stockDescription": "Product A",
        "cell": "CELL01",
        "priority": 1,
        "qty": 100,
        "workCentre": "CELL01"
      }
    ]
  }
]
```

#### GET /capacity/days
Retrieves capacity days for all cells.

**Query Parameters:**
- `from` (string, required): Start date (ISO format)
- `to` (string, required): End date (ISO format)

**Response:**
```json
{
  "CELL01": [...],
  "CELL02": [...],
  "CELL03": [...],
  "CELL04": [...],
  "CELL05": [...],
  "CELL06": [...],
  "CELL07": [...]
}
```

#### PUT /capacity/days/{capacityDayId}
Updates available hours for a capacity day.

**Path Parameters:**
- `capacityDayId` (string): Capacity day identifier

**Request Body:**
```json
8.0
```

**Response:**
- **200 OK**: Capacity day updated successfully

#### PUT /capacity/jobs/{capacityJobId}/shift/{capacityDayId}/{index}
Shifts a capacity job to a different position.

**Path Parameters:**
- `capacityJobId` (string): Capacity job identifier
- `capacityDayId` (string): Target capacity day
- `index` (int): New position index

**Response:**
- **200 OK**: Job shifted successfully

#### GET /capacity/lost-hours
Retrieves lost hours data.

**Query Parameters:**
- `date` (string, required): Date (ISO format)

**Response:**
```json
{
  "date": "2024-01-15T00:00:00Z",
  "quality": 0.5,
  "other": 1.0
}
```

#### PUT /capacity/lost-hours
Updates lost hours data.

**Request Body:**
```json
{
  "date": "2024-01-15T00:00:00Z",
  "quality": 0.5,
  "other": 1.0
}
```

**Response:**
- **200 OK**: Lost hours updated successfully

### DespatchController
Base route: `/despatch`

#### GET /despatch/to-be-picked
Retrieves orders to be picked.

**Response:**
```json
[
  {
    "dispatchNote": "DN001",
    "dispatchNoteStatus": "P",
    "priority": 1,
    "packingInstructions": "Handle with care",
    "accountNumber": "ACC001",
    "customer": "Customer Name",
    "actualDeliveryDate": "2024-01-20T00:00:00Z",
    "activeFlag": "Y",
    "status": "Ready",
    "readyToCollect": "Y",
    "comment": "Urgent delivery",
    "salesOrder": "SO001"
  }
]
```

#### GET /despatch/large-shipments
Retrieves large shipments.

**Response:**
Array of `DespDashboard` objects for large shipments.

#### GET /despatch/packing
Retrieves orders in packing.

**Response:**
Array of `DespDashboard` objects for packing operations.

#### GET /despatch/completed
Retrieves completed orders.

**Response:**
Array of `DespDashboard` objects for completed orders.

### OperationsKPIController
Base route: `/operations/kpis`

#### GET /operations/kpis/mrp-forecast
Retrieves MRP forecast KPIs.

**Response:**
```json
[
  {
    "forecastDate": "2024-01-15T00:00:00Z",
    "forecastValue": 1000.0,
    "actualValue": 950.0,
    "variance": -50.0
  }
]
```

#### GET /operations/kpis/complete-jobs
Retrieves completed jobs KPIs.

**Response:**
```json
[
  {
    "job": "JOB001",
    "completionDate": "2024-01-15T10:00:00Z",
    "plannedDate": "2024-01-15T09:00:00Z",
    "variance": 1.0
  }
]
```

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### HTTP Status Codes
- **200 OK**: Successful request
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Invalid session
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Rate Limiting
Currently no rate limiting is implemented. Consider implementing for production use.

## CORS
The API allows all origins, methods, and headers. This should be restricted in production environments.

## Logging
All requests are logged with:
- Remote IP address and port
- Request parameters
- Response status
- Timestamp
