import React from "react";
import { Button, Row } from "react-bootstrap";
import LazyLoad from "react-lazyload";
import { FaEdit, FaShareAlt } from "react-icons/fa";
import YandexShare from "../../components/Form/YandexShare";
import { redirect_base } from "../../components/CONSTANTS";

export const ShareView = ({
  dB,
  searchAndSlice,
  getDesc,
  showShare,
  editToken
}) => {
  /*const filterSearchShare = () => {
    //console.log(dB.filter(item => item.use_share=="1"))
    //return true;
    //people.filter(person => person.age < 60)
  }
  
  const searchAndSlice = (items) => {
    if(items){
      return items.
            filter(item => filterSearch(item)).
            slice(0, filterLim || viewItemsLim)
    }else{
      return []
    }
  }*/

  return (
    <>
      <Row className="view_cards">
        {searchAndSlice(dB)
          //filter(item =>  item.share_img !="" ).
          .map((card, index) => (
            <div
              className="col col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12"
              key={"card" + index}
            >
              <div className="card card-share">
                {/*<LazyLoad>*/}
                <div className="card-head">
                  {/*<img src='https://dummyimage.com/600x400/eeeeee/eeeeee.png' className='img-fluid placeholder' />*/}
                  <img
                    src="https://dev.nahab.info/dev-qrcodes/assets/img/noimage.png"
                    className="img-fluid placeholder"
                  />
                  <div
                    className="share_img"
                    style={{
                      background:
                        'url("' + card.share_img + '") 50% 50% no-repeat',
                      backgroundSize: "cover"
                    }}
                  ></div>
                  <div className="logo_short_1" rel={card.site}>
                    <i></i>
                  </div>
                  <div className="buttons">
                    {/* (card.use_share == "1" ) && <button type="button" className="btn btn-warning button_share" onClick={()=>showShare(card)}>
                        <FaShareAlt />
                    </button>*/}
                    <button
                      type="button"
                      className="btn btn-danger button_edit"
                      onClick={() => editToken(card)}
                    >
                      <FaEdit />
                    </button>
                  </div>
                  <div className="counter border">{card.redirect_counter}</div>
                </div>
                {/*</LazyLoad>*/}
                <div className="card-body">
                  <div
                    className={`card-text text_head text_short share_w_placeholde ${
                      card.share_title ? "showme" : ""
                    }`}
                    title={card.share_title}
                  >
                    {card.share_title ? (
                      <>{card.share_title}</>
                    ) : (
                      <span>Отсутствует заголовок</span>
                    )}
                  </div>
                  <div
                    className={`card-text text_descr text_short share_w_placeholde ${
                      card.share_desc ? "showme" : ""
                    }`}
                    title={card.share_desc}
                  >
                    {card.share_desc ? (
                      <>{card.share_desc}</>
                    ) : (
                      <span>Отсутствует описание</span>
                    )}
                  </div>
                  {/*<a className="share_shortlink" target="_blank" rel="noopener noreferrer" href={curObPreview.site + (curObPreview.token||curObPreview.short_id)}>{curObPreview.site + (curObPreview.token||curObPreview.short_id)}</a>*/}
                  <div className="card-text text_link text_short share_w_placeholde showme">
                    <a
                      href={card.redirect_url}
                      className=" text-muted"
                      title={card.redirect_url}
                      target="_blank"
                    >
                      {card.redirect_url}
                    </a>
                  </div>

                  {/*
                  <div className="social_share_box share_w_placeholde showme">
                    <p>Поделиться</p>
                    <YandexShare content={{ 
                        title: card.share_title,  
                        description: card.share_desc, 
                        image: card.share_img,
                        //url: state.site + state.token + '?rand='+Math.random(),
                        url: redirect_base ? card.site + card.token : redirect_base + card.token
                    }}/>
                  </div>
                  */}
                </div>
              </div>
            </div>
          ))}
      </Row>
    </>
  );
};
