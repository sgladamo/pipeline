package main

import (
	"database/sql"
	"fmt"
	_ "github.com/denisenkom/go-mssqldb"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"pipeline/pipeline-service/syspro/despatch"
	"pipeline/pipeline-service/syspro/operations"
)

func main() {
	var (
		server   = os.Getenv("SYSPRO_DB_SERVER")
		name     = os.Getenv("SYSPRO_DB_NAME")
		userId   = os.Getenv("SYSPRO_DB_USERID")
		password = os.Getenv("SYSPRO_DB_PASSWORD")
	)

	connectionString := fmt.Sprintf("server=%s;user id=%s;password=%s;database=%s", server, userId, password, name)
	database, cErr := sql.Open("sqlserver", connectionString)
	if cErr != nil {
		log.Println(fmt.Errorf("error Opening Database Connection: %v", cErr))
	}

	router := gin.Default()
	operations.Initialise(router, database)
	despatch.Initialise(router, database)
	log.Fatal(router.Run("localhost:8000"))
}
