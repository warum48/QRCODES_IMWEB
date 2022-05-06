import React, { createContext, useState } from "react";
import { useAlert } from "react-alert";
import { apiurl } from "../../components/CONSTANTS";
//

export const CRUDContext = createContext();

export const CRUDProvider = ({ children }) => {
  /*const [state, setState] = useState({})*/
  const alert = useAlert();
  const CRUDService_ = {
    addToken_byType: function (
      obj,
      callback = null,
      type = "regular",
      success_callback = null
    ) {
      fetch(apiurl + (type == "update" ? "/" + obj.token : ""), {
        //fetch("https://61445c6b411c860017d25403.mockapi.io/tokens", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: type == "update" ? "PUT" : "POST",
        body: JSON.stringify(obj)
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("ADD TOKEN RESP", data);
          if (callback) {
            callback(); //refresh
          } //used for google

          if (type == "regular" || type == "update") {
            if (!data.error) {
              if (success_callback) {
                success_callback();
              }
            } else {
              alert.error("Ошибка записи"); // + data.error
              console.log("ERROR token upload", obj.token);
            }
          }

          if (type == "upload_table" && data.error) {
            alert.error("Ошибка записи токена в таблице");
          }
        })
        .catch((err) => {
          alert.error("Ошибка записи"); // + data.error
          console.log("ERRRORRR upload", err, obj.token);
        });
      //event.preventDefault();
    },

    deleteToken: function (token, state, callback = null, alert) {
      if (token == state.token) {
        fetch(apiurl + "/" + token, {
          headers: { "Content-Type": "application/json; charset=utf-8" },
          method: "DELETE"
        }) //("db.json")
          .then((res) => res.json())
          .then((data) => {
            console.log("data", data);
            console.log("data.error", data.error);
            if (data.error == false) {
              alert.success("Токен " + state.token + " удален");
              /*getDB(); //refresh
              setShowForm(false);*/
              if (callback) {
                callback();
              }
            }
          })
          .catch((err) => {
            alert.error("Ошибка " + err);
            console.log("ERRRORRR", err);
          });
      } else {
        alert.error("Токен введен не верно");
      }
    }
  };

  const value = {
    //state,
    //setState,
    CRUDService_
  };

  return <CRUDContext.Provider value={value}>{children}</CRUDContext.Provider>;
};
