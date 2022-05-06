import React from "react";
import {
  Button, Row
} from "react-bootstrap";
import LazyLoad from 'react-lazyload';
import { FaEdit,  FaShareAlt} from "react-icons/fa";


export const CardView = ({dB, searchAndSlice, getDesc, showShare, editToken, redirect_base}) => {
    
    return (
        <>
        <Row className='view_cards'>
          {searchAndSlice(dB).
            map((card, index) => (
            <div className="col col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12" key={"card"+index}>
              <div className="card">
              {/*<LazyLoad>*/}
                <div className='card-head' style={{ background:'url("https://dev.nahab.info/all/i.php?u='+card.redirect_url+'") 50% 50% no-repeat' , backgroundSize:'cover' }}>
                  <img src='https://dummyimage.com/600x400/ffffff/ffffff.png' className='img-fluid placeholder' />
                  <div className='logo_short_1' rel={card.site}><i></i></div>
                  <div className='buttons'>
                    { (card.use_share == "1" ) && <button type="button" className="btn btn-warning button_share" onClick={()=>showShare(card)}>
                        <FaShareAlt />
                    </button>}
                    <button type="button" className="btn btn-danger button_edit"  onClick={()=>editToken(card)}>
                        <FaEdit />
                    </button>
                  </div>
                  <div className='counter border'>{card.redirect_counter}</div>
                </div>
                {/*</LazyLoad>*/}
                <div className="card-body">
                  <div className="card-text text_short">{card.token}</div>
                  <div className="card-text text-muted text_short">{card.redirect_url}</div>
                </div>
              </div>
            </div>
          ))}
        </Row>
        </>
        )
}