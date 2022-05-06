import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { ButtonWithTooltip } from "../../components/ButtonWithTooltip";
import { LinkWithTooltip } from "../../components/LinkWithTooltip";
import { FaQrcode, FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { useAlert } from "react-alert";
import { SiBitly } from "react-icons/si";
import { BitlyClient } from "bitly";

export const BitlyPreviewButton = ({ redirect_url, btnClassName = "btn" }) => {
  const [bitlyEditLink, setBitlyEditLink] = useState("");
  const [hasBitly, setHasBitly] = useState(false);
  const alert = useAlert();
  const bitly = new BitlyClient("117275687565fe15c98667637f49304b3f01454a", {});
  // let arry = [2, 4, 6, 8, 10, 12, 14, 16];
  // let lastElement = arry.slice(-1);

  useEffect(() => {
    //console.log('has bitly', redirect_url.includes('bit.ly'));
    // try{
    if (redirect_url.includes("bit.ly")) {
      setHasBitly(true);
      let tempstr = redirect_url;
      var last = tempstr.charAt(tempstr.length - 1);
      if (last == "/") {
        tempstr.substr(0, tempstr.length - 1);
      }
      let bitAr = tempstr.split("/");
      var bitId_ = bitAr[bitAr.length - 1];
      //console.log('bitId', bitId_);
      setBitlyEditLink("https://app.bitly.com/Bj7nfYXRsRp/bitlinks/" + bitId_);
    }
    // }catch(e){

    // }
    //console.log('bit', bitly);
    //const result = await bitly.shorten(link.current);

    //const bitly = new BitlyClient('<accessToken>');

    /*try {
  return await bitly.bitlyRequest('link/referrers_by_domain', {
    link: 'https://github.com/tanepiper/node-bitly',
    unit: 'hour',
    timezone: 'Europe/Amsterdam'
  });
} catch(e) {
  throw e;
}*/

    /* try{
           fetch('https://api-ssl.bitly.com/v4/bitlinks/bit.ly/' + bitId_ + '/clicks?unit=month&units=5&unit_reference=2006-01-02T15%3A04%3A05-0700')
           .then((res) => res.json())
      .then((data) => {
        //setOuterDB(data);
        console.log('data', data);
      });
       }catch(e){
           
       }*/
  }, []);

  const getBitStat = async (e) => {
    try {
      return await bitly.bitlyRequest("link/referrers_by_domain", {
        //'link/referrers_by_domain', {
        // link: 'https://github.com/tanepiper/node-bitly',
        // unit: 'hour',
        // timezone: 'Europe/Amsterdam'
      });
    } catch (e) {
      throw e;
    }
  };

  return (
    <>
      {hasBitly ? (
        <LinkWithTooltip
          _key="bottom-copyshort"
          placement="top"
          linkClassName={btnClassName}
          href={bitlyEditLink}
          tipText="Статистика bit.ly"
        >
          <SiBitly />
        </LinkWithTooltip>
      ) : null}
    </>
  );
};

/*

 <ButtonWithTooltip 
                      _key="bottom-copyshort"
                      placement="bottom"
                      btnClassName="btn btn-secondary"
                      onClick={copyString} 
                      //onClickParam={card}
                      tipText={toolTipContent}>
                        <FaCopy />
                  </ButtonWithTooltip>



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
