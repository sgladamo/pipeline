package main

import (
	"database/sql"
	"fmt"
	_ "github.com/denisenkom/go-mssqldb"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"pipeline/pipeline-service/syspro/core"
	"pipeline/pipeline-service/syspro/despatch"
	"pipeline/pipeline-service/syspro/operations"
)

func main() {
	var (
		//		server   = os.Getenv("SYSPRO_DB_SERVER")
		//		name     = os.Getenv("SYSPRO_DB_NAME")
		//		userId   = os.Getenv("SYSPRO_DB_USERID")
		//		password = os.Getenv("SYSPRO_DB_PASSWORD")
		server   = "192.168.0.216"
		name     = "SysproCompanyB"
		userId   = "sa"
		password = "admin1234%"
	)

	connectionString := fmt.Sprintf("server=%s;user id=%s;password=%s;database=%s", server, userId, password, name)
	database, cErr := sql.Open("sqlserver", connectionString)
	if cErr != nil {
		log.Println(fmt.Errorf("error opening database connection: %v", cErr))
	}

	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT"},
		AllowHeaders: []string{"*"},
	}))
	core.Initialise(router)
	operations.Initialise(router, database)
	despatch.Initialise(router, database)
	log.Fatal(router.Run("localhost:8000"))
}
