import React, { useEffect, useState } from "react";

import "./App.css";
import {
  Button,
  Chip,
  Container,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { instanceAxios } from "./config/axios";
import { Link } from "react-router-dom";

interface Data {
  helper: React.ReactNode;
  transactionHash: string;
  method: React.ReactNode;
  block: React.ReactNode;
  age: string;
  from: React.ReactNode;
  inOut: React.ReactNode;
  to: React.ReactNode;
  value: string;
  token: React.ReactNode;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string | React.ReactNode;
  numeric: boolean;
  width?: number;
  className?: string;
  align: "center" | "inherit" | "justify" | "left" | "right";
}

interface IDataTokenTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  to: string;
  contractAddress: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

interface IResponseDataTokenTransfer {
  status: string;
  message: string;
  result: IDataTokenTransfer[];
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "#212529",
    fontSize: "1.3rem",
    border: "1px solid #dee2e6",
    padding: "16px",
  },
}));

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: "1.3rem",
  },
}));

const headCells: readonly HeadCell[] = [
  {
    id: "helper",
    numeric: false,
    disablePadding: true,
    label: (
      <LightTooltip
        title="See preview of the Transaction details"
        arrow
        placement="right-start"
      >
        <HelpOutlineOutlinedIcon />
      </LightTooltip>
    ),
    width: 52,
    className: "table-head-see",
    align: "center",
  },
  {
    id: "transactionHash",
    numeric: false,
    disablePadding: false,
    label: "Transaction Hash",
    align: "left",
  },
  {
    id: "method",
    numeric: false,
    disablePadding: false,
    label: "Method",
    align: "left",
  },
  {
    id: "block",
    numeric: true,
    disablePadding: false,
    label: "Block",
    align: "left",
  },
  {
    id: "age",
    numeric: true,
    disablePadding: false,
    label: "Age",
    align: "left",
  },
  {
    id: "from",
    numeric: true,
    disablePadding: false,
    label: "From",
    align: "left",
  },
  {
    id: "inOut",
    numeric: true,
    disablePadding: false,
    label: "",
    align: "left",
  },
  {
    id: "to",
    numeric: true,
    disablePadding: false,
    label: "To",
    align: "left",
  },
  {
    id: "value",
    numeric: true,
    disablePadding: false,
    label: "Value",
    align: "left",
  },
  {
    id: "token",
    numeric: true,
    disablePadding: false,
    label: "Token",
    align: "left",
  },
];

const timeAgo = (timestamp: string) => {
  const date = new Date(Number(timestamp) * 1000);
  const hour = date.getHours();
  if (hour > 0) {
    return `${hour} hrs ago`;
  }
  return `Just now`;
};

const shortenAddress = (address: string) => {
  const start = address.slice(0, 10);
  const end = address.slice(-8);
  return `${start}....${end}`;
};

