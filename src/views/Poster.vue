<template>
  <div class="poster-page">
    <!-- 截图保存 -->
    <div :class="['imageWrapper', {'imageWrapper-1' : nHeight > 740}]" ref="imageWrapper" id="poster">
      <!-- 生成图片 -->
      <img
        class="real_pic"
        data-html2canvas-ignore
        v-if="posterUrl != ''"
        :src="posterUrl"
        alt
      />

      <!-- 内容 -->
      <div class="poster-box">
        <!-- 背景图 -->
        <img class="poster-bg" :src="backgroundUrl" alt="" />
        <div class="poster-info">
          <div :class="['selected-image',{'selected-image-1': nHeight > 740}]">
            <img :src="posterInfo.image" alt />
          </div>
          <div class="content-text">
            <div class="text-name">{{ posterInfo.name }}祝您:</div>
            <div class="text-msg">{{ posterInfo.content }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="save-btn" v-if="showBtn">
      <div class="save" @click="tipSave">{{
        isApp ? "点击保存图片" : "长按保存图片"
      }}</div>
      <div class="share-poster" @click="shareWithFriends">送出祝福</div>
    </div>
    <div class="save-btn" v-else>
      <div class="to-home" @click="toHome">制作我的新年贺卡</div>
    </div>
    <!-- 分享链接提示蒙版 -->
    <div v-show="showTip" class="share-mask" @click="showTip = false">
      <img
        src="https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/share-tip.png"
        alt
      />
    </div>
  </div>
</template>

<script>
import html2canvas from "@/utils/html2canvas";
import { Toast } from "vant";
import http from "@/api";
import { DOMAIN_BASEURL } from "@/utils/BASE";

export default {
  name: "Poster",
  data() {
    return {
      isApp: false, //是否APP内
      backgroundUrl:
        "https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/poster.png",
      showBtn: true, //是否从首页进入
      posterInfo: {}, //海报信息
      posterUrl: "", //生成的海报截图
      showTip: false,
      shareTitle: "晒年味，送祝福",
      shareSubtitle: "新年快乐！我正在做贺卡，你也来做一张吧",
      shareUrl: "",
      shareImg:
        "https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/share-img-wx.png",
      nHeight: "",
    };
  },
  created() {
    this.uaInit();
  },
  mounted() {
    let openUserId = this.$route.query.tag;
    if (openUserId != undefined && openUserId != "") {
      this.showBtn = false;
      this.getBlessingInfo(openUserId);
    } else {
      this.posterInfo = JSON.parse(sessionStorage.getItem("posterInfo"));
      this.createPoster();
    }
    this.shareInit(openUserId || this.posterInfo.openUserId);
  },
  methods: {
    uaInit() {
      const height = window.screen.height;
      this.nHeight = height;
      if (
        navigator.userAgent.toLowerCase().indexOf("onlineaginguniversity") !==
        -1
      ) {
        this.isApp = true;
      } else {
        this.isApp = false;
      }
      if (height > 740) {
        this.backgroundUrl =
          "https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/poster-l.png";
      }
    },
    // 分享初始化
    shareInit(openUserId) {
      this.shareUrl = `${DOMAIN_BASEURL}poster?tag=${openUserId}`;
      if (navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1) {
        this.getJsConfig(window.location.href.split("#")[0]);
      }
    },
    // 生成海报
    createPoster() {
      let temp = null;
      this.getBase64Image(this.posterInfo.image).then((res) => {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var scale = 2; //放大倍数
        context.scale(scale, scale);
        //设置context位置，值为相对于视窗的偏移量负值，让图片复位(解决偏移的重点)
        var rect = document.getElementById("poster").getBoundingClientRect(); //获取元素相对于视察的偏移量
        context.translate(-rect.left, -rect.top);
        if (this.showBtn) {
          temp = Toast.loading({
            message: "图片生成中...",
            forbidClick: true,
            duration: 0,
          });
        }
        let options = {
          allowTaint: false,
          backgroundColor: "transparent", // 解决生成会有白边的可能
          scrollX: 0,
          scrollY: 0,
          useCORS: true, // 允许加载跨域图片
        };
        (window.html2canvas || html2canvas)(this.$refs.imageWrapper, options)
          .then((canvas) => {
            let posterUrl = canvas.toDataURL("image/png");
            this.posterUrl = posterUrl;
            if (this.showBtn) {
              temp.clear();
              if(this.isApp) {
                this.$toast("贺卡已生成,快长按保存吧!");
              }else {
                this.$toast("贺卡已生成，点击按钮保存贺卡");
              }
              
            }
          })
          .catch((err) => {
            if (this.showBtn) {
              Toast.fail("网络错误,请返回选择新的图片");
              temp.clear();
            }
          });
      });
    },
    // 获取海报信息
    getBlessingInfo(openUserId) {
      http
        .getBlessingInfo({ openUserId })
        .then((res) => {
          this.posterInfo = res.data;
          this.createPoster();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 提示保存
    tipSave() {
      if (this.isApp) {
        let options = {
          saveType: 2, //   1图片URL  2 图片base64
          imageData: this.posterUrl, //base64
        };
        if (
          navigator.userAgent.indexOf("Android") > -1 ||
          navigator.userAgent.indexOf("Linux") > -1
        ) {
          android.saveImageToPhotoAlbum(JSON.stringify(options));
        } else if (
          !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        ) {
          // options['imageData'].replace("data:image/png;base64,", '')
          window.webkit.messageHandlers.saveImageToPhotoAlbum.postMessage(
            options
          );
        }
      } else {
        this.$toast("请长按上方图片保存");
      }
    },
    toHome() {
      this.$router.replace({ name: "DefaultAnim" });
    },
    // 送出祝福
    shareWithFriends() {
      const userAgent = navigator.userAgent;
      // 微信环境
      if (this.isApp) {
        //APP 环境
        if (
          userAgent.indexOf("Android") > -1 ||
          userAgent.indexOf("Linux") > -1
        ) {
          //app中Android --- 1
          this.shareWithAndroid();
        } else if (!!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          //app中IOS --- 2
          this.shareWithIOS();
        }
      } else {
        this.showTip = true;
      }
    },
    //安卓原生
    shareWithAndroid() {
      let options = {
        type: 2, //   分享类型（1: 网页分享  2: 图片分享  3: 小程序分享 ）
        shareType: 2, //   1分享朋友圈 2分享好友
        nativeDialog: false, //是否需要原生分享面板
        params: {
          image: this.posterUrl, //分享图片 URL或base64 （type=2 必传）
        },
      };
      android.goShare(JSON.stringify(options));
    },
    //ios原生分享
    shareWithIOS() {
      let options = {
        type: 2, //   分享类型（1: 网页分享  2: 图片分享  3: 小程序分享 ）
        nativeDialog: false, //是否需要原生分享面板
        params: {
          image: this.posterUrl, //分享图片 URL或base64 （type=2 必传）
        },
      };
      // 分享好友
      window.webkit.messageHandlers.goShare.postMessage(options);
    },
    //小程序环境分享配置
    miniProgramShareConfig() {
      let shareInfo = {
        title: this.shareTitle,
        type: 1, //进小程序的webview
        url: this.shareUrl,
        imageUrl:
          "https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/share-img-mini.png",
      };
      this.$wx.miniProgram.postMessage({ data: shareInfo });
    },
    //微信环境分享配置
    weChatDefaultShareConfig() {
      this.$wx.ready(() => {
        this.$wx.updateAppMessageShareData({
          //微信朋友分享
          title: this.shareTitle, // 分享标题
          desc: this.shareSubtitle, // 分享描述
          link: this.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: this.shareImg, // 分享图标
        });
        this.$wx.updateTimelineShareData({
          //微信朋友圈分享
          title: this.shareTitle,
          link: this.shareUrl,
          imgUrl: this.shareImg,
        });
      });
    },
    getBase64Image(src) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.crossOrigin = "";
        img.src = src;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ratio = window.devicePixelRatio || 2;
          const width = img.width * ratio;
          const height = img.height * ratio;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          try {
            resolve(canvas.toDataURL("image/png", 0.9)); // 这里是为了降低图片大小
          } catch (error) {
            reject(error);
          }
        };
      });
    },
    getJsConfig(url) {
      http
        .getJsapiTicket({ url })
        .then((res) => {
          this.$wx.config({
            debug: false && process.env.NODE_ENV !== "production", // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: [
              "updateAppMessageShareData", //分享给朋友
              "updateTimelineShareData", //分享给朋友圈
            ], // 必填，需要使用的JS接口列表
          });
          if (navigator.userAgent.toLowerCase().indexOf("miniprogram") !== -1) {
            this.miniProgramShareConfig();
          } else {
            this.weChatDefaultShareConfig();
          }
        })
        .catch((err) => {
          this.$toast("授权错误");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.poster-page {
  // 148 + 60
  height: calc(100vh - 208px);
  background: #e0e0e0;
  padding: 30px;
  display: flex;
  align-items: center;
  .imageWrapper {
    width: 100%;
    height: calc(996vmin / 7.5);
    // background: url("https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/poster.png")
    //   no-repeat;
    // background-size: 100% 100%;
    .poster-box {
      width: 100%;
      height: 100%;
      position: relative;
      .poster-bg {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
      }
      .poster-info {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        .selected-image {
          margin-top: 11.4vw;
          width: 86.6vw;
          height: calc(428vmin / 7.5);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 30px;
          img {
            width: 100%;
            height: 100%;
          }
          // @media screen and (min-height: 740px) {
          //   margin-top: 16.4vw;
          //   margin-bottom: 40px;
          // }
        }
        .content-text {
          width: 84vw;
          // height: 226px;
          font-size: 40px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #ffe7c7;
          line-height: 54px;
          overflow: hidden;
          text-align: left;
          .text-name {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .text-msg {
            text-indent: 2rem;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            margin-top: 10px;
          }
        }

        // 适配740px以上
        .selected-image-1 {
          margin-top: 16.4vw;
          margin-bottom: 80px;
        }
      }
    }
    // @media screen and (min-height: 740px) {
    //   height: calc(1200vmin / 7.5);
    // }
  }
  .imageWrapper-1{
    height: calc(1200vmin / 7.5);
  }
  // 生成的截图
  .real_pic {
    width: 100%;
    height: 100%;
    z-index: 3;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
  }
  // 底部按钮
  .save-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 30px;
    height: 148px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ed273f;
    z-index: 9;
    div {
      height: 88px;
      line-height: 88px;
      text-align: center;
      width: 44vw;
      border-radius: 44px;
    }
    .save {
      background: linear-gradient(90deg, #ffea4d 0%, #fed433 100%);
      box-shadow: 0px 8px 0px 0px #fd9019;
      font-size: 36px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #8f4000;
    }
    .share-poster {
      background: linear-gradient(90deg, #ffd7fb 0%, #ffc6f7 100%);
      box-shadow: 0px 8px 0px 0px #d676d9;
      font-size: 36px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #760479;
    }
    .to-home {
      width: 100%;
      height: 98px;
      line-height: 98px;
      background: linear-gradient(90deg, #ffea4d 0%, #fed433 100%);
      box-shadow: 0px 8px 0px 0px #fd9019, 0px -2px 4px 0px #ffeed5;
      border-radius: 49px;
      text-align: center;
      font-size: 36px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #8f4000;
    }
  }
  // 分享提示
  .share-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(#000000, 0.8);
    display: flex;
    justify-content: center;
    z-index: 9;
    img {
      height: calc(807vmin / 7.5);
    }
  }
}
</style>
