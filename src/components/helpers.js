export function valueToBoolean(value) {
  if (value === 1 || value === "1" || value === "true" || value === true) {
    return true;
  } else {
    return false;
  }
}
export function booleanToNum(value) {
  if (value === "true" || value === true) {
    return 1;
  } else {
    return 0;
  }
}

export function booleanToString(value) {
  if (value === "true" || value === true || value === 1 || value === "1") {
    return "1";
  } else {
    return "0";
  }
}
export function encodeInputText(text) {
  //return
  var output = encodeURIComponent(text.replaceAll("/", "_").replaceAll(" ", "_"));
  //console.log("encoutput", output);
  return output;
}