/*require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');*/

import React, { useState, useEffect, useReducer, useRef } from "react";
import {
  Button,
  Col,
  Row,
  Container,
  Form,
  FloatingLabel,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { FaMagic } from "react-icons/fa";
import shortid from "shortid";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/javascript/javascript.js";
import { Controlled } from "react-codemirror2";
import { UnControlled } from "react-codemirror2";
import validator from "validator";
import { useAlert } from "react-alert";
import { reducer } from "../../components/reducer";
import { INITIAL_STATE } from "../../components/CONSTANTS";
import { booleanToString } from "../../components/helpers";

export const MultiForma = ({
  mainDB,
  uploadToServer,
  encodeInputText,
  state,
  dispatch
}) => {
  const [count, setCount] = useState(0);
  //const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const [valueArea1, setValueArea1] = useState("");
  const [valueArea2, setValueArea2] = useState("");
  const [mask, setMask] = useState("");
  const [lineCount, setLineCount] = useState(1);
  const [editor1, setEditor1] = useState(null);
  const [editor2, setEditor2] = useState(null);
  const alert = useAlert();
  const marks = useRef([]);

  const [validIDs, setValidIDs] = useState([]);
  const [validLinks, setValidLinks] = useState([]);
  const [preview, setPreview] = useState(false);
  //const [dB, setdB] = useState([]);

  useEffect(() => {
    setCount((count) => count + 1);
    setMask(shortid.generate());
  }, []);

  useEffect(() => {
    // if(mask){
    //   let text = "";
    //   for(let i=0; i<lineCount; i++){
    //     let eol = i+1 < lineCount ? '\n' : '';
    //     text += (mask+"-"+(i+1) + eol)
    //   }
    //   setValueArea2(text);
    // }
  }, [lineCount, mask]);

  function fillTokens() {
    let text = "";
    for (let i = 0; i < lineCount; i++) {
      let eol = i + 1 < lineCount ? "\n" : "";
      text += mask + "-" + (i + 1) + eol;
    }
    setValueArea2(text);
  }

  function clearMarks() {
    //forEach( histMarks, i.clear() );
    for (let i = 0; i < marks.length; i++) {
      console.log("CLEARED");
      marks.current[i].clear();
    }
    //document.getElementsByClassName("codemirror-highlighted");
    /*var elems = document.querySelectorAll(".codemirror-highlighted");

    [].forEach.call(elems, function(el) {
        el.classList.remove("codemirror-highlighted");
    });*/
    let elements = document.getElementsByClassName("codemirror-highlighted");
    while (elements.length > 0) {
      console.log("el", elements);
      elements[0].classList.remove("codemirror-highlighted");
    }
  }

  const highlightLines = (editor, start, end) => {
    const from = { line: start, ch: 0 };
    const to = { line: end, ch: 1000 }; //MAX_LINE_LENGTH
    let marka = editor.markText(from, to, {
      className: "codemirror-highlighted"
    });
    marks.current.push(marka);
  };

  function checkAndHighlight(links, short_ids, confLinks, linkHaveErrors) {
    for (var i = 0; i < links.length; i++) {
      if (!validator.isURL(links[i])) {
        console.log("links[i]", links[i]);
        highlightLines(editor1, i, i);
        linkHaveErrors = true;
      } else {
        confLinks.push(links[i]);
      }
    }
  }

  function uploadData() {
    let linkHaveErrors = false;
    let tokenExists = false;
    let _dB = [];
    let links = editor1.getValue(",").split(",");
    let short_ids = editor2.getValue(",").split(",");
    console.log("short_ids", short_ids.length);

    var confLinks = [];
    for (var i = 0; i < links.length; i++) {
      if (!validator.isURL(links[i])) {
        console.log("links[i]", links[i]);
        highlightLines(editor1, i, i);
        linkHaveErrors = true;
      } else {
        confLinks.push(links[i]);
      }
    }

    if (linkHaveErrors) {
      alert.error("Ссылки содержат неверные или пустые значения");
      return;
    }
    if (links.length == 0 || links[0].length == 0) {
      alert.error("Ссылки не заполнены");
      return;
    }
    if (short_ids.length == 0 || short_ids[0].length == 0) {
      alert.error("Короткие ссылки не заполнены");
      return;
    }
    if (short_ids.length != links.length) {
      alert.error("Кол-во ссылок не соответствует кол-ву коротких ссылок");
      return;
    }

    for (var i = 0; i < short_ids.length; i++) {
      /*if( !validator.isURL(short_ids[i])){
        console.log('links[i]', short_ids[i]);
        highlightLines(editor2, i, i);
        tokenExists = true;
      }*/
      console.log("dB", mainDB);
      console.log("short_ids[i]", short_ids[i]);
      console.log(
        "encodeInputText(short_ids[i])",
        encodeInputText(short_ids[i])
      );
      if (
        mainDB.find((x) => x.token === encodeInputText(short_ids[i])) ||
        short_ids[i].length == 0
      ) {
        highlightLines(editor2, i, i);
        tokenExists = true;
        console.log("found");
      } else {
        console.log("unfound", short_ids[i]);
      }
    }
    if (tokenExists) {
      alert.error("Короткие ссылки уже существует или не заполнен");
      return;
    }

    if (links.length !== new Set(short_ids).size) {
      alert.error("Короткие ссылки содержат повторяющиеся значения");
      return;
    }

    let confIDs = [];
    for (var i = 0; i < short_ids.length; i++) {
      confIDs.push(encodeInputText(short_ids[i]));
    }

    setValidIDs(confIDs);
    setValidLinks(confLinks);
    //setDB(dB)
    setPreview(true);

    /*{
     "redirect_url": "",
     "site": "https://sp.cosmo.ru/go/",
     "short_id": "",
     "token": "",
     "qrcode_url": "",
     "description": ""
   },*/
    console.log("ed1-len", editor1.getValue(",").split(",").length);
    //let objs
  }

  const confirmedUpload = () => {
    let dB = [];
    for (var i = 0; i < validLinks.length; i++) {
      dB.push({
        redirect_url: validLinks[i],
        site: state.site,
        short_id: validIDs[i],
        token: validIDs[i], //encodeInputText(short_ids[i]),
        qrcode_url: "",
        description: "",
        use_share: booleanToString(state.use_share)
      });
    }

    console.log("-=multi_dB=-", dB);
    uploadToServer(dB);
  };

  return (
    <div className="form_multi">
      {!preview && (
        <>
          <Row className="mb-3 align-items-center">
            <Col xs="6">
              {/**/}
              <Form.Group controlId="exampleForm.ControlUrlSelect">
                <FloatingLabel controlId="floatingSelect" label="Площадка">
                  <Form.Select
                    //{ editExisted ? 'disabled' : ''}
                    //disabled = {editExisted ? true : false}
                    required
                    aria-label="Floating label select example"
                    value={state.site}
                    onChange={(event) =>
                      dispatch({
                        type: "updateFieldValue",
                        field: "site",
                        value: event.target.value
                      })
                    }
                  >
                    <option>https://sp.imweb.ru/go/</option>
                    <option>https://sp.cosmo.ru/go/</option>
                    <option>https://sp.goodhouse.ru/go/</option>
                    <option>https://sp.popmech.ru/go/</option>
                    <option>https://sp.esquire.ru/go/</option>
                    <option>https://sp.robb.report/go/</option>
                    <option>https://sp.bazaar.ru/go/</option>
                    <option>https://sp.graziamagazine.ru/go/</option>
                    <option>https://sp.mhealth.ru/go/</option>
                  </Form.Select>
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col xs="6">
              <div className="box_w_btn">
                <FloatingLabel controlId="ControlInputUrl" label="Маска">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Укажите маску"
                    value={mask}
                    onChange={(e) => setMask(e.target.value)}
                  />
                </FloatingLabel>

                {/*
                <input type="text" placeholder="укажите маску" value={mask} onChange={(e)=>setMask(e.target.value)}></input>*/}

                {/*
                  <button onClick={() => setCount(count+1)}>++</button>
                  <span>{lineCount}</span>
                */}

                <div className="btn_fly-right">
                  <OverlayTrigger
                    key="multi-auto-gen"
                    placement="bottom"
                    overlay={
                      <Tooltip id="multi-autogen">
                        Заполнить короткие ссылки автоматически, в формате
                        "маска-строка"
                      </Tooltip>
                    }
                  >
                    <Button
                      variant="outline-dark"
                      onClick={(e) => fillTokens()}
                    >
                      <FaMagic />
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>
            </Col>
            {/*
            <Col xs='2'>
              <OverlayTrigger
                  key="multi-auto-gen"
                  placement="bottom"
                  overlay={
                    <Tooltip id="multi-autogen">
                      Заполнить короткие ссылки в формате "маска-строка"
                    </Tooltip>
                  }
                >  
                <Button variant="warning" onClick={(e) => fillTokens()}>
                  <FaMagic />
                </Button>
              </OverlayTrigger>
              <Button  variant="warning" onClick={(e) => fillTokens()}>{`Заполнить короткие ссылки в формате "маска-строка"`}</Button>
            </Col>
            */}
          </Row>

          <Row className="mb-3">
            <Col xs={6}>
              <p>Ссылки</p>
              <div className="d-block">
                <Controlled
                  key={"tf1" + count}
                  value={valueArea1}
                  options={{
                    lineNumbers: true,
                    viewportMargin: Infinity
                  }}
                  onBeforeChange={(editor, data, value) => {
                    setValueArea1(value);
                  }}
                  onChange={(editor, value) => {
                    console.log("uncontrolled", { value });
                    setLineCount(editor.lineCount());
                    if (editor2.getValue().trim() == "") {
                      setValueArea2("\n".repeat(lineCount - 1));
                    }
                    //setValueArea1(value)
                  }}
                  editorDidMount={(editor) => {
                    setEditor1(editor);
                  }}
                />
              </div>
            </Col>
            <Col xs={6}>
              <p>Токены</p>
              <UnControlled
                key={"tf2" + count}
                value={valueArea2}
                options={{
                  lineNumbers: true,
                  viewportMargin: Infinity
                }}
                /*onBeforeChange={(editor, data, value) => {
                setValueArea2(value)
              }}*/
                onChange={(editor, value) => {
                  console.log("uncontrolled", { value });
                  //setValueArea1(value)
                  //highlightLines(editor2, 0, 0);
                  //removeSelection(editor2);
                  clearMarks();
                }}
                editorDidMount={(editor) => {
                  setEditor2(editor);
                }}
              />
            </Col>
          </Row>
        </>
      )}

      {preview && (
        <Row>
          {" "}
          {/*таблица для сверки*/}
          <h4>Проверьте соответствие</h4>
          <Col xs="12">
            <div className="listviewer listviewer-checkurl">
              <div className="list-elem list_ulrfull">
                {validLinks.map((card, index) => (
                  <div className="dotsbox" title={card} key={"su" + index}>
                    {card}
                  </div>
                ))}
              </div>
              <div className="list-elem list_ulrshort">
                {validIDs.map((card, index) => (
                  <div className="dotsbox" title={card} key={"ru" + index}>
                    {state.site + card}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      )}
      <Row className="mb-3">
        <Col>
          <Form.Group className="text-start mb-3">
            <Form.Check
              key="check"
              // key={"che"+state.use_share}
              defaultChecked={true}
              // defaultChecked={valueToBoolean(state.use_share)}
              type="switch"
              id="switch-show-share"
              label={"Очистить Referer ссылки и включить её превью в соцсетях"}
              // value={valueToBoolean(state.use_share)}
              onChange={(event) =>
                dispatch({
                  type: "updateFieldValue",
                  field: "use_share",
                  value: event.target.checked
                })
              }
            />
          </Form.Group>
        </Col>
      </Row>
      {/*<Row className="justify-content-center">*/}
      <Row className="">
        <Col xs="auto">
          {!preview && (
            <Button variant="success" onClick={uploadData}>
              Проверить
            </Button>
          )}
          {preview && (
            <>
              <Button variant="success" onClick={confirmedUpload}>
                Сохранить
              </Button>
              &nbsp;&nbsp;
              <Button variant="warning" onClick={() => setPreview(false)}>
                Редактировать
              </Button>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};
