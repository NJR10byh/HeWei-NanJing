import axios from "axios";

export default async (url, data = {}, method = "") => {
  const baseURL = "http://1.15.236.205:8080/";
  try {
    return new Promise((resolve) => {
      console.log(baseURL + url);
      axios({
        url: baseURL + url,
        data,
        method,
      }).then((res) => {
        resolve(res);
      });
    });
  } catch (res) {
    console.log(res);
  }
};
