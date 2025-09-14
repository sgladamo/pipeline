package core

import (
	"github.com/gin-gonic/gin"
	"pipeline/pipeline-service/syspro/core/activation"
	"pipeline/pipeline-service/syspro/core/authentication"
)

func Initialise(router *gin.Engine) {
	activation.Initialise(router)
	authentication.Initialise(router)
}
