package despatch

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"log"
	"pipeline/pipeline-service/syspro/core/activation"
)

func Initialise(router *gin.Engine, database *sql.DB) {
	activated := router.Group("/")
	activated.Use(activation.Authorise)
	{
		activated.GET("/despatch/to-be-picked", toBePicked(database))
		activated.GET("/despatch/large-shipments", largeShipments(database))
		activated.GET("/despatch/packing", packing(database))
		activated.GET("/despatch/completed", completed(database))
	}
}

func toBePicked(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		result := []DespDashboard{}
		rows, qErr := db.Query("SELECT * FROM SysproCompanyB.dbo.DESPDashboard")

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
		}

		for rows.Next() {
			var dispatchNote, dispatchNoteStatus, accountNumber, customer, activeFlag, comment, salesOrder string
			var packingInstructions, actualDeliveryDate, status, readyToCollect *string
			var priority *float32
			sErr := rows.Scan(&dispatchNote, &dispatchNoteStatus, &priority, &packingInstructions, &accountNumber, &customer, &actualDeliveryDate, &activeFlag, &status, &readyToCollect, &comment, &salesOrder)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
			}

			if status == nil {
				data := DespDashboard{
					DispatchNote:        dispatchNote,
					DispatchNoteStatus:  dispatchNoteStatus,
					Priority:            priority,
					PackingInstructions: packingInstructions,
					AccountNumber:       accountNumber,
					Customer:            customer,
					ActualDeliveryDate:  actualDeliveryDate,
					ActiveFlag:          activeFlag,
					Status:              status,
					ReadyToCollect:      readyToCollect,
					Comment:             comment,
					SalesOrder:          salesOrder,
				}
				result = append(result, data)
			}
		}

		c.IndentedJSON(200, result)
	}

	return fn
}

func largeShipments(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		result := []DespDashboard{}
		rows, qErr := db.Query("SELECT * FROM SysproCompanyB.dbo.DESPDashboard")

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
		}

		for rows.Next() {
			var dispatchNote, dispatchNoteStatus, accountNumber, customer, activeFlag, comment, salesOrder string
			var packingInstructions, actualDeliveryDate, status, readyToCollect *string
			var priority *float32
			sErr := rows.Scan(&dispatchNote, &dispatchNoteStatus, &priority, &packingInstructions, &accountNumber, &customer, &actualDeliveryDate, &activeFlag, &status, &readyToCollect, &comment, &salesOrder)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
			}

			if status != nil && readyToCollect == nil {
				if *status == "Picking" {
					data := DespDashboard{
						DispatchNote:        dispatchNote,
						DispatchNoteStatus:  dispatchNoteStatus,
						Priority:            priority,
						PackingInstructions: packingInstructions,
						AccountNumber:       accountNumber,
						Customer:            customer,
						ActualDeliveryDate:  actualDeliveryDate,
						ActiveFlag:          activeFlag,
						Status:              status,
						ReadyToCollect:      readyToCollect,
						Comment:             comment,
						SalesOrder:          salesOrder,
					}
					result = append(result, data)
				}
			}
		}

		c.IndentedJSON(200, result)
	}

	return fn
}

func packing(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		result := []DespDashboard{}
		rows, qErr := db.Query("SELECT * FROM SysproCompanyB.dbo.DESPDashboard")

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
		}

		for rows.Next() {
			var dispatchNote, dispatchNoteStatus, accountNumber, customer, activeFlag, comment, salesOrder string
			var packingInstructions, actualDeliveryDate, status, readyToCollect *string
			var priority *float32
			sErr := rows.Scan(&dispatchNote, &dispatchNoteStatus, &priority, &packingInstructions, &accountNumber, &customer, &actualDeliveryDate, &activeFlag, &status, &readyToCollect, &comment, &salesOrder)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
			}

			if status != nil && readyToCollect == nil {
				if *status == "Complete" {
					data := DespDashboard{
						DispatchNote:        dispatchNote,
						DispatchNoteStatus:  dispatchNoteStatus,
						Priority:            priority,
						PackingInstructions: packingInstructions,
						AccountNumber:       accountNumber,
						Customer:            customer,
						ActualDeliveryDate:  actualDeliveryDate,
						ActiveFlag:          activeFlag,
						Status:              status,
						ReadyToCollect:      readyToCollect,
						Comment:             comment,
						SalesOrder:          salesOrder,
					}
					result = append(result, data)
				}
			}
		}

		c.IndentedJSON(200, result)
	}

	return fn
}

func completed(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		result := []DespDashboard{}
		rows, qErr := db.Query("SELECT * FROM SysproCompanyB.dbo.DESPDashboard")

		if qErr != nil {
			log.Println("Error reading rows: " + qErr.Error())
		}

		for rows.Next() {
			var dispatchNote, dispatchNoteStatus, accountNumber, customer, activeFlag, comment, salesOrder string
			var packingInstructions, actualDeliveryDate, status, readyToCollect *string
			var priority *float32
			sErr := rows.Scan(&dispatchNote, &dispatchNoteStatus, &priority, &packingInstructions, &accountNumber, &customer, &actualDeliveryDate, &activeFlag, &status, &readyToCollect, &comment, &salesOrder)
			if sErr != nil {
				log.Println("Error scanning row: " + sErr.Error())
			}

			if status != nil && readyToCollect != nil {
				if *status == "Complete" {
					data := DespDashboard{
						DispatchNote:        dispatchNote,
						DispatchNoteStatus:  dispatchNoteStatus,
						Priority:            priority,
						PackingInstructions: packingInstructions,
						AccountNumber:       accountNumber,
						Customer:            customer,
						ActualDeliveryDate:  actualDeliveryDate,
						ActiveFlag:          activeFlag,
						Status:              status,
						ReadyToCollect:      readyToCollect,
						Comment:             comment,
						SalesOrder:          salesOrder,
					}
					result = append(result, data)
				}
			}
		}

		c.IndentedJSON(200, result)
	}

	return fn
}
