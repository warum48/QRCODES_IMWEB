import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import YandexShare from "../../components/Form/YandexShare";
import { redirect_base } from "../../components/CONSTANTS";

export const SharePreview = ({ state, shortLink, editExisted = false }) => {
  return (
    <div
      className={`share-preview ${
        state.use_share === 1 ||
        state.use_share === "1" ||
        state.use_share === true
          ? ""
          : "show_placeholder"
      }`}
    >
      {/*<div className="share-preview show_placeholder">*/}

      {/* (!state.share_title && !state.share_img && !state.share_desc) && 
                <div className="noshare-info">Плейсхолдеры полей</div>
             }
              { state.share_img && 
              <a href={state.site  + state.token +"?preview=1 "} target="_blank" className="imgbox" rel="nofollow noopener">
                <img
                  className="img-fluid"
                  src={state.share_img || "https://sp.imweb.ru/implant/sp/assets/spshare/share.jpg"}
                />
              </a>
              }
              <h4>{state.share_title }</h4>
              <p>
                {state.share_desc }
              </p>
              { (state.share_title || state.share_img || state.share_desc) && 
                <a className="share_shortlink" href={state.site + (state.token||state.short_id)}target="_blank" rel="noopener noreferrer">{state.site + (state.token||state.short_id)}</a>
              */}

      <div
        className={`share_img share_w_placeholde ${
          state.share_img ? "showme" : ""
        }`}
      >
        {state.share_img ? (
          <a
            href={state.site + state.token + "?preview=1 "}
            target="_blank"
            className="imgbox"
            rel="nofollow noopener"
          >
            <img
              className="img-fluid"
              src={
                state.share_img ||
                "https://sp.imweb.ru/implant/sp/assets/spshare/share.jpg"
              }
            />
          </a>
        ) : (
          <img
            src="https://dev.nahab.info/dev-qrcodes/assets/img/noimage.png"
            className="img-fluid"
          />
        )}
      </div>
      <div
        className={`share_head share_w_placeholde ${
          state.share_title ? "showme" : ""
        }`}
      >
        {state.share_title ? (
          <>{state.share_title}</>
        ) : (
          <span>Отсутствует заголовок</span>
        )}
      </div>
      <div
        className={`share_dicr share_w_placeholde ${
          state.share_desc ? "showme" : ""
        }`}
      >
        {state.share_desc ? (
          <>{state.share_desc}</>
        ) : (
          <span>Отсутствует описание</span>
        )}
      </div>

      {/*
              <div className={`share_link share_w_placeholde ${(state.share_title || state.share_img || state.share_desc) ?"showme":""}`}>
                { (state.share_title || state.share_img || state.share_desc) ?
                  <a className="share_shortlink" href={state.site + (state.token||state.short_id)} target="_blank" rel="noopener noreferrer">{state.site + (state.token||state.short_id)}</a>
                  :
                  <span></span>
                }
                
              </div>*/}

      {(state.share_title || state.share_img || state.share_desc) &&
        editExisted &&
        (state.use_share === 1 ||
          state.use_share === "1" ||
          state.use_share === true) && (
          <div className="social_share_box">
            <p>Поделиться</p>
            <YandexShare
              content={{
                title: state.share_title,
                description: state.share_desc,
                image: state.share_img,
                //url: state.site + state.token + '?rand='+Math.random(),
                url: shortLink + "?rand=" + Math.random() //redirect_base ? state.site + state.token : redirect_base + state.token
              }}
            />
          </div>
        )}

      <p className="box_social_guides">
        <a
          href="https://docs.google.com/document/d/1ZxIdj7sJC34CQq9qUcJK01FZMnnhqkZykxQP5wv8yeM/edit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Рекомендации для социальных сетей
        </a>
      </p>
      <p className="box_social_guides">
        <OverlayTrigger
          key="bottom-utmlinke"
          placement="bottom"
          overlay={
            <Tooltip id="tooltip-bottom-utmlinke">
              Обернуть ссылку в UTM метки и скопировать финальную ссылку можно
              тут
            </Tooltip>
          }
        >
          <a
            href="https://tilda.cc/ru/utm/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Генератор UTM-меток
          </a>
        </OverlayTrigger>
      </p>
    </div>
  );
};
