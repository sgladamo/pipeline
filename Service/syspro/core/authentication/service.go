package authentication

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"log"
	"net/http"
	"pipeline/pipeline-service/syspro/core/activation"
	"time"
)

const password string = "cap9087"

var Sessions map[uuid.UUID]time.Time

func Initialise(router *gin.Engine) {
	activated := router.Group("/")
	activated.Use(activation.Authorise)
	{
		activated.POST("/authentication/login", login)
		activated.POST("/authentication/authenticate", authenticate)
	}
	go clean()
}

func clean() {
	for {
		log.Println("Cleaning sessions")
		utcNow := time.Now().UTC()
		for i := range Sessions {
			if Sessions[i].Add(24 * time.Hour).Before(utcNow) {
				delete(Sessions, i)
			}
		}
		time.Sleep(60000 * time.Millisecond)
	}
}

func login(c *gin.Context) {
	var pw string

	if bErr := c.ShouldBindJSON(&pw); bErr != nil {
		log.Println("Error binding body: " + bErr.Error())
		c.Status(http.StatusBadRequest)
	}

	if pw == password {
		if Sessions == nil {
			Sessions = make(map[uuid.UUID]time.Time)
		}

		id := uuid.New()
		Sessions[id] = time.Now().UTC()
		c.IndentedJSON(200, id)
	} else {
		c.Status(http.StatusUnauthorized)
	}
}

func authenticate(c *gin.Context) {
	var id uuid.UUID

	if bErr := c.ShouldBindJSON(&id); bErr != nil {
		log.Println("Error binding body: " + bErr.Error())
		c.Status(http.StatusBadRequest)
	}

	_, ok := Sessions[id]

	if ok {
		c.Status(http.StatusOK)
	} else {
		c.Status(http.StatusForbidden)
	}
}
