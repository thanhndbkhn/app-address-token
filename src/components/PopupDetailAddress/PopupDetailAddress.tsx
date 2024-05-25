import React from "react";
import Divider from "@mui/material/Divider";
import "./style.css";
import { Link } from "react-router-dom";
import BoxIcon from "../../icons/Box";
import { shortenAddress } from "../../App";

interface Props {
  from: string;
  to: string;
  transactionFee: number;
  nonce: string;
}

const PopupDetailAddress = ({ from, to, transactionFee, nonce }: Props) => {
  return (
    <div className="wrapper-popup-detail-address">
      <h4>Additional Info</h4>
      <div className="wrapper-popup-detail-address-item">
        <p className="popup-detail-label">Status:</p>
        <p className="popup-detail-content text-success">
          Success
          <span className="popup-detail-content text-secondary">
            (24645 Block Confirmations)
          </span>
        </p>
      </div>
      <Divider sx={{ margin: "12px 0" }} />
      <div className="wrapper-popup-detail-address-item">
        <p className="popup-detail-label">Token Transfer:</p>
        <p className="popup-detail-send">
          <BoxIcon /> 50 <span className="text-primary">MT</span>
        </p>
        <div className="popup-detail-send-content">
          <span className=" text-secondary">From </span>
          <span className="text-primary">{shortenAddress(from)}</span>
          <span className=" text-secondary"> To </span>
          <span className="text-primary">{shortenAddress(to)}</span>
        </div>
      </div>
      <Divider sx={{ margin: "12px 0" }} />
      <div className="wrapper-popup-detail-address-item">
        <p className="popup-detail-label">Transaction Fee:</p>
        <p>{transactionFee} BNB ($0.03)</p>
      </div>
      <Divider sx={{ margin: "12px 0" }} />
      <div className="wrapper-popup-detail-address-item">
        <p className="popup-detail-label">Gas Info:</p>
        <p>36,694 gas used from 36,694 limit</p>
        <p>@ 0.0000000015 BNB (1.5 Gwei)</p>
      </div>
      <Divider sx={{ margin: "12px 0" }} />
      <div className="wrapper-popup-detail-address-item">
        <p className="popup-detail-label">Nonce:</p>
        <p>
          {nonce} <span className=" text-secondary"> (in the position 25)</span>
        </p>
      </div>
      <Divider sx={{ margin: "12px 0" }} />
      <div>
        <Link to="/" className="text-primary">
          See more details
        </Link>
      </div>
    </div>
  );
};

export default PopupDetailAddress;
