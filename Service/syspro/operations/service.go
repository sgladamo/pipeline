package operations

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
    "pipeline/pipeline-service/syspro/core"
)

func Initialise(router *gin.Engine, database *sql.DB) {
	router.GET("/operations/current-ops", CurrentOps(database))
	router.GET("/operations/all-ops", AllOps(database))
}

func CurrentOps(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		job := c.Query("job")
		wc := c.Query("w")
		result := []WipCurrentOp{}
		var statement string

		if job != "" {
			statement = fmt.Sprintf("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp WHERE Job = '%s'", job)
		} else if wc != "" {
			statement = fmt.Sprintf("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp WHERE WorkCentre = '%s'", wc)
		} else {
			statement = fmt.Sprintf("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp")
		}

		rows, qErr := db.Query(statement)
		defer rows.Close()

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
		}

		for rows.Next() {
			var job, workCentre, iMachine string
			var jobDescription, stockCode, stockDescription, nextWorkCentre, nextWorkCentreIMachine, holdFlag, defaultBin, explodedDiagram, sop, complete, plannedStartDate, confirmedFlag *string
			var lowestOp, priority, qtyToMake, iExpUnitRunTim, expr1 *float32
			sErr := rows.Scan(&lowestOp, &job, &workCentre, &stockCode, &stockDescription, &plannedStartDate, &priority, &nextWorkCentre, &qtyToMake, &iMachine, &holdFlag, &nextWorkCentreIMachine, &defaultBin, &explodedDiagram, &sop, &jobDescription, &iExpUnitRunTim, &expr1, &confirmedFlag, &complete)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
			}

			data := WipCurrentOp{
				Job:                    job,
				JobDescription:         jobDescription,
				WorkCentre:             workCentre,
				StockCode:              stockCode,
				StockDescription:       stockDescription,
				LowestOP:               lowestOp,
				Priority:               priority,
				NextWorkCentre:         nextWorkCentre,
				NextWorkCentreIMachine: nextWorkCentreIMachine,
				IMachine:               iMachine,
				QtyToMake:              qtyToMake,
				HoldFlag:               holdFlag,
				DefaultBin:             defaultBin,
				ExplodedDiagram:        explodedDiagram,
				SOP:                    sop,
				Complete:               complete,
				PlannedStartDate:       plannedStartDate,
				IExpUnitRunTim:         iExpUnitRunTim,
				Expr1:                  expr1,
				ConfirmedFlag:          confirmedFlag,
			}
			result = append(result, data)
		}

		c.IndentedJSON(200, result)
	}

	return fn
}

func AllOps(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		job := c.Query("job")
		result := []core.WipJobAllLab{}
		var statement string

		if job != "" {
			statement = fmt.Sprintf("SELECT Job, Operation, WorkCentre, WorkCentreDesc, OperCompleted, PlannedEndDate, IMachine, QtyCompleted, ActualFinishDate FROM SysproCompanyB.dbo.WipJobAllLab WHERE Job = '%s'", job)
		} else {
			statement = fmt.Sprintf("SELECT Job, Operation, WorkCentre, WorkCentreDesc, OperCompleted, PlannedEndDate, IMachine, QtyCompleted, ActualFinishDate FROM SysproCompanyB.dbo.WipJobAllLab")
		}

		rows, qErr := db.Query(statement)
		defer rows.Close()

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
		}

		for rows.Next() {
			var job, workCentre, workCentreDesc, operCompleted, iMachine string
			var plannedEndDate, actualFinishDate *string
			var operation, qtyCompleted float32
			sErr := rows.Scan(&job, &operation, &workCentre, &workCentreDesc, &operCompleted, &plannedEndDate, &iMachine, &qtyCompleted, &actualFinishDate)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
			}

			data := core.WipJobAllLab{
				Job:              job,
				Operation:        operation,
				WorkCentre:       workCentre,
				WorkCentreDesc:   workCentreDesc,
				OperCompleted:    operCompleted,
				PlannedEndDate:   plannedEndDate,
				IMachine:         iMachine,
				QtyCompleted:     qtyCompleted,
				ActualFinishDate: actualFinishDate,
			}
			result = append(result, data)
		}

		c.IndentedJSON(200, result)
	}

	return fn
}
