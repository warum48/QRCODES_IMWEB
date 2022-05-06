import React from "react";
import {
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";

export const LinkWithTooltip = ({_key, placement="top", tipText="", linkClassName="btn", btnVariant="", href='', children}) => {
    
    return (
        <OverlayTrigger
                  key={_key}
                  placement={placement}
                  overlay={
                    <Tooltip id={"tooltip"+_key}>
                      {tipText}
                    </Tooltip>
                  }
                >
                
                <a href={href} target="_blank" className={linkClassName} rel="nofollow noopener">
                      {children}
                    </a>
        </OverlayTrigger>
        )
}

/*
<OverlayTrigger
                  key="bottom_01"
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-bottom-new-card_1">
                      Добавить новую запись
                    </Tooltip>
                  }
                >
                <button className="btn btn-warning" title="Добавить новую запись" onClick={addToken}><FaPlusSquare /></button>
              </OverlayTrigger> */