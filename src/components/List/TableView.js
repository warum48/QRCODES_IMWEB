import React from "react";

import { SiBitly } from "react-icons/si";
import {
  FaEdit,
  FaShareAlt,
  FaCopy,
  FaComment,
  FaQrcode
} from "react-icons/fa";
import { BiCircle, BiCheckCircle } from "react-icons/bi";
import {
  Row,
  OverlayTrigger,
  Tooltip,
  Col,
  Button,
  Table
} from "react-bootstrap";
import { LinkWithTooltip } from "../../components/LinkWithTooltip";
import SimpleDateTime from "react-simple-timestamp-to-date";
import { ButtonWithTooltip } from "../../components/ButtonWithTooltip";
import { BitlyPreviewButton } from "../../components/List/BitlyPreviewButton";

export const TableView = ({
  dB,
  searchAndSlice,
  getDesc,
  showShare,
  editToken,
  duplicateToken,
  redirect_base
}) => {
  return (
    <Row className=" text-start">
      {/*<Button className="btn_refresh" variant="warning" onClick={()=>getDB(()=>alert.success('Список обновлен'))}><span className="timer">30</span><span className="icon"><FaSyncAlt/></span></Button>*/}
      {/* <RefreshListButton curDB={dB} setDB={setDB} getDB={getDB} viewItemsLim={viewItemsLim} isRunning={showForm}/> */}

      <Col>
        <Table className="magictable">
          <thead>
            <tr>
              <th className="tb_date_info">ID</th>
              <th className="tb_date_info">Дата создания</th>
              <th className="tb_shows">Клики</th>
              <th className="tb_site">Площадка</th>
              <th className="tb_qr_link">Короткая ссылка</th>
              <th className="tb_full_link">Ссылка на статью</th>
              <th className="tb_share">
                <OverlayTrigger
                  key="bottom-table-head-ref"
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-table-head-ref">
                      Очистка REFERER при переадресации
                    </Tooltip>
                  }
                >
                  <span>Referer</span>
                </OverlayTrigger>
              </th>
            </tr>
          </thead>

          <tbody>
            {searchAndSlice(dB).map((card, index) => (
              <tr key={"s" + index}>
                <td className="tb_ids text-center">
                  {card.id} &nbsp;
                  {getDesc(card) && (
                    <OverlayTrigger
                      key="right_1"
                      placement="right"
                      overlay={
                        <Tooltip id="tooltip-right-comment">
                          {getDesc(card)}
                        </Tooltip>
                      }
                    >
                      <span>
                        <FaComment /> {/*<FaInfoCircle />*/}
                      </span>
                    </OverlayTrigger>
                  )}
                </td>
                <td className="tb_date_info text-center">
                  <SimpleDateTime dateSeparator="/" timeSeparator=":">
                    {card.time_stamp}
                  </SimpleDateTime>
                </td>
                <td className="tb_shows text-center">
                  {card.redirect_counter}
                </td>
                <td className="tb_site">
                  <div className="logo_short_1 intable" rel={card.site}>
                    <i></i>
                  </div>
                </td>
                <td className="tb_qr_link">
                  <div className="dotsbox">
                    <a
                      href={
                        !redirect_base
                          ? card.site + card.token
                          : redirect_base + card.token
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.token}
                    </a>
                  </div>
                </td>
                <td className="tb_full_link">
                  <div className="dotsbox">
                    <a
                      href={card.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.redirect_url}
                    </a>
                  </div>
                </td>
                <td className="tb_share">
                  {card.use_share == "1" ? <BiCheckCircle /> : <BiCircle />}
                </td>
                <td className="btn_table_box">
                  {(card.share_img || card.share_title || card.share_desc) && (
                    <ButtonWithTooltip
                      _key=""
                      placement="top"
                      btnClassName="btn btn-outline-dark"
                      onClick={() => showShare(card)}
                      tipText="Превью шера"
                    >
                      <FaShareAlt />
                    </ButtonWithTooltip>
                  )}

                  {/*
                  <BitlyPreviewButton btnClassName="btn btn-outline-dark" redirect_url={card.redirect_url}/>*/}

                  <LinkWithTooltip
                    _key="left_qr"
                    placement="top"
                    linkClassName="btn btn-outline-dark"
                    href={
                      "https://chart.googleapis.com/chart?cht=qr&chs=500x500&choe=UTF-8&chld=Q%7C1&chl=" +
                      card.site +
                      card.token
                    }
                    tipText="Получить QR-код"
                  >
                    <FaQrcode />
                  </LinkWithTooltip>

                  <ButtonWithTooltip
                    _key="left_copy"
                    placement="top"
                    btnClassName="btn btn-warning"
                    onClick={() => duplicateToken(card)}
                    //onClickParam={card}
                    tipText="Дублировать"
                  >
                    <FaCopy />
                  </ButtonWithTooltip>

                  <ButtonWithTooltip
                    _key="left_edit"
                    placement="top"
                    btnClassName="btn btn-warning"
                    onClick={() => editToken(card)}
                    //onClickParam={card}
                    tipText="Редактировать"
                  >
                    <FaEdit />
                  </ButtonWithTooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};