function App() {
  const [dataTokenTransfer, setDataTokenTransfer] = useState<
    IDataTokenTransfer[]
  >([]);

  const [copied, setCopied] = useState<string>("");

  useEffect(() => {
    instanceAxios
      .get<IResponseDataTokenTransfer>(
        "?module=account&action=tokentx&contractaddress=0xe02df9e3e622debdd69fb838bb799e3f168902c5&address=0x0c82922944350ffe0ec8ad1f08995ae0eed10e75&page=1&offset=5&sort=asc&apikey=YourApiKeyToken"
      )
      .then((response: any) => {
        setDataTokenTransfer(response.result);
        // setLoading(false);
      })
      .catch((error) => {
        // setError(error);
        // setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <Container maxWidth="lg">
        <div className="wrapper-table">
          <div className="wrapper-table-head">
            <div className="wrapper-table-head-info">
              <div className="wrapper-table-head-info-text">
                <span>
                  <InfoOutlinedIcon />
                  Transactions involving tokens marked as suspicious, unsafe,
                  spam or brand infringement are currently hidden. To show them,
                  go to Site Settings.
                </span>
              </div>
              <IconButton className="btn-close-info" aria-label="close">
                <CloseOutlinedIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </div>
            <div className="wrapper-table-head-table-info">
              <p>
                <BootstrapTooltip title="Oldest First" placement="right">
                  <FilterAltRoundedIcon />
                </BootstrapTooltip>
                Latest 25 BEP-20 Token Transfer Events (View All)
              </p>
              <Button
                startIcon={<FileDownloadRoundedIcon />}
                variant="outlined"
                size="medium"
                sx={{
                  textTransform: "capitalize",
                  color: "#212529",
                  borderColor: "#e9ecef",
                  padding: "4px 8px",
                  fontSize: "1.3rem",
                  letterSpacing: "0px",

                  ".MuiButton-icon": {
                    marginRight: "2px",
                  },
                }}
              >
                Download Page Data
              </Button>
            </div>
          </div>
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size={"medium"}
              sx={{
                ".MuiTableCell-head": {
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  padding: "8px 12px",
                },

                ".MuiTableCell-root": {
                  padding: "8px 12px",
                  fontSize: "1.4rem",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.align}
                      width={headCell.width}
                      className={headCell.className}
                      sx={{
                        ".MuiTableCell-root": {
                          padding: "1px !important",
                          fontSize: "1.3rem",
                        },
                      }}
                    >
                      {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTokenTransfer.map((item) => {
                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={item.blockNumber}
                      // selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        // component="th"
                        // id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        <Button
                          startIcon={<RemoveRedEyeOutlinedIcon />}
                          variant="outlined"
                          size="small"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#212529",
                            borderColor: "#e9ecef",
                            padding: "8px",

                            ".MuiButton-icon": {
                              width: "14px",
                              height: "14px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: "0px",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        // component="th"
                        // id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Link to="/" className="title-transaction-hash">
                          {item.hash}
                        </Link>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <BootstrapTooltip title="Transfer" placement="top">
                          <Chip
                            label="Transfer"
                            sx={{
                              border: "1px solid #919191",
                              borderRadius: "6px",
                              padding: "2px 0",
                              height: "20px",
                              fontSize: "1.1rem",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                        </BootstrapTooltip>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <Link
                          to={`/block/${item.blockNumber}`}
                          className="title-transaction-hash"
                        >
                          {item.blockNumber}
                        </Link>
                      </TableCell>
                      <TableCell
                        // component="th"
                        // id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <p className="title-time-ago">
                          {timeAgo(item.timeStamp)}
                        </p>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <div className="wrapper-address-title">
                          <BootstrapTooltip title={item.from} placement="top">
                            <p>{shortenAddress(item.from)}</p>
                          </BootstrapTooltip>

                          <IconButton
                            aria-label="copy"
                            aria-hidden
                            onClick={() => {
                              navigator.clipboard.writeText(item.from);
                              setCopied(item.from);
                              setTimeout(() => {
                                setCopied("");
                              }, 1000);
                            }}
                          >
                            <BootstrapTooltip
                              title={
                                copied !== item.from ? "Copy Address" : "Copied"
                              }
                              placement="top"
                            >
                              <ContentCopyRoundedIcon />
                            </BootstrapTooltip>
                          </IconButton>
                        </div>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <Chip
                          label="IN"
                          sx={{
                            border: "1px solid rgba(0,161,134)",
                            borderRadius: "6px",
                            padding: "2px 0",
                            height: "20px",
                            fontSize: "1.1rem",
                            backgroundColor: "rgba(0,161,134, 0.1)",
                            fontWeight: 600,
                            color: "rgba(0,161,134)",
                          }}
                        />
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <div className="wrapper-address-title">
                          <BootstrapTooltip title={item.to} placement="top">
                            <p>{shortenAddress(item.to)}</p>
                          </BootstrapTooltip>
                          <IconButton
                            aria-label="copy"
                            aria-hidden
                            onClick={() => {
                              navigator.clipboard.writeText(item.to);
                              setCopied(item.to);
                              setTimeout(() => {
                                setCopied("");
                              }, 1000);
                            }}
                          >
                            <BootstrapTooltip
                              title={
                                copied !== item.to ? "Copy Address" : "Copied"
                              }
                              placement="top"
                            >
                              <ContentCopyRoundedIcon />
                            </BootstrapTooltip>
                          </IconButton>
                        </div>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <BootstrapTooltip title="50" placement="top">
                          <span>50</span>
                        </BootstrapTooltip>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <BootstrapTooltip title="Mock Token" placement="top">
                          <div className="wrapper-address-title">
                            <p>{shortenAddress("BEP-20: Mock token")}</p>
                          </div>
                        </BootstrapTooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </div>
  );
}

export default App;
