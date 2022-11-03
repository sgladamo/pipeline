package operations

type WipCurrentOp struct {
	Job                    string   `json:"job"`
	JobDescription         *string  `json:"jobDescription"`
	WorkCentre             string   `json:"workCentre"`
	StockCode              *string  `json:"stockCode"`
	StockDescription       *string  `json:"stockDescription"`
	LowestOP               *float32 `json:"lowestOp"`
	Priority               *float32 `json:"priority"`
	NextWorkCentre         *string  `json:"nextWorkCentre"`
	NextWorkCentreIMachine *string  `json:"nextWorkCentreIMachine"`
	IMachine               string   `json:"iMachine"`
	QtyToMake              *float32 `json:"qtyToMake"`
	HoldFlag               *string  `json:"holdFlag"`
	DefaultBin             *string  `json:"defaultBin"`
	ExplodedDiagram        *string  `json:"explodedDiagram"`
	SOP                    *string  `json:"sop"`
	Complete               *string  `json:"complete"`
	PlannedStartDate       *string  `json:"plannedStartDate"`
	IExpUnitRunTim         *float32 `json:"iExpUnitRunTim"`
	Expr1                  *float32 `json:"expr1"`
	ConfirmedFlag          *string  `json:"confirmedFlag"`
}

type WipJobPickList struct {
	Job              string   `json:"job"`
	StockCode        string   `json:"stockCode"`
	StockDescription string   `json:"stockDescription"`
	LongDesc         *string  `json:"longDesc"`
	Uom              string   `json:"uom"`
	Bin              string   `json:"bin"`
	TotalReqd        *float32 `json:"totalReqd"`
	QtyIssued        float32  `json:"qtyIssued"`
	Balance          *float32 `json:"balance"`
}
