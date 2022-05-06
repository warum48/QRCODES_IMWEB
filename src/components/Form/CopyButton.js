import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { ButtonWithTooltip } from "../../components/ButtonWithTooltip"; //, setToolTipContent
import { FaQrcode, FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { useAlert } from "react-alert";

export const CopyButton = ({ stringToCopy, text, btnClassName = "btn" }) => {
  const alert = useAlert();
  const [toolTipContent, setToolTipContent] = useState(
    text || "Скопировать короткую ссылку"
  );

  function copyString(e) {
    /*console.log("resultCode", resultCode);
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      console.log("copied");
      return navigator.clipboard.writeText(resultCode);
    }*/
    if (!stringToCopy) {
      alert.error("Ссылка не доступна, не заполнены поля");
    }
    document.addEventListener(
      "copy",
      function (e) {
        e.clipboardData.setData("text/plain", stringToCopy);
        e.preventDefault();
      },
      true
    );
    document.execCommand("copy");

    setToolTipContent("Скопировано ✔");
    setTimeout(() => setToolTipContent(text), 1500);
    e.preventDefault();
  }

  return (
    <ButtonWithTooltip
      _key="bottom-copyshort"
      placement="bottom"
      btnClassName={btnClassName}
      onClick={(e) => copyString(e)}
      //onClickParam={card}
      tipText={toolTipContent}
    >
      <FaCopy />
    </ButtonWithTooltip>
  );
};

/*
<OverlayTrigger
                          key="bottom-copyshort"
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-bottom-copyshort">
                              Скопировать короткую ссылку
                            </Tooltip>
                          }
                        >
                        <Button variant="secondary">
                          <FaCopy />
                        </Button>
                      </OverlayTrigger>*/
