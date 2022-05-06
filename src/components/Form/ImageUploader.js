import React, { useState, useReducer, useRef } from "react";
import Resizer from "react-image-file-resizer";
import "react-app-polyfill/stable"; //for await, can be used with IE11
//import {reducer} from "../../components/reducer";
//import {INITIAL_STATE} from "../../components/CONSTANTS"
import { useAlert } from "react-alert";
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
import { BiImageAdd } from "react-icons/bi";
import { ButtonWithTooltip } from "../../components/ButtonWithTooltip";

export default function ImageUploader({
  name = "myFile",
  className = "",
  state,
  dispatch
}) {
  //
  const uploadBase64ApiUrl = "https://sp.imweb.ru/api/canvas/upload.php";
  //const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [uplImage, setUplImage] = useState(null);
  const [resizedImg, setResizedImg] = useState(null);
  const alert = useAlert();
  const inputFileRef = useRef(null);

  const onChange = async (event) => {
    const name = "imgtoupload";
    const file = event.target.files[0];
    const image = await resizeFile(file);
    console.log(image);
    uploadBase64(image);
  };

  /* const onChange = (event) => {
    var reader = new FileReader();

    reader.onload = (event) => {
      let url = event.target.result;
      console.log('url', url);
      //console.log('event.target.files[0])', event.target.files[0]);
      //console.log('event.target.files[0])', readAsDataURL(event.target.files[0]));
      uploadBase64(url);
      //uploadBase64(resizeFile(url));
    };

    reader.onerror = (event) => {
      console.log("File could not be read: " + event.target.error.code);
    };

    reader.readAsDataURL(event.target.files[0]);
  };*/

  const onBtnClick = (e) => {
    /*Collecting node-element and performing click*/
    console.log("CLICK-out");
    inputFileRef.current.click();
    e.preventDefault();
    //
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1200,
        1200,
        "JPEG",
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const uploadBase64 = (image) => {
    const details = {
      sp: "go",
      canvas: image
    };
    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");

    fetch(uploadBase64ApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: formBody
    })
      .then((res) => {
        //console.log("res", res);
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setUplImage({
          imgname: data.data.name,
          imgfile: data.data.file,
          imageurl: data.data.url
        });

        console.log("data", data);
        alert.success("Картинка успешно загружена");
        dispatch({
          type: "updateFieldValue",
          field: "share_img",
          value: data.data.url
        });
      })
      .catch((error) => {
        console.log("catch", error); // if wrong url in console we see: catch Error: 404      at eval (index.js:134)
      });
  };

  /*<OverlayTrigger
      key="bottom"
      placement="bottom"
      overlay={
        <Tooltip id="tooltip-bottom-shareimgbtn">
          Загрузить картинку для соц.сети, рекомендуемый размер 1200х630, формат .jpg или .png
        </Tooltip>
      }
    >
    <Button variant="warning" type="Submit" title="Загрузить картинку">
      <BiImageAdd />
    </Button>
     </OverlayTrigger>*/

  return (
    <>
      <ButtonWithTooltip
        _key="bottom_shareeee"
        placement="bottom"
        btnClassName="btn btn-outline-dark"
        onClick={(e) => onBtnClick(e)}
        tipText="Загрузить картинку, рекомендуемый размер 1200х630 (*.jpg,*.png)"
      >
        <BiImageAdd />
      </ButtonWithTooltip>

      <input
        style={{ display: "none" }}
        className="devutil"
        type="file"
        label="Image"
        ref={inputFileRef}
        //name={name}
        accept=".jpeg, .png, .jpg"
        //onChange={(e) => handleFileUpload(e)}
        onChange={(e) => onChange(e)}
      />

      {/*<img src={state.share_img} alt="" />
      
              <Button
                variant="warning"
                onClick={() => console.log("state", state)}
              >
                LOG 
              </Button>*/}
    </>
  );
}
