import React, { useEffect } from "react";
import { FaQrcode, FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { CopyButton } from "../../components/Form/CopyButton";
import { LinkWithTooltip } from "../../components/LinkWithTooltip";
import { redirect_base } from "../../components/CONSTANTS";

export const QRCodePreview = ({ state, shortLink, editExisted }) => {
  useEffect(() => {
    console.log("shortLink", shortLink);
  }, [shortLink]);

  return (
    <>
      <div className="preview-info_qrlink">
        {/*<p className="date-info">24.03.2022 11:38</p>*/}
        {false && state.site && (
          <div className="preview-line">
            <b>Площадка:</b>
            <div
              className="logo_short_1"
              rel={state.site + (state.token || state.short_id)}
            >
              <i></i>
            </div>
          </div>
        )}
        {(state.token || state.short_id) && (
          <div className="preview-line">
            <div className="preview-line_label">
              <b>Короткая ссылка:</b>
            </div>
            {/*
                  <span className="text_short">
                  <a href={state.site + (state.token||state.short_id)} target="_blank" rel="noopener noreferrer">
                    {state.site + (state.token||state.short_id)}
                  </a>
                  </span>*/}
            <div className="preview-line_info">
              {/*<OverlayTrigger
                          key="bottom-golinkshort"
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-bottom-golinkshort">
                              Открыть короткую ссылку
                            </Tooltip>
                          }
                        >
                        <Button variant="secondary">
                          <FaExternalLinkAlt />
                        </Button>
                      </OverlayTrigger>*/}
              <LinkWithTooltip
                _key="bottom-golinkshort"
                placement="bottom"
                linkClassName="btn btn-secondary"
                href={shortLink} //{redirect_base ? state.site + state.token : redirect_base + state.token}
                tipText="Открыть короткую ссылку"
              >
                <FaExternalLinkAlt />
              </LinkWithTooltip>
              &nbsp; &nbsp;
              {/*<OverlayTrigger
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
                      </OverlayTrigger>*/}
              <CopyButton stringToCopy={state.site + state.token} />
            </div>
          </div>
        )}
        {state.redirect_url && (
          <div className="preview-line">
            <div className="preview-line_label">
              <b>Ссылка на материал:</b>
            </div>
            {/*<br/> <a href={state.redirect_url} target="_blank" rel="noopener noreferrer" className="text_short">{state.redirect_url}</a>*/}
            <div className="preview-line_info">
              <OverlayTrigger
                key="bottom-golinkmaterial"
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-bottom-golinkmaterial">
                    Открыть ссылку на материал
                  </Tooltip>
                }
              >
                <Button variant="secondary">
                  <FaExternalLinkAlt />
                </Button>
              </OverlayTrigger>
              &nbsp; &nbsp;
              <OverlayTrigger
                key="bottom-copymaterial"
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-bottom-copymaterial">
                    Скопировать ссылку на материал
                  </Tooltip>
                }
              >
                <Button variant="secondary">
                  <FaCopy />
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        )}

        {(state.token || state.short_id) && (
          <div className="preview-line">
            <div className="preview-line_label">
              <b>QR-код:</b>
            </div>
            {/*<a href={"https://chart.googleapis.com/chart?cht=qr&chs=500x500&choe=UTF-8&chld=Q%7C1&chl=" + state.site + state.token} target="_blank" rel="nofollow noopener" className="btn btn-success btn-underlinefix">
                        <FaExternalLinkAlt />
                      </a> */}
            <div className="preview-line_info">
              <OverlayTrigger
                key="bottom-golinkqr"
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-bottom-golinkqr">Открыть QR-код</Tooltip>
                }
              >
                <Button variant="secondary">
                  <FaQrcode />
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        )}

        {/* editExisted &&
              <div className="qr_imgbox">
                <p>
                  <OverlayTrigger
                  key="left"
                  placement="left"
                  overlay={
                    <Tooltip id="tooltip-left-qr-link">
                      Кликните на картинку чтобы получить ссылку на qr-код
                    </Tooltip>
                  }
                >
                    
                    <a href={"https://chart.googleapis.com/chart?cht=qr&chs=500x500&choe=UTF-8&chld=Q%7C1&chl=" + state.site + state.token} target="_blank" rel="nofollow noopener">
                      <img
                        src={"https://chart.googleapis.com/chart?cht=qr&chs=500x500&choe=UTF-8&chld=Q%7C1&chl=" + state.site + state.token}
                        className="img-fluid"
                      />
                    </a>
                  </OverlayTrigger>
                </p>
              </div>
              */}
      </div>
      {/**/}
    </>
  );
};
