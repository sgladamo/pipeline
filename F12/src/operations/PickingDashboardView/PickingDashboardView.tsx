import {
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { CoreContext } from "core/context";
import { fetchPickingOps } from "operations/fetch";
import { WipCurrentOp } from "operations/models";
import { requestSearch } from "core/utils";
import DefaultTableCell from "core/DefaultTableCell";
import DefaultTableRow from "core/DefaultTableRow";
import GreenTableRow from "core/GreenTableRow";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterval } from "usehooks-ts";
import { OperationsContext } from "operations/context";

function PickingDashboardView() {
  const { setCurrentPickingOp } = useContext(OperationsContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const { searchValue } = useContext(CoreContext);

  const [pickingOps, setPickingOps] = useState<WipCurrentOp[]>();
  const [opsState, setOpsState] = useState<WipCurrentOp[]>([]);

  useLayoutEffect(() => {
    let filtered: WipCurrentOp[] = [];
    if (pickingOps) {
      pickingOps.forEach((op) => {
        if (requestSearch(searchValue, op)) {
          filtered.push({ ...op });
        }
      });
    }
    setOpsState(filtered);
  }, [pickingOps, searchValue]);

  useEffect(() => {
    fetchPickingOps().then((data) => setPickingOps(data));
  }, []);

  useInterval(() => {
    fetchPickingOps().then((data) => setPickingOps(data));
  }, 2500);

  return (
    <Grid
      container
      rowSpacing={0}
      columnSpacing={0}
      sx={{
        width: "100vw",
        height: "calc(100% - 54px)",
      }}
    >
      <Grid
        item
        xs={12}
        height="97.5%"
        sx={{
          mx: 5,
          my: 2.5,
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                colSpan={6}
                sx={{
                  borderBottom: "none",
                }}
              >
                <Stack direction="row">
                  <Chip
                    label={pickingOps?.length}
                    variant="outlined"
                    sx={{ mr: 2, fontWeight: "bold" }}
                    size="small"
                  />
                  <Typography fontSize={16} fontWeight="bold">
                    Picking Operations
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        <TableContainer
          component={Paper}
          sx={{
            border: `0.5px solid ${theme.palette.divider}`,
            boxShadow: "none",
            height: "100%",
            backgroundImage: "none",
          }}
        >
          <Table
            size="medium"
            stickyHeader
            sx={{
              borderBottom: `0.5px solid ${theme.palette.divider}`,
            }}
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
              {opsState?.map((op) => {
                return pickingOps && pickingOps[0].job === op.job ? (
                  <GreenTableRow
                    key={op.job}
                    onClick={() => {
                      setCurrentPickingOp(op);
                      navigate(`/picking/${op.job}`);
                    }}
                  >
                    <DefaultTableCell component="th" scope="row">
                      {op.job?.replace("000000000", "")}
                    </DefaultTableCell>
                    <DefaultTableCell>{op.stockCode}</DefaultTableCell>
                    <DefaultTableCell>{op.stockDescription}</DefaultTableCell>
                    <DefaultTableCell>{op.qtyToMake}</DefaultTableCell>
                    <DefaultTableCell>{op.priority}</DefaultTableCell>
                    <DefaultTableCell>
                      {(op.priority as number) <= 19 ? "Sales" : "Stock"}
                    </DefaultTableCell>
                    <DefaultTableCell>
                      {op.nextWorkCentre === "ASSY01"
                        ? op.nextWorkCentreIMachine
                        : op.nextWorkCentre}
                    </DefaultTableCell>
                  </GreenTableRow>
                ) : (
                  <DefaultTableRow
                    key={op.job}
                    onClick={() => {
                      setCurrentPickingOp(op);
                      navigate(`/picking/${op.job}`);
                    }}
                  >
                    <DefaultTableCell component="th" scope="row">
                      {op.job?.replace("000000000", "")}
                    </DefaultTableCell>
                    <DefaultTableCell>{op.stockCode}</DefaultTableCell>
                    <DefaultTableCell>{op.stockDescription}</DefaultTableCell>
                    <DefaultTableCell>{op.qtyToMake}</DefaultTableCell>
                    <DefaultTableCell>{op.priority}</DefaultTableCell>
                    <DefaultTableCell>
                      {(op.priority as number) <= 19 ? "Sales" : "Stock"}
                    </DefaultTableCell>
                    <DefaultTableCell>
                      {op.nextWorkCentre === "ASSY01"
                        ? op.nextWorkCentreIMachine
                        : op.nextWorkCentre}
                    </DefaultTableCell>
                  </DefaultTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default PickingDashboardView;
