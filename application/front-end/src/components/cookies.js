import Cookies from "universal-cookie";
global.cookie = new Cookies();

export const saveCookie = value => {
  const expires = new Date();
  expires.setDate(Date.now() + 60 * 60 * 4);
  global.cookie.set("userid", value, {
    path: "/",
    expires: expires,
    maxAge: 100000
  });
};

export const deleteCookie = value => {
  global.cookie.remove("userid", {
    path: "/"
  });
};

export const retrieveCookie = value => {
  if (global.cookie.get("userid") !== null) {
    return global.cookie.get("userid");
  } else return false;
};
