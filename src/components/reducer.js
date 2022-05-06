import { INITIAL_STATE } from "./CONSTANTS";

export const reducer = (state, action) => {
  console.log("action", action);
  switch (action.type) {
    case "updateFieldValue":
      console.log("action.field", action.field);
      console.log("action.value", action.value);
      return { ...state, [action.field]: action.value };
    case "update":
      return {
        ...state,
        ...action.editOb,
        comment: JSON.parse(action.editOb.vars).comment
      };
    case "reset":
      console.log("--RESET--");
      //return INITIAL_STATE;
      return {
        ...state,
        ...INITIAL_STATE
      };

    default:
      return INITIAL_STATE;
  }
};
