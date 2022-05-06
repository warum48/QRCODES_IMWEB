export const sites = [
  "https://sp.imweb.ru/go/",
  "https://sp.cosmo.ru/go/",
  "https://sp.goodhouse.ru/go/",
  "https://sp.popmech.ru/go/",
  "https://sp.esquire.ru/go/",
  "https://sp.robb.report/go/",
  "https://sp.bazaar.ru/go/",
  "https://sp.graziamagazine.ru/go/",
  "https://sp.mhealth.ru/go/"
];

export const INITIAL_STATE = {
  site: "https://sp.imweb.ru/go/",
  token: "",
  short_id: "",
  redirect_url: "",
  redirect_counter: "",
  use_share: true,
  share_img: "",
  share_title: "",
  share_desc: "",
  time_stamp: "",
  comment:"",
  auto_share: false,
  vars: {}
};

export const apiurl = window.location.hostname.includes('nahab') ? "https://dev.nahab.info/go/tokens" : "../"; //"https://sp.imweb.ru/go2/tokens";
export const redirect_base = window.location.hostname.includes('nahab') ? "https://dev.nahab.info/go/" : "";//"../" ; 
console.log('redirect_base', redirect_base);