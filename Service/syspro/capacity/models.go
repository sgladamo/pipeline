package capacity

type CapacityDay struct {
	CapacityDayId  string        `json:"capacityDayId"`
	Day            string        `json:"day"`
	AvailableHours float32       `json:"availableHours"`
	HoursUsed      float32       `json:"hoursUsed"`
	Cell           string        `json:"cell"`
	CapacityJobs   []CapacityJob `json:"capacityJobs"`
}

type CapacityJob struct {
	CapacityJobId    string  `json:"capacityJobId"`
	Job              string  `json:"job"`
	TimeUsed         float32 `json:"timeUsed"`
	CapacityDayId    string  `json:"capacityDayId"`
	StockCode        string  `json:"stockCode"`
	StockDescription string  `json:"stockDescription"`
	Cell             string  `json:"cell"`
	Priority         float32 `json:"priority"`
	Qty              float32 `json:"qty"`
	WorkCentre       string  `json:"workCentre"`
}

type CapacityLostHours struct {
	Date    string  `json:"date"`
	Quality float32 `json:"quality"`
	Other   float32 `json:"other"`
}

type WipAssemblyTime struct {
	Job              string   `json:"job"`
	StockCode        string   `json:"stockCode"`
	StockDescription string   `json:"stockDescription"`
	QtyToMake        float32  `json:"qtyToMake"`
	IExpUnitRunTim   *float32 `json:"iExpUnitRunTim"`
	IMachine         string   `json:"iMachine"`
	WorkCentre       string   `json:"workCentre"`
	Priority         float32  `json:"priority"`
	ConfirmedFlag    string   `json:"confirmedFlag"`
	TotalTime        *float32 `json:"totalTime"`
	Complete         string   `json:"complete"`
	Operation        *float32 `json:"operation"`
}
