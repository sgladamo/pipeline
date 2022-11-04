package operations

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"log"
	"pipeline/pipeline-service/syspro/core"
	"pipeline/pipeline-service/syspro/core/activation"
)

func Initialise(router *gin.Engine, database *sql.DB) {
	activated := router.Group("/")
	activated.Use(activation.Authorise)
	{
		activated.GET("/operations/current-ops", currentOps(database))
		activated.GET("/operations/all-ops", allOps(database))
		activated.GET("/operations/assembly-ops", assemblyOps(database))
		activated.GET("/operations/trolley-storage-ops", trolleyStorageOps(database))
		activated.GET("/operations/picking-ops", pickingOps(database))
		activated.GET("/operations/pick-list", pickList(database))
		activated.PUT("/operations/jobs/:job/priority", updateJobPriority(database))
		activated.PUT("/operations/jobs/:job/cell", updateJobCell(database))
	}
}

func currentOps(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		job := c.Query("job")
		wc := c.Query("w")
		result := []WipCurrentOp{}
		var (
			rows *sql.Rows
			qErr error
		)

		if job != "" {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp WHERE Job = @p1", job)
		} else if wc != "" {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp  WHERE WorkCentre = @p1", wc)
		} else {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp")
		}

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

func allOps(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		job := c.Query("job")
		result := []core.WipJobAllLab{}
		var (
			rows *sql.Rows
			qErr error
		)

		if job != "" {
			rows, qErr = db.Query("SELECT Job, Operation, WorkCentre, WorkCentreDesc, OperCompleted, PlannedEndDate, IMachine, QtyCompleted, ActualFinishDate FROM SysproCompanyB.dbo.WipJobAllLab WHERE Job = @p1", job)
		} else {
			rows, qErr = db.Query("SELECT Job, Operation, WorkCentre, WorkCentreDesc, OperCompleted, PlannedEndDate, IMachine, QtyCompleted, ActualFinishDate FROM SysproCompanyB.dbo.WipJobAllLab")
		}

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

func assemblyOps(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		cell := c.Query("cell")
		result := []WipCurrentOp{}
		var (
			rows *sql.Rows
			qErr error
		)

		if cell != "" {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp WHERE IMachine = @p1", cell)
		} else {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp WHERE WorkCentre = 'ASSY01'")
		}

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

func trolleyStorageOps(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		cell := c.Query("nextWorkCentreIMachine")
		result := []WipCurrentOp{}
		var (
			rows *sql.Rows
			qErr error
		)

		if cell != "" {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp WHERE WorkCentre = 'TROL01' AND NextWorkCentreIMachine = @p1", cell)
		} else {
			rows, qErr = db.Query("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp WHERE WorkCentre = 'TROL01'")
		}

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

func pickingOps(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		result := []WipCurrentOp{}
		rows, qErr := db.Query("SELECT * FROM SysproCompanyB.dbo.WIPCurrentOp WHERE WorkCentre = 'PICK01'")
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

func pickList(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		job := c.Query("job")
		result := []WipJobPickList{}
		rows, qErr := db.Query("SELECT * FROM SysproCompanyB.dbo.WIPJobPickList WHERE Job = @p1", job)
		defer rows.Close()

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
		}

		for rows.Next() {
			var job, stockCode, stockDescription, uom, bin string
			var longDesc *string
			var qtyIssued float32
			var totalReqd, balance *float32

			sErr := rows.Scan(&job, &stockCode, &stockDescription, &longDesc, &uom, &bin, &totalReqd, &qtyIssued, &balance)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
			}

			data := WipJobPickList{
				Job:              job,
				StockCode:        stockCode,
				StockDescription: stockDescription,
				LongDesc:         longDesc,
				Uom:              uom,
				Bin:              bin,
				TotalReqd:        totalReqd,
				QtyIssued:        qtyIssued,
				Balance:          balance,
			}
			result = append(result, data)
		}

		c.IndentedJSON(200, result)
	}

	return fn
}

func updateJobPriority(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		job := c.Param("job")
		var priority float32
		if bErr := c.ShouldBindJSON(&priority); bErr != nil {
			log.Println("Error binding body: " + bErr.Error())
			c.Status(400)
		}
		if _, qErr := db.Exec("UPDATE SysproCompanyB.dbo.WipMaster SET Priority = @p1 WHERE Job = @p2", priority, job); qErr != nil {
			log.Println("Error executing state: " + qErr.Error())
			c.Status(500)
		}
		c.Status(200)
	}

	return fn
}

func updateJobCell(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		job := c.Param("job")
		var cell string
		if bErr := c.ShouldBindJSON(&cell); bErr != nil {
			log.Println("Error binding body: " + bErr.Error())
			c.Status(400)
		}
		if _, qErr := db.Exec("UPDATE SysproCompanyB.dbo.WipJobAllLab SET IMachine = @p1 WHERE Job = @p2 AND WorkCentre = 'ASSY01'", cell, job); qErr != nil {
			log.Println("Error executing state: " + qErr.Error())
			c.Status(500)
		}
		c.Status(200)
	}

	return fn
}
