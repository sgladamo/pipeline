package capacity

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"log"
	"net/http"
	"pipeline/pipeline-service/syspro/core/activation"
	"time"
)

const dateTimeFormat string = "2006-01-02T15:04:05Z"

func Initialise(router *gin.Engine, database *sql.DB) {
	activated := router.Group("/")
	activated.Use(activation.Authorise)
	{
		activated.GET("/capacity/days", days(database))
		activated.GET("/capacity/days/:cell", cellDays(database))
		activated.GET("/capacity/lost-hours/:date", lostHours(database))
	}
	initTables(db)
}

// initTables run on startup and once a day and is responsible for managing the Capacity tables
func initTables(db *sql.DB) {
	initDays(db)
	// updateAll()
	// initLostHours()
}

func initDays(db *sql.DB) {
	// if no days
	if !hasRows(db, "CapacityDay") {
		begin := time.Now().UTC()
		begin = time.Date(begin.Year(), begin.Month(), begin.Day(), 0, 0, 0, 0, time.UTC)
		end := time.Date(begin.Year()+1, begin.Month(), begin.Day(), 0, 0, 0, 0, time.UTC)
		var daysToAdd []CapacityDay
		for begin.Before(end) {
			for _, cell := range cells() {
				var availableHours float32
				if begin.Weekday() < 6 {
					availableHours = 7.25
				} else {
					availableHours = 0
				}
				day := CapacityDay{
					CapacityDayId:  uuid.NewString(),
					Day:            begin.String(),
					AvailableHours: availableHours,
					HoursUsed:      0,
					Cell:           cell,
				}
				daysToAdd = append(daysToAdd, day)
			}
			begin = begin.Add(24 * time.Hour)
		}
	}

	// if no day entry for today next year
}

func hasRows(db *sql.DB, table string) bool {
	var (
		rows  *sql.Rows
		err   error
		count float32
	)
	rows, err = db.Query("SELECT count(*) SELECT SysproCompanyB.dbo.@p1", table)
	if err != nil {
		log.Println("error reading count: " + err.Error())
		panic(err.Error())
	}
	for rows.Next() {
		sErr := rows.Scan(&count)
		if sErr != nil {
			log.Println("error scanning row: " + sErr.Error())
			panic(err.Error())
		}

	}
	if count <= 0 {
		return false
	}
	return true
}

func initLostHours(db *sql.DB) {
	// if no lost hours

	// if no lost hours for next month
}

func days(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		from := c.Query("from")
		to := c.Query("to")
		result := map[string][]CapacityDay{
			"CELL1": {},
			"CELL2": {},
			"CELL3": {},
			"CELL4": {},
			"CELL5": {},
			"CELL6": {},
			"CELL7": {},
		}

		var (
			rows *sql.Rows
			qErr error
		)

		if from != "" || to != "" {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.CapacityDay WHERE Day >= @p1 AND Day <= @p2 ORDER BY Day", from, to)
		} else {
			c.Status(http.StatusBadRequest)
		}

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
			c.Status(http.StatusInternalServerError)
		}

		for rows.Next() {
			var capacityDayId, day, cell, capacityJobId string
			var availableHours, hoursUsed float32
			sErr := rows.Scan(&capacityDayId, &day, &availableHours, &hoursUsed, &cell, &capacityJobId)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
				c.Status(http.StatusInternalServerError)
			}

			dateTime, err := time.Parse(dateTimeFormat, day)
			if err != nil {
				log.Println("error parsing date: " + qErr.Error())
				c.Status(http.StatusInternalServerError)
			}

			dow := dateTime.Weekday()

			if dow < 6 {
				capacityJobs := capacityJobs(db, capacityDayId)

				data := CapacityDay{
					CapacityDayId:  capacityDayId,
					Day:            day,
					AvailableHours: availableHours,
					HoursUsed:      hoursUsed,
					Cell:           cell,
					CapacityJobs:   capacityJobs,
				}

				ccd := result[cell]
				ccd = append(ccd, data)
				result[cell] = ccd
			}
		}

		c.IndentedJSON(200, result)
	}

	return fn
}

func cellDays(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		cell := c.Param("cell")
		from := c.Query("from")
		to := c.Query("to")
		var result []CapacityDay

		var (
			rows *sql.Rows
			qErr error
		)

		if cell != "" && from != "" || to != "" {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.CapacityDay WHERE Cell = @p1 AND Day >= @p2 AND Day <= @p3 ORDER BY Day", cell, from, to)
		} else {
			c.Status(http.StatusBadRequest)
		}

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
			c.Status(http.StatusInternalServerError)
		}

		for rows.Next() {
			var capacityDayId, day, cell, capacityJobId string
			var availableHours, hoursUsed float32
			sErr := rows.Scan(&capacityDayId, &day, &availableHours, &hoursUsed, &cell, &capacityJobId)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
				c.Status(http.StatusInternalServerError)
			}

			dateTime, err := time.Parse(dateTimeFormat, day)
			if err != nil {
				log.Println("error parsing date: " + qErr.Error())
				c.Status(http.StatusInternalServerError)
			}

			dow := dateTime.Weekday()

			if dow < 6 {
				capacityJobs := capacityJobs(db, capacityDayId)

				data := CapacityDay{
					CapacityDayId:  capacityDayId,
					Day:            day,
					AvailableHours: availableHours,
					HoursUsed:      hoursUsed,
					Cell:           cell,
					CapacityJobs:   capacityJobs,
				}

				result = append(result, data)
			}
		}

		c.IndentedJSON(200, result)
	}

	return fn
}

func capacityJobs(db *sql.DB, capacityDayId string) []CapacityJob {
	var result []CapacityJob
	var (
		rows *sql.Rows
		qErr error
	)

	rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.CapacityJob WHERE CapacityDayId = @p1", capacityDayId)

	if qErr != nil {
		log.Println("Error reading rows: " + qErr.Error())
	}

	for rows.Next() {
		var capacityJobId, job, capacityDayId, stockCode, stockDescription, cell, workCentre string
		var timeUsed, priority, qty float32
		sErr := rows.Scan(&capacityJobId, &job, &timeUsed, &capacityDayId, &stockCode, &stockDescription, &cell, &priority, &qty, &workCentre)
		if sErr != nil {
			log.Println("Error scanning row: " + sErr.Error())
		}

		data := CapacityJob{
			CapacityJobId:    capacityJobId,
			Job:              job,
			TimeUsed:         timeUsed,
			CapacityDayId:    capacityDayId,
			StockCode:        stockCode,
			StockDescription: stockDescription,
			Cell:             cell,
			Priority:         priority,
			Qty:              qty,
			WorkCentre:       workCentre,
		}
		result = append(result, data)
	}

	return result
}

func lostHours(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		date := c.Param("date")
		var result CapacityLostHours

		var (
			rows *sql.Rows
			qErr error
		)

		if date != "" {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.CapacityLostHours WHERE Date = @p1", date)
		} else {
			c.Status(http.StatusBadRequest)
		}

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
			c.Status(http.StatusInternalServerError)
		}

		for rows.Next() {
			var date string
			var quality, other float32
			sErr := rows.Scan(&date, &quality, &other)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
				c.Status(http.StatusInternalServerError)
			}

			data := CapacityLostHours{
				Date:    date,
				Quality: quality,
				Other:   other,
			}

			result = data
		}

		c.IndentedJSON(200, result)
	}

	return fn
}

func cells() []string {
	return []string{"CELL01", "CELL02", "CELL03", "CELL04", "CELL05", "CELL06", "CELL07"}
}
