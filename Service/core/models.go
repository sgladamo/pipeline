package core

type WipJobAllLab struct {
	Job              *string  `json:"job"`
	Operation        *float32 `json:"operation"`
	WorkCentre       *string  `json:"workCentre"`
	WorkCentreDesc   *string  `json:"workCentreDesc"`
	OperCompleted    *string  `json:"operCompleted"`
	PlannedEndDate   *string  `json:"plannedEndDate"`
	IMachine         *string  `json:"iMachine"`
	QtyCompleted     *float32 `json:"qtyCompleted"`
	ActualFinishDate *string  `json:"actualFinishDate"`
}

type WipMaster struct {
	Job      *string  `json:"job"`
	Priority *float32 `json:"priority"`
}
