import React from "react";
import { Button } from "react-bootstrap";
import { useInterval } from "react-use";
import { FaSyncAlt } from "react-icons/fa";
import { useAlert } from "react-alert";

const secs = 60;

export const RefreshListButton = ({
  curDB = null,
  setDB,
  getDB,
  viewItemsLim,
  showForm,
  apiurl
}) => {
  // const [apiurl, setApiUrl] = React.useState(window.location.hostname.includes('nahab') ? "https://dev.nahab.info/go/tokens" : "../") //"https://sp.imweb.ru/go2/tokens";
  const [count, setCount] = React.useState(secs);
  const [isPaused, setPaused] = React.useState(false);
  const alert = useAlert();

  function getShortUpdatedDB(callback = null) {
    //
    console.log("apiurl", apiurl);
    try {
      //console.log('apiurl', apiurl);
      if (curDB) {
        fetch(apiurl + "?limit=" + viewItemsLim)
          .then((res) => res.json())
          //.then(setDB);
          .then((data) => {
            //console.log("data:DEV FETCH", data);
            //console.log("data:", data.implants);
            //setDB(data.response);
            if (data.error != false) {
              alert.error("Не получилось обновить список");
              return;
            }
            setCount(secs);
            setPaused(false);
            //console.log('--data.response', data.response);
            //console.log('0-resp', data.response[0].id)
            //console.log('0-cur', curDB[0].id)
            let newAr = [...curDB];
            if (data.response[0].id == curDB[0].id) {
              //newAr[0, data.response.length] = data.response;
              newAr.splice(0, data.response.length, ...data.response);
              //console.log('newAr', newAr);
              setDB(newAr);
            } else {
              getDB();
            }
            if (callback) {
              callback();
            }
          });
      }
    } catch (e) {
      alert.error("Не получилось обновить список");
      //console.log("failed to fetch");
    }
  }
  useInterval(
    () => {
      //setCount(count + 1);
      if (count == 0) {
        getShortUpdatedDB();
        setPaused(true);
      }
      setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : secs));
    },
    (!showForm || !isPaused) && curDB ? 1000 : null
  );

  function updateView() {
    getShortUpdatedDB(() => alert.success("Список обновлен"));
    setPaused(true);
  }

  return (
    <>
      <Button
        variant="outline-dark"
        className="btn_refresh"
        onClick={updateView}
      >
        <span className="timer">{count}</span>
        <span className="icon">
          <FaSyncAlt />
        </span>
      </Button>
    </>
  );
};
