import React, { useReducer, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  FaMagic,
  FaTable,
  FaTh,
  FaEdit,
  FaClipboardList,
  FaInfoCircle,
  FaShareAlt,
  FaSearch,
  FaPlusSquare,
  FaCopy,
  FaComment,
  FaQrcode,
  FaSyncAlt,
  FaShareAltSquare,
  FaQuestion
} from "react-icons/fa";
import {
  BiImageAdd,
  BiX,
  BiCircle,
  BiCheckCircle,
  BiListPlus
} from "react-icons/bi";
import {
  Container,
  Row,
  FormControl,
  InputGroup,
  Modal,
  OverlayTrigger,
  Tooltip,
  Col,
  Button,
  Table
} from "react-bootstrap";
import "./styles.css";
import LazyLoad from "react-lazyload";
import { positions, Provider } from "react-alert";
import { useAlert } from "react-alert";
import AlertTemplate from "react-alert-template-oldschool-dark"; //"react-alert-template-basic";
import SimpleDateTime from "react-simple-timestamp-to-date";
import { useSearchParam } from "react-use";

import { INITIAL_STATE } from "./components/CONSTANTS";
import { redirect_base } from "./components/CONSTANTS";
import { reducer } from "./components/reducer";

import { ButtonWithTooltip } from "./components/ButtonWithTooltip";
import { LinkWithTooltip } from "./components/LinkWithTooltip";
import Forma from "./components/Form/Forma";

import { MoreButton } from "./components/List/MoreButton";
import { RefreshListButton } from "./components/List/RefreshListButton";
import { CopyView } from "./components/List/CopyView";
import { CardView } from "./components/List/CardView";
import { TableView } from "./components/List/TableView";
import { ShareView } from "./components/List/ShareView";

import { CRUDContext } from "./components/Form/CRUDContext";
import { CRUDProvider } from "./components/Form/CRUDContext";

