import md5 from "js-md5";
const crypto = require("crypto");
import Base64 from "./base64.js";

/**
 * 又拍云图片上传方法
 * @param {Array} arr 需要上传的图片数组
 * @param {String} url 图片云存储路径 如'/houses'
 */
const upyLoad = (arr, url) => {
  return new Promise((reslove, reject) => {
    Promise.all(
      arr.map((ele) => {
        return upy(ele, url);
      })
    )
      .then((res) => {
        let temp = [];
        res.forEach((ele) => {
          let data = JSON.parse(ele.data);
          temp.push(data.url);
        });
        reslove(temp);
      })
      .catch((error) => {
        reject("上传失败");
      });
  });
};

/**
 *
 * @param {String} img 图片路径
 * @param {String} url 图片云存储路径
 */
const upy = (img, url) => {
  let bucket = "lezhu";
  let operator = "lezhurent";
  var date = new Date().toGMTString();
  let password = md5("bPA2BHnJom3putz1l2NUSiLEvOn1FrR8");
  // let url = '/houses';
  let method = "POST";
  let pathNmae = new Date().getTime();
  let opt = {
    "save-key": `${url}/${pathNmae}.png`,
    bucket,
    expiration: Math.round(new Date().getTime() / 1000) + 3600,
    date,
  };

  let policy = Base64.encode(JSON.stringify(opt));
  let data = ["POST", "/" + bucket, date, policy].join("&");
  const hmac = crypto.createHmac("sha1", password); //创建hmac加密对象
  const us = hmac.update(`${data}`); //加密凭证
  const result = us.digest().toString("base64"); //生成凭证

  return new Promise((reslove, reject) => {
    uni.uploadFile({
      url: `https://v0.api.upyun.com/${bucket}`,
      filePath: img,
      name: "file",
      formData: {
        authorization: `UPYUN ${operator}:${result}`,
        policy: policy,
      },
      success(res) {
        // console.log('res',res);

        reslove(res);
      },
      fail(e) {
        uni.showToast({
          title: "上传超时，请稍后重试",
          icon: "none",
        });
        uni.hideLoading();
        reject(e);
      },
    });
  });
};

const ENUM_URL_TYPE = {
  // 房东身份证
  idCard: "/landlord/id/",
  // 房东合同
  contract: "/landlord/contract/",
  // 租客身份证
  tenantIdCard: "/tenant/id/",
  // 租客合同
  tenantContract: "/tenant/contract/",
};
/**
 * 上传事件
 * @param tempFilePath
 * @param url
 * @param urlType
 * @param isDebug
 * @returns {Promise<unknown>}
 */
export const uploadEvt = ({
  tempFilePath = "",
  url,
  urlType,
  isDebug = false,
}) => {
  const uploadUrl = (urlType && ENUM_URL_TYPE[urlType]) || url || "";
  if (!uploadUrl) {
    console.warn("null upload url! please check", { url, urlType });
    return new Promise((resolve, reject) => reject());
  }
  isDebug && console.log("uploadEvt", tempFilePath);
  return new Promise((resolve, reject) => {
    upy(tempFilePath, uploadUrl).then((res) => {
      const { statusCode, data } = res;
      if (statusCode === 200) {
        const dataJson = JSON.parse(data);
        isDebug && console.log("upload res=", dataJson);
        resolve(dataJson);
      } else {
        reject(res);
      }
    });
    // this.$uploadPrivateOSS(tempFilePath, index, 'idcard', (err, result) => {
    //     if (result) {
    //     } else {
    //         reject('上传失败');
    //     }
    // });
  });
};

export default upyLoad;
