import React from "react";
import {
  Button,
} from "react-bootstrap";

export const MoreButton = ({dB, viewItemsLim, setViewItemsLim, outOf=0}) => {
    
    return (
        <>
            { 
              (dB && viewItemsLim < outOf) &&
                <Button variant="outline-dark" className="btn-outline-gray" onClick={() => setViewItemsLim(viewItemsLim+viewItemsLim)}>
                  {viewItemsLim} из {outOf} / ПОКАЗАТЬ { (viewItemsLim+viewItemsLim < outOf) ? viewItemsLim+viewItemsLim : 'ВСЁ' }
                </Button> 
            }
        </>
        )
}