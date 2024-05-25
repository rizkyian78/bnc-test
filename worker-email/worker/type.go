package worker

type Payload struct {
	Pattern string `json:"pattern"`
	Data    struct {
		Email string `json:"email"`
		Otp   string `json:"otp"`
	} `json:"data"`
}
