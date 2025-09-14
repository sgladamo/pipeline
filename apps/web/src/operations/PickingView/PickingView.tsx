import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridSelectionModel,
} from "@mui/x-data-grid";
import { fetchJobAllOps, fetchPickList } from "operations/fetch";
import { WipCurrentOp, WipJobPickList } from "operations/models";
import AllOperationsDialog from "operations/AllOperationsDialog";
import DefaultTableCell from "core/DefaultTableCell";
import { useContext, useEffect, useState } from "react";
import PickingListFooter from "operations/PickingListFooter";
import { WipJobAllLab } from "core/models";
import { OperationsContext } from "operations/context";

const columns: GridColDef[] = [
  { field: "id", hide: true },
  {
    field: "stockCode",
    headerName: "Code",
    minWidth: 50,
    flex: 1,
    renderCell(params) {
      return <strong>{params.value}</strong>;
    },
  },
  {
    field: "stockDescription",
    headerName: "Description",
    minWidth: 800,
    flex: 1,
  },
  {
    field: "uom",
    headerName: "Uom",
    minWidth: 50,
    flex: 1,
  },
  {
    field: "totalReqd",
    headerName: "Total Req",
    minWidth: 50,
    flex: 1,
  },
  {
    field: "balance",
    headerName: "Balance",
    minWidth: 50,
    flex: 1,
  },
  {
    field: "bin",
    headerName: "Bin",
    minWidth: 100,
    flex: 1,
  },
  {
    field: "qtyIssued",
    headerName: "Qty Issued",
    minWidth: 50,
    flex: 1,
  },
];

function PickingView() {
  const { currentPickingOp, setCurrentPickingOp } =
    useContext(OperationsContext);
  const theme = useTheme();

  const [pickList, setPickList] = useState<WipJobPickList[]>();
  const [picked, setPicked] = useState<GridSelectionModel>([]);
  const [allOperations, setAllOperations] = useState<WipJobAllLab[]>();
  const [showBarcode, setShowBarcode] = useState(false);

  useEffect(() => {
    fetchPickList(currentPickingOp as WipCurrentOp).then((data) =>
      setPickList(data)
    );
  }, []);

  function handleOnSelectionModelChange(ids: GridSelectionModel) {
    setPicked(ids);
  }

  function handleBarcodeDialogClose() {
    setShowBarcode(false);
  }

  function handleBarcodeDialogOpen() {
    setShowBarcode(true);
  }

  function handleOnPickingJobClick() {
    fetchJobAllOps(currentPickingOp as WipCurrentOp).then((data) => {
      setAllOperations(data);
    });
  }

  function handleAllJobsDialogClose() {
    setTimeout(() => setAllOperations(undefined), 500);
  }

  return (
    <Grid
      container
      rowSpacing={0}
      columnSpacing={0}
      sx={{
        minWidth: "100vw",
        height: "calc(100% - 54px)",
      }}
    >
      <Grid
        item
        xs={12}
        height="70px"
        sx={{
          mx: 5,
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            height: "100%",
            mt: 5,
            border: `0.5px solid ${theme.palette.divider}`,
            boxShadow: "none",
            backgroundImage: "none",
          }}
        >
          <Table
            size="small"
            stickyHeader
            sx={{ borderBottom: `0.5px solid ${theme.palette.divider}` }}
          >
            <TableHead>
              <TableRow>
                <DefaultTableCell>Job</DefaultTableCell>
                <DefaultTableCell>Code</DefaultTableCell>
                <DefaultTableCell>Description</DefaultTableCell>
                <DefaultTableCell>Qty</DefaultTableCell>
                <DefaultTableCell>Priority</DefaultTableCell>
                <DefaultTableCell>Purpose</DefaultTableCell>
                <DefaultTableCell>Next Op</DefaultTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                key={currentPickingOp?.job}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  ":hover": {
                    cursor: "pointer",
                    backgroundColor: theme.palette.action.focus,
                  },
                }}
                onClick={handleOnPickingJobClick}
              >
                <DefaultTableCell component="th" scope="row">
                  {currentPickingOp?.job?.replace("000000000", "")}
                </DefaultTableCell>
                <DefaultTableCell>
                  {currentPickingOp?.stockCode}
                </DefaultTableCell>
                <DefaultTableCell>
                  {currentPickingOp?.stockDescription}
                </DefaultTableCell>
                <DefaultTableCell>
                  {currentPickingOp?.qtyToMake}
                </DefaultTableCell>
                <DefaultTableCell>
                  {currentPickingOp?.priority}
                </DefaultTableCell>
                <DefaultTableCell>
                  {(currentPickingOp?.priority as number) <= 19
                    ? "Sales"
                    : "Stock"}
                </DefaultTableCell>
                <DefaultTableCell>
                  {currentPickingOp?.nextWorkCentre === "ASSY01"
                    ? currentPickingOp?.nextWorkCentreIMachine
                    : currentPickingOp?.nextWorkCentre}
                </DefaultTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} height="90%">
        <DataGrid
          rows={pickList ? (pickList as GridRowsProp) : []}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={handleOnSelectionModelChange}
          selectionModel={picked}
          getRowId={(row) => row.stockCode}
          density="comfortable"
          sx={{
            m: 5,
          }}
          components={{
            Footer: PickingListFooter,
          }}
          componentsProps={{
            footer: {
              pickList: pickList ? pickList : [],
              picked: picked ? picked : [],
              showBarcode: handleBarcodeDialogOpen,
            },
          }}
        />
      </Grid>
      <Dialog
        onClose={handleBarcodeDialogClose}
        open={showBarcode}
        PaperProps={{
          elevation: 0,
        }}
      >
        <DialogTitle>
          {currentPickingOp?.job?.replace("000000000", "")} -{" "}
          {currentPickingOp?.jobDescription}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            fontFamily="'Libre Barcode 39', cursive;"
            fontSize={60}
            color={theme.palette.text.primary}
          >
            {currentPickingOp?.job}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBarcodeDialogClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <AllOperationsDialog
        handleDialogClose={handleAllJobsDialogClose}
        selectedJob={allOperations ? currentPickingOp : undefined}
        setSelectedJob={setCurrentPickingOp}
        allOperations={allOperations}
        setAllOperations={setAllOperations}
      />
    </Grid>
  );
}

export default PickingView;
