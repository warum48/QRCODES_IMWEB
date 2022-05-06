import React, {
  useReducer,
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo
} from "react";
import ReactDOM from "react-dom";
import {
  Row,
  Form,
  Col,
  FloatingLabel,
  OverlayTrigger,
  Tooltip,
  Button,
  Toast
} from "react-bootstrap";
import shortid from "shortid";
import validator from "validator";
import { useAlert } from "react-alert";
import throttle from "lodash.throttle";

import Collapse from "../../components/Form/Collapse";
import { sites } from "../../components/CONSTANTS";
import { reducer } from "../../components/reducer";
import { INITIAL_STATE } from "../../components/CONSTANTS";
import { redirect_base } from "../../components/CONSTANTS";
import { MultiForma } from "../../components/Form/MultiForma";
import ImageUploader from "../../components/Form/ImageUploader";
import { QRCodePreview } from "../../components/Form/QRCodePreview";
import { SharePreview } from "../../components/Form/SharePreview";
import { Bitly } from "../../components/Form/Bitly";
import { MagicShareFiller } from "../../components/Form/MagicShareFiller";

import { valueToBoolean } from "../../components/helpers";
import { booleanToNum } from "../../components/helpers";
import { booleanToString } from "../../components/helpers";
import { encodeInputText } from "../../components/helpers";

import CRUDService from "../../components/Form/CRUDService";
import { CRUDContext } from "../../components/Form/CRUDContext";
import { CRUDProvider } from "../../components/Form/CRUDContext";
//import { throttle } from "../../components/Utils";

