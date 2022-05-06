import React from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { ButtonWithTooltip } from "../../components/ButtonWithTooltip";
import { FaMagic } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import validator from "validator";
import { useAlert } from "react-alert";

export const MagicShareFiller = ({
  state,
  dispatch,
  callback = null,
  type = "icon"
}) => {
  const alert = useAlert();
  var apiurl = window.location.hostname.includes("nahab")
    ? "https://dev.nahab.info/go/html/"
    : "../../html/"; //"https://sp.imweb.ru/go2/tokens";
  function handleClick(e) {
    if (!validator.isURL(state.redirect_url)) {
      alert.error("Redirect URL пуст или не является ссылкой");
      e.preventDefault();
      return;
    }
    alert.info("Ссылка обрабатывается, это может занять несколько секунд");

    fetch(apiurl + "?url=" + state.redirect_url)
      .then((res) => res.json())
      .then((fin) => {
        console.log(fin);
        let el = document.createElement("html");
        el.innerHTML = fin.response;
        //console.log(el.querySelectorAll('[property="og:description"]'));
        //console.log(el.querySelectorAll('[property="og:description"]')[0].content);
        console.log(
          'el.getElementsByTagName("title")[0].textContent',
          el.getElementsByTagName("title")[0].textContent
        );
        let title =
          el.querySelectorAll('[property="og:title"]')[0].content ||
          el.getElementsByTagName("title")[0].textContent ||
          el.querySelectorAll('[property="og:title"]')[0].content;
        let desc =
          el.querySelectorAll('[property="og:description"]')[0].content ||
          el.querySelectorAll('[property="description"]')[0].content ||
          el.querySelectorAll('[property="og:description"]')[0].content;
        let img =
          el.querySelectorAll('[property="og:image"]')[0].content ||
          el.querySelectorAll('[property="twitter:image"]')[0].content;

        dispatch({
          type: "updateFieldValue",
          field: "share_desc",
          value: desc
        });
        dispatch({
          type: "updateFieldValue",
          field: "share_title",
          value: title
        });
        dispatch({ type: "updateFieldValue", field: "share_img", value: img });

        dispatch({
          type: "updateFieldValue",
          field: "auto_share",
          value: true
        });

        if (callback) {
          callback();
        }
      })
      .catch((error) => {
        alert.error("Не удается выполнить запрос, заполните поля вручную");
        console.error("Error:", error);
        if (callback) {
          callback();
        }
      });
    e.preventDefault();
  }
  return (
    <>
      {type == "icon" ? (
        <ButtonWithTooltip
          _key="share-auto-gen"
          placement="right"
          btnClassName="btn btn-outline-dark"
          onClick={(e) => handleClick(e)}
          //onClickParam={card}
          tipText="Заполнить шер автоматически (из ссылки на материал)"
        >
          <FaMagic />
        </ButtonWithTooltip>
      ) : (
        <Button variant="warning" onClick={(e) => handleClick(e)}>
          Да
        </Button>
      )}
    </>
  );
};

/*<OverlayTrigger
                        key="share-auto-gen"
                        placement="right"
                        overlay={
                          <Tooltip id="share-autogen">
                            Заполнить на основе ссылки для редиректа
                          </Tooltip>
                        }
                      >  
                      <Button variant="warning" onClick={generateID} disabled = {editExisted ? true : false}>
                        <FaMagic />
                      </Button>
                    </OverlayTrigger>*/
