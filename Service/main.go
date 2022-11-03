package main

import (
	"database/sql"
	"fmt"
	_ "github.com/denisenkom/go-mssqldb"
	"github.com/gin-gonic/gin"
	"log"
	"pipeline/pipeline-service/despatch"
)

func main() {
	var (
		//		server   = os.Getenv("SYSPRO_DB_SERVER")
		//		name     = os.Getenv("SYSPRO_DB_NAME")
		//		userId   = os.Getenv("SYSPRO_DB_USERID")
		//		password = os.Getenv("SYSPRO_DB_PASSWORD")
		server   = "192.168.0.216"
		port     = 1433
		name     = "SysproCompanyB"
		userId   = "sa"
		password = "admin1234%"
	)

	connectionString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%d;database=%s", server, userId, password, port, name)
	database, cErr := sql.Open("sqlserver", connectionString)
	if cErr != nil {
		log.Println(fmt.Errorf("error Opening Database Connection: %v", cErr))
	}

	router := gin.Default()
	despatch.Initialise(router, database)
	log.Fatal(router.Run("localhost:8000"))
}
