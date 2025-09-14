package activation

type ActivationState struct {
	Status  bool   `json:"status"`
	Code    string `json:"code"`
	Key     string `json:"key"`
	EndDate string `json:"endDate"`
}
