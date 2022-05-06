import React from "react";
import {
  Button,
} from "react-bootstrap";

export const CopyView = ({dB, searchAndSlice, getDesc}) => {
    
    return (
        <>
            <div className="listviewer">
          <div className="list-elem list_ulrfull">
            {searchAndSlice(dB).
            map((card, index) => (
              <div className="dotsbox" title={card.site + card.token} key={"su"+index}>{card.site + card.token}</div>
             ))}
          </div>
          <div className="list-elem list_ulrshort">
            {searchAndSlice(dB).
            map((card, index) => (
              <div  className="dotsbox" title={card.redirect_url} key={"ru"+index}>{card.redirect_url}</div>
             ))}
          </div>
          <div className="list-elem list_comment">
            {searchAndSlice(dB).
            map((card, index) => (
              <div className="dotsbox" key={"desc"+index}>{card.vars != '' ? (getDesc(card) != '' ? getDesc(card) : '-') : '-'}</div>
             ))}
          </div>
        </div>
        </>
        )
}