export default function Page() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [dB, setDB] = useState(null);
  const [editExisted, setEditExisted] = useState(false);
  const [curObPreview, setCurObPreview] = useState(INITIAL_STATE);
  const [curEditTokenOb, setCurEditTokenOb] = useState(null);
  const [showForm, setShowForm] = useState(false);
  //const [isTableView, setTableView] = useState(true);
  const [viewItemsLim, setViewItemsLim] = useState(25);
  const viewItemsLim_beforeFilter = useRef(25);
  const [filterLim, setFilterLim] = useState(0); //needed for debug, can be removed
  const [filterStr, setFilterStr] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [listView, setListView] = useState("table"); // table //cells //copy
  const searchTF = useRef(null);
  const [show, setShow] = useState(false);
  //const [fullscreen, setFullscreen] = useState(true);
  const [numOfItemsMatchingFilter, setNumOfItemsMatchingFilter] = useState(-1);
  //const [numOfItemsMatchingFilterSliced, setNumOfItemsMatchingFilterSliced] = useState(-1);
  const [formType, setFormType] = useState("basic"); //
  const [dBLoaded, setDBLoaded] = useState(false);

  const alert = useAlert();

  const edit = useSearchParam("edit");

  useEffect(() => {
    getDB();
  }, []);

  useEffect(() => {
    //getDB();
    //test-url-with-share-full
    //editToken(dB)
    if (dB && !dBLoaded) {
      setDBLoaded(true);
    }
  }, [dB]);

  useEffect(() => {
    if (dB && edit) {
      //editToken(dB.find(x => x.token === 'test-url-with-share-full'));
      //editToken(dB.find(x => x.id === 'edit'));
      editToken(dB.find((x) => x.token === edit));
    }
  }, [dBLoaded, edit]);

  /*useEffect(()=>{
    if(showForm == false){
      history.pushState({}, '', location.pathname)
    }
  }, [showForm])*/

  useEffect(() => {
    //console.log('filterStr',filterStr);
    if (filterStr || listView == "share") {
      // != ""
      setIsFiltering(true);
      setNumOfItemsMatchingFilter(
        dB
          ?.filter((item) => filterSearch(item))
          .filter((item) =>
            listView == "share"
              ? // item.share_img !="" : true
                item.share_img != "" ||
                item.share_desc != "" ||
                item.share_title != ""
              : true
          ).length
      );

      if (dB) {
        console.log(
          "LLlllleng",
          dB
            .filter((item) => filterSearch(item))
            .filter((item) =>
              listView == "share" ? item.share_img != "" : true
            ).length
        );
      }
    } else {
      setIsFiltering(false);
      setNumOfItemsMatchingFilter(-1);
    }
  }, [filterStr, viewItemsLim, listView]);

  useEffect(() => {
    setViewItemsLim(25);
  }, [filterStr]);

  var apiurl = "";

  function getDB(callback = null) {
    try {
      //fetch(apiurl)
      fetch("db.json")
        .then((res) => res.json())
        //.then(setDB);
        .then((data) => {
          //console.log("data:DEV FETCH", data);
          //console.log("data:", data.implants);
          if (data.error != false) {
            alert.error("Не получилось получить список");
            return;
          }
          setDB(data.response);
          if (callback) {
            callback();
          }
        });
    } catch (e) {
      alert.error("Не получилось получить список");
      console.log("failed to fetch");
    }
  }

  function addTokens(type) {
    setCurEditTokenOb(null);
    setShowForm(true);
    setEditExisted(false);
    dispatch({ type: "reset" });
    setFormType(type);
  }

  function editToken(tokobj) {
    console.log("tokobj", tokobj);
    setCurEditTokenOb(tokobj);
    setEditExisted(true);
    setFormType("basic");
    setShowForm(true);
    //history.pushState({}, '', location.pathname + '?edit='+tokobj.token)
  }

  function duplicateToken(tokobj) {
    setCurEditTokenOb({ ...tokobj }); //, ...{ short_id: '', token: '' }
    setEditExisted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFormType("basic");
    setShowForm(true);
    alert.show("Запись скопирована, укажите уникальную короткую ссылку");
  }

  function showShare(ob) {
    setCurObPreview(ob);
    setShow(true);
  }

  /*const filterSearchShare = () => {
    console.log(dB.filter(item => item.use_share=="1"))
    //return true;
    //people.filter(person => person.age < 60)
  }*/

  /*const runSearch = () => {
    //!!!setFilterLim(10000);
    setIsFiltering(true)
  }*/

  const filterSearch = (item) => {
    if (isFiltering) {
      if (searchTF.current.value.length < 2) {
        //return false;
        return true;
      }
      for (let key in item) {
        if (item[key]?.indexOf(searchTF.current.value) != -1) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  };

  const searchAndSlice = (items) => {
    if (items) {
      return items
        .filter((item) => filterSearch(item))
        .filter((item) =>
          listView == "share"
            ? item.share_img != "" ||
              item.share_desc != "" ||
              item.share_title != ""
            : true
        )
        .slice(0, filterLim || viewItemsLim);
    } else {
      return [];
    }
  };

  const getDesc = (card) => {
    //console.log('getDesc', card);
    if (card.vars != "") {
      return JSON.parse(card.vars).comment != ""
        ? JSON.parse(card.vars).comment
        : "";
    } else {
      return "";
    }
  };

  return (
    <div className="App " id="site_wrap">
      <LinkWithTooltip
        _key="top-faq"
        placement="top"
        linkClassName="bnt_faq"
        // href="https://disk.yandex.ru/i/BGUtzEJk-Ia5dQ" - с доп кликом и возможностью скачать
        href="https://docs.yandex.ru/docs/view?url=ya-disk-public%3A%2F%2FcCLHcsfVXKQKP6NmFNAX2a5tfBtF7EBLo%2FbeOvoTA%2FdWXvYJ%2Bz5gb9%2F%2Fu5pFTxdwq%2FJ6bpmRyOJonT3VoXnDag%3D%3D&name=Shorts.docx&nosw=1"
        tipText="FAQ"
      >
        <FaQuestion />
      </LinkWithTooltip>
      {/*<a href="https://disk.yandex.ru/i/BGUtzEJk-Ia5dQ" target="_blank" rel="noopener noreferrer" className="bnt_faq"><FaQuestion /></a>*/}
      <Container fluid id="top">
        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="modal-90w modal-dialog-centered share_modal"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/*curObPreview.share_img &&
             <div className="shareimg">
               <img
                 className="img-fluid "
                 src={curObPreview.share_img}
               />
             </div>*/}
            <div className="shareimg_modalhead">
              <img
                src="https://dev.nahab.info/dev-qrcodes/assets/img/noimage.png"
                className="img-fluid placeholder"
              />
              <div
                className="share_img"
                style={{
                  background:
                    'url("' + curObPreview.share_img + '") 50% 50% no-repeat',
                  backgroundSize: "cover"
                }}
              ></div>
            </div>

            <div className="wrap">
              <h4>{curObPreview.share_title}</h4>
              <p>{curObPreview.share_desc}</p>
              <a
                className="share_shortlink"
                target="_blank"
                rel="noopener noreferrer"
                href={
                  curObPreview.site +
                  (curObPreview.token || curObPreview.short_id)
                }
              >
                {curObPreview.site +
                  (curObPreview.token || curObPreview.short_id)}
              </a>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={showForm}
          // fullscreen={true}
          onHide={() => setShowForm(false)}
          dialogClassName="modal-90w modal-dialog-centered modal-dialog-centered-custom"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Body>
            <Button
              className="btn_close"
              variant="danger"
              onClick={() => setShowForm(false)}
            >
              <BiX />
            </Button>
            <Container fluid>
              <CRUDProvider>
                <Forma
                  dB={dB}
                  duplicateToken={duplicateToken}
                  setEditExisted={setEditExisted}
                  editExisted={editExisted}
                  getDB={getDB}
                  curEditTokenOb={curEditTokenOb}
                  setShowForm={setShowForm}
                  type={formType}
                />
              </CRUDProvider>
            </Container>
          </Modal.Body>
        </Modal>

        <div className="topfixed">
          <Row>
            <Col>
              <div className="relbox">
                <div className="addbox">
                  <ButtonWithTooltip
                    _key="bottom-new-card_1"
                    placement="bottom"
                    btnClassName="btn btn-warning"
                    onClick={(e) => {
                      addTokens("basic");
                      e.preventDefault();
                    }}
                    //onClickParam={'basic'}
                    tipText="Добавить новую запись"
                  >
                    <FaPlusSquare />
                  </ButtonWithTooltip>
                  &nbsp;
                  <ButtonWithTooltip
                    _key="bottom-new-card_2"
                    placement="bottom"
                    btnClassName="btn btn-warning"
                    onClick={() => addTokens("multi")}
                    //onClickParam={'multi'}
                    tipText="Добавить списком"
                  >
                    <BiListPlus />
                  </ButtonWithTooltip>
                  &nbsp;
                  {/*<RefreshListButton
                    curDB={dB}
                    setDB={setDB}
                    getDB={getDB}
                    viewItemsLim={viewItemsLim}
                    showForm={showForm}
                    apiurl={apiurl}
                  />*/}
                </div>
                <div className="seekbox">
                  <InputGroup>
                    <FormControl
                      ref={searchTF}
                      placeholder="Поиск"
                      aria-label="Поиск"
                      aria-describedby="basic-addon2"
                      value={filterStr}
                      onChange={(event) => setFilterStr(event.target.value)}
                    />
                  </InputGroup>
                </div>

                <div className="visualbox">
                  <div className="d-flex justify-content-end">
                    <ButtonWithTooltip
                      _key="bottom_showtable"
                      placement="bottom"
                      btnClassName={`btn btn-outline-dark btn-outline-gray ${
                        listView == "table" ? "active" : ""
                      }`}
                      onClick={() => setListView("table")}
                      //onClickParam={"table"}
                      tipText="Таблица"
                    >
                      <FaTable />
                    </ButtonWithTooltip>
                    &nbsp;
                    <ButtonWithTooltip
                      _key="bottom_showblocks"
                      placement="bottom"
                      btnClassName={`btn btn-outline-dark btn-outline-gray ${
                        listView == "cells" ? "active" : ""
                      }`}
                      onClick={() => setListView("cells")}
                      //onClickParam={"cells"}
                      tipText="Блоки"
                    >
                      <FaTh />
                    </ButtonWithTooltip>
                    &nbsp;
                    <ButtonWithTooltip
                      _key="bottom_showcopy"
                      placement="bottom"
                      btnClassName={`btn btn-outline-dark btn-outline-gray ${
                        listView == "share" ? "active" : ""
                      }`}
                      onClick={() => setListView("share")}
                      //onClickParam={"copy"}
                      tipText="Шеры"
                    >
                      <FaShareAltSquare />
                    </ButtonWithTooltip>
                    &nbsp;
                    <ButtonWithTooltip
                      _key="bottom_showcopy"
                      placement="bottom"
                      btnClassName={`btn btn-outline-dark btn-outline-gray ${
                        listView == "copy" ? "active" : ""
                      }`}
                      onClick={() => setListView("copy")}
                      //onClickParam={"copy"}
                      tipText="Список"
                    >
                      <FaClipboardList />
                    </ButtonWithTooltip>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        {listView == "copy" && (
          <CopyView dB={dB} searchAndSlice={searchAndSlice} getDesc={getDesc} />
        )}

        {listView == "table" && (
          <TableView
            dB={dB}
            searchAndSlice={searchAndSlice}
            getDesc={getDesc}
            showShare={showShare}
            editToken={editToken}
            duplicateToken={duplicateToken}
            redirect_base={redirect_base}
          />
        )}

        {listView == "cells" && (
          <CardView
            dB={dB}
            searchAndSlice={searchAndSlice}
            getDesc={getDesc}
            showShare={showShare}
            editToken={editToken}
            redirect_base={redirect_base}
          />
        )}

        {listView == "share" && (
          <ShareView
            dB={dB}
            searchAndSlice={searchAndSlice}
            getDesc={getDesc}
            showShare={showShare}
            editToken={editToken}
          />
        )}

        <Row className="justify-content-center">
          <Col md="auto">
            <MoreButton
              dB={dB}
              viewItemsLim={viewItemsLim}
              setViewItemsLim={setViewItemsLim}
              outOf={
                !filterStr && listView != "share"
                  ? dB?.length
                  : numOfItemsMatchingFilter
              }
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const options = {
  offset: "5px",
  position: "bottom center",
  timeout: 5000,
  transition: "scale",
  containerStyle: {
    zIndex: 2100
  }
};

ReactDOM.render(
  <Provider template={AlertTemplate} {...options}>
    <Page />
  </Provider>,
  document.getElementById("root")
);

//https://gist.github.com/barhoring/064cc270e0eec0b3c35de0efa3329b11
//https://shanelonergan.github.io/react-use-reducer/
