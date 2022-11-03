package despatch

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
)

func Initialise(router *gin.Engine, database *sql.DB) {
	router.GET("/despatch/to-be-picked", ToBePicked(database))
	router.GET("/despatch/large-shipments", LargeShipments(database))
	router.GET("/despatch/packing", Packing(database))
	router.GET("/despatch/completed", Completed(database))
}

func ToBePicked(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		result := []DespDashboard{}
		statement := fmt.Sprintf("SELECT * FROM SysproCompanyB.dbo.DespDashboard")
		rows, qErr := db.Query(statement)
		defer rows.Close()

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

func LargeShipments(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		result := []DespDashboard{}
		statement := fmt.Sprintf("SELECT * FROM SysproCompanyB.dbo.DespDashboard")
		rows, qErr := db.Query(statement)
		defer rows.Close()

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

func Packing(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		result := []DespDashboard{}
		statement := fmt.Sprintf("SELECT * FROM SysproCompanyB.dbo.DespDashboard")
		rows, qErr := db.Query(statement)
		defer rows.Close()

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

func Completed(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		result := []DespDashboard{}
		statement := fmt.Sprintf("SELECT * FROM SysproCompanyB.dbo.DespDashboard")
		rows, qErr := db.Query(statement)
		defer rows.Close()

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
