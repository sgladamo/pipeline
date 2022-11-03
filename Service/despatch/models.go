package despatch

type DESPDashboard struct {
	DispatchNote        string   `json:"dispatchNote"`
	DispatchNoteStatus  string   `json:"dispatchNoteStatus"`
	Priority            *float32 `json:"priority"`
	PackingInstructions *string  `json:"packingInstructions"`
	AccountNumber       string   `json:"accountNumber"`
	Customer            string   `json:"customer"`
	ActualDeliveryDate  *string  `json:"actualDeliveryDate"`
	ActiveFlag          string   `json:"activeFlag"`
	Status              *string  `json:"status"`
	ReadyToCollect      *string  `json:"readyToCollect"`
	Comment             string   `json:"comment"`
	SalesOrder          string   `json:"salesOrder"`
}
