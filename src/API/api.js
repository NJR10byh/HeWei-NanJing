export default async (url, data = {}, method = "") => {
  const baseURL = "https://netease-cloud-music-api-ivory.vercel.app";
  try {
    return new Promise((resolve, reject) => {
      console.log(baseURL + url + "&timestamp=" + new Date().getTime());
      uni.request({
        url: baseURL + url + "&timestamp=" + new Date().getTime(),
        data,
        method,
        success: (res_1) => {
          resolve(res_1);
        },
        fail: (err_1) => {
          reject(err_1);
        },
      });
    });
  } catch (e) {}
};
