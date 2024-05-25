import React, { useEffect, useRef, useState } from "react";

import "./App.css";
import {
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Container,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
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
import PopupDetailAddress from "./components/PopupDetailAddress/PopupDetailAddress";
import { useDownloadExcel } from "react-export-table-to-excel";

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

interface IParameters {
  page: number;
  take: number;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    "&::before": {
      backgroundColor: theme.palette.common.white,
      border: "1px solid #dee2e6",
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "#212529",
    fontSize: "1.3rem",
    border: "1px solid #dee2e6",
    padding: "16px",
    textAlign: "left",
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

const timeAgo = (timestamp: string) => {
  const date = new Date(Number(timestamp) * 1000);
  const hour = date.getHours();
  if (hour > 0) {
    return `${hour} hrs ago`;
  }
  return `Just now`;
};

const convertTimestamp = (timestamp: string) => {
  const date = new Date(Number(timestamp) * 1000);

  const formattedTime =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) +
    " " +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2) +
    ":" +
    ("0" + date.getSeconds()).slice(-2);

  return formattedTime;
};

export const shortenAddress = (address: string) => {
  const start = address.slice(0, 10);
  const end = address.slice(-8);
  return `${start}....${end}`;
};

function App() {
  const tableRef = useRef<any>(null);
  const [dataTokenTransfer, setDataTokenTransfer] = useState<
    IDataTokenTransfer[]
  >([]);
  const [openDetail, setOpenDetail] = useState<string>("");
  const [copied, setCopied] = useState<string>("");
  const [parameters, setParameters] = useState<IParameters>({
    page: 1,
    take: 25,
  });
  const [isColumnDatetimeFormat, setIsColumnDatetimeFormat] =
    useState<boolean>(false);
  const [isShowInfoNote, setIsShowInfoNote] = useState<boolean>(true);

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
      label: (
        <Box sx={{ display: "flex", gap: "8px" }}>
          <span>Method</span>
          <LightTooltip
            title="Function executed based on decoded input data. For unidentified functional, method ID is displayed instead"
            arrow
            placement="right-start"
          >
            <HelpOutlineOutlinedIcon />
          </LightTooltip>
        </Box>
      ),
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
      label: (
        <BootstrapTooltip
          title={
            !isColumnDatetimeFormat
              ? "Click to show Datetime Format"
              : "Click to show Age"
          }
          placement="top"
        >
          <div>
            {isColumnDatetimeFormat && (
              <p
                style={{ color: "#0784c3", cursor: "pointer", width: "120px" }}
                aria-hidden
                onClick={() => {
                  setIsColumnDatetimeFormat(!isColumnDatetimeFormat);
                }}
              >
                Date Time (UTC)
              </p>
            )}
            {!isColumnDatetimeFormat && (
              <p
                style={{ color: "#0784c3", cursor: "pointer", width: "0px" }}
                aria-hidden
                onClick={() => {
                  setIsColumnDatetimeFormat(!isColumnDatetimeFormat);
                }}
              >
                Age
              </p>
            )}
          </div>
        </BootstrapTooltip>
      ),
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

  useEffect(() => {
    instanceAxios
      .get<IResponseDataTokenTransfer>(
        `?module=account&action=tokentx&contractaddress=0xe02df9e3e622debdd69fb838bb799e3f168902c5&address=0x0c82922944350ffe0ec8ad1f08995ae0eed10e75&page=${parameters.page}&offset=${parameters.take}&sort=asc&apikey=YourApiKeyToken`
      )
      .then((response: any) => {
        setDataTokenTransfer(response.result);
      })
      .catch((error) => {});
  }, [parameters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setParameters({
      ...parameters,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setParameters({
      ...parameters,
      take: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const { onDownload: onDownloadFileExcel } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "export-token-transfer",
    sheet: "export-token-transfer",
  });

  return (
    <div className="App">
      <Container maxWidth="lg">
        <div className="wrapper-table">
          <div className="wrapper-table-head">
            {isShowInfoNote && (
              <div className="wrapper-table-head-info">
                <div className="wrapper-table-head-info-text">
                  <span>
                    <InfoOutlinedIcon />
                    Transactions involving tokens marked as suspicious, unsafe,
                    spam or brand infringement are currently hidden. To show
                    them, go to Site Settings.
                  </span>
                </div>
                <IconButton
                  className="btn-close-info"
                  aria-label="close"
                  onClick={() => setIsShowInfoNote(false)}
                >
                  <CloseOutlinedIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </div>
            )}
            <div className="wrapper-table-head-table-info">
              <p>
                <BootstrapTooltip title="Oldest First" placement="right">
                  <FilterAltRoundedIcon />
                </BootstrapTooltip>
                Latest {parameters.take} BEP-20 Token Transfer Events (View All)
              </p>

              <Button
                onClick={onDownloadFileExcel}
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
              ref={tableRef}
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
                      role="checkbox"
                      tabIndex={-1}
                      key={item.blockNumber}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell scope="row" padding="none" align="center">
                        <ClickAwayListener
                          onClickAway={() => setOpenDetail("")}
                        >
                          <div>
                            <LightTooltip
                              PopperProps={{
                                disablePortal: true,
                              }}
                              onClose={() => setOpenDetail("")}
                              open={openDetail === item.hash}
                              disableFocusListener
                              disableHoverListener
                              disableTouchListener
                              title={
                                <PopupDetailAddress
                                  from={item.from}
                                  to={item.to}
                                  transactionFee={0.03}
                                  nonce={item.nonce}
                                />
                              }
                              arrow
                              placement="right"
                              sx={{
                                maxWidth: "400px",

                                ".MuiTooltip-tooltip": {
                                  maxWidth: "400px",
                                },
                              }}
                            >
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setOpenDetail(item.hash);
                                }}
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
                            </LightTooltip>
                          </div>
                        </ClickAwayListener>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <Link to="/" className="title-transaction-hash">
                          {item.hash}
                        </Link>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <BootstrapTooltip title="Transfer" placement="top">
                          <Chip
                            label="Transfer"
                            sx={{
                              border: "1px solid #dfe0e1",
                              borderRadius: "6px",
                              height: "24px",
                              fontSize: "1.1rem",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                        </BootstrapTooltip>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <Link
                          to={`/block/${item.blockNumber}`}
                          className="title-transaction-hash title-transaction-block-number"
                        >
                          {item.blockNumber}
                        </Link>
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <BootstrapTooltip
                          title={
                            !isColumnDatetimeFormat
                              ? convertTimestamp(item.timeStamp)
                              : timeAgo(item.timeStamp)
                          }
                          placement="top"
                        >
                          <p
                            className="title-time-ago"
                            style={{
                              width: isColumnDatetimeFormat ? "140px" : "70px",
                            }}
                          >
                            {isColumnDatetimeFormat
                              ? convertTimestamp(item.timeStamp)
                              : timeAgo(item.timeStamp)}
                          </p>
                        </BootstrapTooltip>
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={130}
            rowsPerPage={parameters.take}
            page={parameters.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Container>
    </div>
  );
}

export default App;