import { FaMagic, FaQrcode, FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { BiImageAdd, BiX, BiCheck, BiBug } from "react-icons/bi";
//import { useThrottle } from 'react-use';

import { CopyButton } from "../../components/Form/CopyButton";
import { LinkWithTooltip } from "../../components/LinkWithTooltip";

export default function Forma({
  dB = null,
  editExisted,
  getDB,
  curEditTokenOb = null,
  setShowForm,
  duplicateToken,
  type = "basic"
}) {
  //updateDB, setEditExisted,

  const apiurl = "";

  const { CRUDService_ } = useContext(CRUDContext);
  // const { value } = useContext(CRUDContext);
  //console.log('CRUDService', CRUDService_);

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [outerDB, setOuterDB] = useState(null);
  const curTokenGoogleDBId = useRef(0);
  const [tokenExists, setTokenExists] = useState(false);
  const [checkEmptyRequiredFields, setCheckEmptyRequiredFields] = useState(
    false
  );
  const alert = useAlert();
  //window.alert = alert;
  const [debug, setDebug] = useState(false);
  const [showSharePrompt, setShowSharePrompt] = useState(false);

  useEffect(() => {
    if (curEditTokenOb != null) {
      editToken(curEditTokenOb);
    }
  }, [curEditTokenOb]);

  useEffect(() => {
    if (state.short_id) {
      checkIdExistence();
    }
    console.log("CRUDService_", CRUDService_);
  }, [state.short_id]);

  //upload google tab
  useEffect(() => {
    console.log("outerDB", outerDB);
    if (outerDB) {
      console.log(
        "outerDB[curTokenGoogleDBId.current]",
        outerDB[curTokenGoogleDBId.current]
      );
      //addToken_byType(getObjectForFetch(outerDB[curTokenGoogleDBId.current], "upload_table"), addTokenImportCallback, "upload_table")
      CRUDService.addToken_byType(
        getObjectForFetch(outerDB[curTokenGoogleDBId.current], "upload_table"),
        addTokenImportCallback,
        "update_table",
        null,
        alert
      );
    }
  }, [outerDB]);

  /*const computeLetterCount = (word) => {
    let i = 0;
    while (i < 1000000000) i++;
    return word.length;
  };
  // Memoize computeLetterCount so it uses cached return value if input array ...
  // ... values are the same as last time the function was run.
  //const letterCount = useMemo(() => computeLetterCount(word), [word]);*/

  const computedShortLink = () => {
    var href = !redirect_base
      ? state.site + state.token
      : redirect_base + state.token;
    return href;
  };
  const shortLink = useMemo(() => computedShortLink(), [
    state.site,
    state.token
  ]);

  const updateFieldValue = (field) => (event) => {
    dispatch({ type: "updateFieldValue", field, value: event.target.value });
  };

  function checkIdExistence() {
    console.log("check");
    if (dB) {
      if (dB.find((x) => x.token === encodeInputText(state.short_id))) {
        setTokenExists(true);
        if (!editExisted) {
          //alert.error("QR-код уже существует")
        }
      } else {
        setTokenExists(false);
        dispatch({
          type: "updateFieldValue",
          field: "token",
          value: encodeInputText(state.short_id)
        });
      }
    }
  }

  function tokenOperationCallback() {
    getDB(); //refresh
    setShowForm(false);
  }

  function addSingleTokenCallback() {
    tokenOperationCallback();
    alert.success(
      <div style={{}}>
        Готово!
        <br />
        <a
          href={
            "https://chart.googleapis.com/chart?cht=qr&chs=500x500&choe=UTF-8&chld=Q%7C1&chl=" +
            state.site +
            state.token
          }
          target="_blank"
        >
          Ссылка на QR-код
        </a>
      </div>
    );
  }

  function addTokenImportCallback() {
    if (curTokenGoogleDBId.current < outerDB.length - 1) {
      //outerDB.length
      curTokenGoogleDBId.current += 1;
      //addToken_byType(getObjectForFetch(outerDB[curTokenGoogleDBId.current], "upload_table"), addTokenImportCallback, "upload_table")
      CRUDService.addToken_byType(
        getObjectForFetch(outerDB[curTokenGoogleDBId.current], "upload_table"),
        addTokenImportCallback,
        "update_table",
        null,
        alert
      );
    } else {
      alert.success("Данные добавлены");
      setShowForm(false);
      getDB(); //refresh
    }
  }

  function getObjectForFetch(obj, type) {
    var outobj = null;
    if (type == "upload_table") {
      outobj = {
        site: obj.site,
        token: encodeInputText(obj.short_id),
        redirect_url: obj.redirect_url,
        use_share: obj.use_share || "1",
        share_img: "",
        share_title: "",
        share_desc: "",
        vars: JSON.stringify({ comment: obj.description }) //в таблице поле называется description
      };
    } else if (type == "regular" || type == "update") {
      console.log("obj.share_img***", obj.share_img);
      outobj = {
        site: obj.site,
        token: obj.token || encodeInputText(obj.short_id), //"62f4bb7cd42b779245d2bc7eef12e469",
        redirect_url: obj.redirect_url,
        //redirect_counter: state.redirect_counter,
        use_share: booleanToString(obj.use_share),
        share_img: obj.share_img,
        share_title: obj.share_title,
        share_desc: obj.share_desc,
        vars: JSON.stringify({ comment: obj.comment }) //затем продолжаем с комментом
      };
    }
    return outobj;
  }

  function editToken(tokobj) {
    // is called on edit press
    console.log("tokobj", tokobj);
    dispatch({
      type: "updateFieldValue",
      field: "short_id",
      value: tokobj.token
    });

    dispatch({
      type: "update",
      editOb: tokobj
    });
  }

  function stopSubmit(event) {
    setShowSharePrompt(false);
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  function checkBeforeSubmit(event) {
    //console.log('state.redirect_url', state.redirect_url);
    if ((!state.short_id && !state.token) || !state.redirect_url) {
      setCheckEmptyRequiredFields(true);
    }
    if (tokenExists) {
      if (!editExisted) {
        alert.error("QR-код уже существует");
        stopSubmit(event);
      }
    }
    if (!validator.isURL(state.redirect_url, { require_protocol: true })) {
      alert.error("Redirect URL пуст или не является ссылкой");
      stopSubmit(event);
    }
    if (
      !validator.isURL(state.share_img, { require_protocol: true }) &&
      state.share_img != ""
    ) {
      alert.error("Ссылка на картинку share не корректна");
      stopSubmit(event);
    }
  }

  function checkShareBeforeSubmit(event) {
    // Временно отключена проверка
    //TODO: [запоминаем ответ в варсы (параметр согласовать)] + Сделать только да и нет, если нет - то сохраняем, если да - то отбой и пробуем заполнить поля (сохранять не проверив плохая идея)
    if (
      false &&
      state.use_share == "1" &&
      !state.share_img &&
      !state.share_title &&
      !state.share_desc
    ) {
      //false &&
      setShowSharePrompt(true);
    } else {
      //handleSubmit(event) ;
      handleSubmit();
    }
    event.preventDefault();
  }

  function handleSubmit() {
    console.log("CRUDService_", CRUDService_);
    console.log("CRUDService_addToken_byType", CRUDService_.addToken_byType);
    if (!editExisted) {
      //addToken_byType(getObjectForFetch(state, "regular"))
      //CRUDService_.addToken_byType(getObjectForFetch(state, "regular"), null, "regular", addSingleTokenCallback, alert);
      CRUDService_.addToken_byType(
        getObjectForFetch(state, "regular"),
        null,
        "regular",
        addSingleTokenCallback
      );
    } else {
      //addToken_byType(getObjectForFetch(state, "update"), null, "update");
      CRUDService.addToken_byType(
        getObjectForFetch(state, "update"),
        null,
        "update",
        addSingleTokenCallback,
        alert
      );
    }
    //event.preventDefault();
  }

  function generateID() {
    const id = shortid.generate();
    dispatch({ type: "updateFieldValue", field: "short_id", value: id });
  }

  function uploadGoogleDB() {
    fetch("https://dev.nahab.info/dev-qrcodes/db.json") //("db.json")
      .then((res) => res.json())
      .then((data) => {
        setOuterDB(data);
      });
  }

  function preDeleteToken() {
    const enteredToken = prompt("Введите токен для подтверждения");
    //deleteToken(enteredToken);
    CRUDService.deleteToken(enteredToken, state, tokenOperationCallback, alert);
  }

  return (
    <>
      {type == "basic" && (
        <div className="d-flex hotfix">
          <div className="flex-grow-1">
            {/*<Row>
          <Col xl="7" lg="8">*/}
            <div className="formbox">
              <Form
                onSubmit={(e) => checkShareBeforeSubmit(e)}
                //{(e) => handleSubmit(e)}
              >
                {/*<h1>{editExisted ? "Редактировать" : "Создать"}</h1>*/}
                <div className="box3col col_url_gen">
                  <div className="box3col_col-l">
                    <Form.Group controlId="exampleForm.ControlUrlSelect">
                      <FloatingLabel
                        controlId="floatingSelect"
                        label="Площадка*"
                      >
                        <Form.Select
                          //{ editExisted ? 'disabled' : ''}
                          // disabled = {editExisted ? true : false}
                          required
                          aria-label=""
                          value={state.site}
                          onChange={(event) =>
                            dispatch({
                              type: "updateFieldValue",
                              field: "site",
                              value: event.target.value
                            })
                          }
                        >
                          {sites.map((site, index) => (
                            <option key={"o" + index}>{site}</option>
                          ))}
                        </Form.Select>
                      </FloatingLabel>
                    </Form.Group>
                  </div>
                  <div className="box3col_col-c">
                    <Form.Group
                      disabled={editExisted ? true : false}
                      controlId="exampleForm.ControlIntupUrlCHPU"
                    >
                      <OverlayTrigger
                        key="right-chpu"
                        placement="right"
                        overlay={
                          <Tooltip id="tooltip-top-chpu">
                            Уникальный токен, аля text_without-all.space
                          </Tooltip>
                        }
                      >
                        <FloatingLabel
                          controlId="ControlIntupUrlCHPU"
                          label="Токен*"
                        >
                          <Form.Control
                            className={
                              (tokenExists && state.short_id && !editExisted) ||
                              (checkEmptyRequiredFields &&
                                !state.short_id &&
                                !state.token)
                                ? "error"
                                : ""
                            }
                            disabled={editExisted ? true : false}
                            required
                            type="text"
                            placeholder="Короткий идентификатор"
                            value={state.short_id}
                            onChange={updateFieldValue("short_id")}
                          />
                        </FloatingLabel>
                      </OverlayTrigger>
                    </Form.Group>
                    <div className="box3col_col-r">
                      {state.token && editExisted && (
                        <>
                          <LinkWithTooltip
                            _key="bottom-goshortlinkdebugfb"
                            placement="bottom"
                            linkClassName="btn btn-outline-dark btn-outline-gray show-on-hover"
                            href={
                              `https://developers.facebook.com/tools/debug/?q=` +
                              shortLink
                            } //{redirect_base ? state.site + state.token : redirect_base + state.token}
                            tipText="Очистить шэр короткой ссылки"
                          >
                            <BiBug />
                          </LinkWithTooltip>
                          <LinkWithTooltip
                            _key="bottom-golinkshort"
                            placement="bottom"
                            linkClassName="btn btn-outline-dark btn-outline-gray show-on-hover"
                            href={shortLink} //{redirect_base ? state.site + state.token : redirect_base + state.token}
                            tipText="Открыть ссылку"
                          >
                            <FaExternalLinkAlt />
                          </LinkWithTooltip>
                          <CopyButton
                            btnClassName="btn btn-outline-dark btn-outline-gray show-on-hover"
                            stringToCopy={state.site + state.token}
                            text={"Скопировать ссылку"}
                          />
                        </>
                      )}
                      {!state.short_id && (
                        <OverlayTrigger
                          key="right-linkgen"
                          placement="right"
                          overlay={
                            <Tooltip id="tooltip-right-linkgen">
                              Сгенерировать токен автоматически
                            </Tooltip>
                          }
                        >
                          {/* disabled = {editExisted ? true : false} */}
                          <Button variant="outline-dark" onClick={generateID}>
                            <FaMagic />
                          </Button>
                        </OverlayTrigger>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bot_w_btn bot_w_btn-right">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInputUrl"
                  >
                    <OverlayTrigger
                      key="right-linkart"
                      placement="right"
                      overlay={
                        <Tooltip id="tooltip-right-linkart">
                          Ссылка на материал, куда должен перейти пользователь
                        </Tooltip>
                      }
                    >
                      <FloatingLabel
                        controlId="ControlInputUrl"
                        label="Ссылка*"
                        className="mb-3"
                      >
                        <Form.Control
                          required
                          className={
                            checkEmptyRequiredFields &&
                            (!state.redirect_url ||
                              !validator.isURL(state.redirect_url, {
                                require_protocol: true
                              }))
                              ? "error"
                              : ""
                          }
                          type="url"
                          placeholder="Вставьте url"
                          value={state.redirect_url}
                          onChange={updateFieldValue("redirect_url")}
                        />
                      </FloatingLabel>
                    </OverlayTrigger>
                  </Form.Group>
                  <div className="btn_one_box">
                    {state.redirect_url && (
                      <>
                        <LinkWithTooltip
                          _key="bottom-golinkdebugfb"
                          placement="bottom"
                          linkClassName="btn btn-outline-dark btn-outline-gray show-on-hover"
                          href={
                            `https://developers.facebook.com/tools/debug/?q=` +
                            state.redirect_url
                          } //{redirect_base ? state.site + state.token : redirect_base + state.token}
                          tipText="Очистить шэр материала"
                        >
                          <BiBug />
                        </LinkWithTooltip>
                        {/*<OverlayTrigger
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
                        </OverlayTrigger>*/}
                        <LinkWithTooltip
                          _key="bottom-golinkmaterial"
                          placement="bottom"
                          linkClassName="btn btn-outline-dark btn-outline-gray show-on-hover"
                          href={state.redirect_url} //{redirect_base ? state.site + state.token : redirect_base + state.token}
                          tipText="Открыть ссылку"
                        >
                          <FaExternalLinkAlt />
                        </LinkWithTooltip>

                        {/*   
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
                        */}
                        <CopyButton
                          btnClassName="btn btn-outline-dark btn-outline-gray show-on-hover"
                          stringToCopy={state.redirect_url}
                          text={"Скопировать ссылку"}
                        />
                      </>
                    )}
                    {(!state.redirect_url || editExisted) && (
                      <Bitly
                        btnClassName="btn btn-outline-dark"
                        state={state}
                        dispatch={dispatch}
                      />
                    )}
                  </div>
                </div>
                <Form.Group className="text-start mb-3">
                  <OverlayTrigger
                    key="description-comment"
                    placement="right"
                    overlay={
                      <Tooltip id="description">
                        Краткое описание
                        <br />
                        (не обязятельно)
                      </Tooltip>
                    }
                  >
                    <FloatingLabel
                      controlId="floatingTextarea3"
                      label="Комментарий"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="comment"
                        style={{ height: "100px" }}
                        value={state.comment}
                        onChange={updateFieldValue("comment")}
                      />
                    </FloatingLabel>
                  </OverlayTrigger>
                </Form.Group>
                <Form.Group className="text-start mb-3">
                  <Form.Check
                    key={"che" + state.use_share}
                    //defaultChecked={true}
                    defaultChecked={valueToBoolean(state.use_share)}
                    type="switch"
                    id="switch-show-share"
                    // label={"Очистить Referer (+ добавить данные для Share)"}
                    label={
                      "Очистить Referer ссылки и включить её превью в соцсетях"
                    }
                    value={valueToBoolean(state.use_share)}
                    onChange={(event) =>
                      dispatch({
                        type: "updateFieldValue",
                        field: "use_share",
                        value: event.target.checked
                      })
                    }
                  />
                </Form.Group>
                {/*<Collapse
                  isActive={
                    state.use_share === 1 ||
                    state.use_share === "1" ||
                    state.use_share === true
                  }
                  
                >*/}
                <Form.Group className="sharebox">
                  <div className="sharebox-magicbtn">
                    <MagicShareFiller state={state} dispatch={dispatch} />
                  </div>

                  <div className="share_img_upload">
                    <OverlayTrigger
                      key="right-shareimg"
                      placement="right"
                      overlay={
                        <Tooltip id="tooltip-right-shareimg">
                          Вставьте ссылку на картинку или загрузите её
                        </Tooltip>
                      }
                    >
                      <FloatingLabel
                        controlId="ControlInputShareImg"
                        label="Картинка шера"
                        className="mb-3"
                      >
                        <Form.Control
                          type="url"
                          className={
                            checkEmptyRequiredFields &&
                            state.share_img &&
                            !validator.isURL(state.share_img, {
                              require_protocol: true
                            })
                              ? "error"
                              : ""
                          }
                          name="image"
                          placeholder="image"
                          value={state.share_img}
                          onChange={updateFieldValue("share_img")}
                        />
                      </FloatingLabel>
                    </OverlayTrigger>
                    {!state.share_img && (
                      <div className="box_upload_share">
                        <ImageUploader state={state} dispatch={dispatch} />
                      </div>
                    )}
                  </div>
                  <FloatingLabel
                    controlId="ControlInputShareTitle"
                    label="Заголовок шера"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="title"
                      value={state.share_title}
                      onChange={updateFieldValue("share_title")}
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingTextarea2"
                    label="Описание шера"
                    className="mb-3"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="description"
                      style={{ height: "100px" }}
                      value={state.share_desc}
                      onChange={updateFieldValue("share_desc")}
                    />
                  </FloatingLabel>
                </Form.Group>

                {/*
                </Collapse>
                */}
                {debug && (
                  <Button
                    variant="warning"
                    onClick={() => console.log("state", state)}
                    //{!tokenExists + ''}
                  >
                    LOG
                  </Button>
                )}

                <div className="form_btn_box">
                  <Button
                    variant="success"
                    type="submit"
                    //disabled = {(state.short_id && state.redirect_url && !tokenExists) ? false : true}
                    onClick={checkBeforeSubmit}
                  >
                    {editExisted ? "Сохранить изменения" : "Сохранить"}
                  </Button>
                  <div className="btns_right">
                    {editExisted && (
                      <>
                        <Button
                          variant="warning"
                          onClick={() => duplicateToken(curEditTokenOb)}
                        >
                          Дублировать
                        </Button>

                        <Button variant="danger" onClick={preDeleteToken}>
                          Удалить
                        </Button>

                        {state.token && (
                          <CopyButton
                            btnClassName="btn btn-outline-dark btn-outline-gray show-on-hover"
                            stringToCopy={
                              window.location.href.split("?")[0] +
                              "?edit=" +
                              state.token
                            }
                            text={
                              "Скопировать ссылку на редактирование этого токена"
                            }
                          />
                        )}
                      </>
                    )}
                    {/*<Button variant="primary" type="reset" onClick={uploadGoogleDB}>
                      Upload Google DB
                    </Button>*/}
                  </div>
                </div>
              </Form>
              {/* (editExisted || true) &&
                <QRCodePreview state={state} shortLink={shortLink} editExisted={editExisted}/>
              */}
            </div>
            {/*</Col>
          <Col xl="5" lg="4" className="text-start preview-info">*/}
          </div>
          <div className="text-start preview-info">
            {/* (editExisted || true) &&
            <FormaQRCodePreview state={state} editExisted={editExisted}/>
          */}

            {/*valueToBoolean(state.use_share) &&
            <FormaSharePreview state={state} />
          */}

            <SharePreview
              state={state}
              shortLink={shortLink}
              editExisted={editExisted}
            />

            {/*</Col>
          </Row>*/}
          </div>
        </div>
      )}

      {type == "multi" && (
        <MultiForma
          uploadToServer={setOuterDB}
          encodeInputText={encodeInputText}
          mainDB={dB}
          state={state}
          dispatch={dispatch}
        />
      )}

      {showSharePrompt && (
        <div className="popup_in">
          <div className="popup_in-content">
            <div className="popup_in-content_head">
              Заполнить Share автоматом на основании данных по ссылке?
            </div>
            <div className="popup_in-content_buttons">
              <div className="btns_left">
                <MagicShareFiller
                  state={state}
                  dispatch={dispatch}
                  callback={() => setShowSharePrompt(false)}
                  type={"Button"}
                />
                <Button variant="danger" onClick={handleSubmit}>
                  Нет
                </Button>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowSharePrompt(false)}
              >
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
