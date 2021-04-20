import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

export default async (
  url,
  data = {},
  method = "",
  headers = {},
  responseType = ""
) => {
  const baseURL = "http://1.15.236.205:8080/";
  try {
    return new Promise((success, error) => {
      console.log(baseURL + url);
      axios({
        url: baseURL + url,
        data,
        method,
        headers,
        responseType,
      })
        .then((res) => {
          success(res);
        })
        .catch((res) => {
          error(res);
        });
    });
  } catch (res) {
    console.log(res);
  }
};
