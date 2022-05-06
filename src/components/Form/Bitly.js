import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ButtonWithTooltip } from "../../components/ButtonWithTooltip";
import { FaMagic } from "react-icons/fa";
//import { reducer } from "../../components/reducer";
import { BitlyClient } from "bitly";
import validator from "validator";
import { useAlert } from "react-alert";

//sp@nahab.info
//Login: sp@nahab.info // Passoword: 2sp@nahab.info

export const Bitly = ({ state, dispatch, btnClassName = "btn" }) => {
  const alert = useAlert();
  const link = React.useRef(null);
  //const bitly = new BitlyClient("b1933e4c095feeb35496d0e4c69513380de262fc", {}); //test from someone in codesandbox
  const bitly = new BitlyClient("117275687565fe15c98667637f49304b3f01454a", {});

  const handleClick = (event) => {
    const enteredName = prompt("Введите ссылку для укорачивания");
    console.log("enteredName", enteredName);
    if (!validator.isURL(enteredName, { require_protocol: true })) {
      alert.error("Ссылка не корректна, вставьте полную ссылку");
      event.preventDefault();
      return;
    }
    link.current = enteredName;
    handleForm();
    event.preventDefault();
  };

  const handleForm = async (e) => {
    try {
      console.log("message", link.current);
      const result = await bitly.shorten(link.current);
      /*this.setState({
                  myresult: result.url
                });*/
      console.log("result.url", result.link);
      dispatch({
        type: "updateFieldValue",
        field: "redirect_url",
        value: result.link
      });
    } catch (e) {
      throw e;
    }
    //return result;
  };
  return (
    <ButtonWithTooltip
      _key="right-linkbit"
      placement="right"
      btnClassName={btnClassName}
      onClick={handleClick}
      //onClickParam={card}
      tipText="Вставить через bit.ly"
    >
      <FaMagic />
    </ButtonWithTooltip>
  );
};

/*
<OverlayTrigger
                      key="right-linkbit"
                      placement="right"
                      overlay={
                        <Tooltip id="tooltip-right-linkbit">
                          Вставить через bit.ly
                        </Tooltip>
                      }
                    >
                    <Button variant="warning" onClick={generateID} disabled = {editExisted ? true : false}>
                      <FaMagic />
                    </Button>
                  </OverlayTrigger>
                  */
