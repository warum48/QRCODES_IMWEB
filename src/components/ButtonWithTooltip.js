import React from "react";
import {
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
//_onClick={()=>onClick(onClickParam)}

export const ButtonWithTooltip = ({_key, placement="top", tipText="", btnClassName="btn", btnVariant="", onClick, onClickParam=null,  children}) => {
    
    return (
      <>
        <OverlayTrigger
                  key={_key}
                  placement={placement}
                  overlay={
                    <Tooltip id={"tooltip"+_key}>
                      {tipText}
                    </Tooltip>
                  }
                >
                <button className={btnClassName} 
                //title={tipText} 
                onClick={onClick} >{children}</button>
        </OverlayTrigger>
        
        {/*<button className={btnClassName} title={tipText} onClick={onClick} >{children}</button>*/}
        </>
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