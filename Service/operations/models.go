package operations

type WipCurrentOp struct {
	Job              *string  `json:"job"`
	JobDescription   *string  `json:"jobDescription"`
	WorkCentre       *string  `json:"workCentre"`
	StockCode        *string  `json:"stockCode"`
	StockDescription *string  `json:"stockDescription"`
	LowestOp         *string  `json:"lowestOp"`
	IMachine         *string  `json:"iMachine"`
	QtyToMake        *float32 `json:"qtyToMake"`
}
