<template>
  <div id="app" @click.once="oncaPlay">
    <audio
      class="audio-c"
      src="https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/atmospactivity_bgm.mp3"
      loop="loop"
      ref="MusicPlay"
      preload="auto"
    ></audio>
    <div class="radio" @click.stop="changePlay">
      <img
        class="music-play"
        v-show="radioPlay"
        src="./assets/images/radio.png"
        alt="播放"
      />
      <img v-show="!radioPlay" src="./assets/images/n-radio.png" alt="暂停" />
    </div>
    <router-view />
  </div>
</template>

<script>
import http from "@/api";
export default {
  data() {
    return {
      radioPlay: false,
      shareTitle: "晒年味，送祝福",
      shareSubtitle: "新年快乐！我正在做贺卡，你也来做一张吧", //分享描述
      shareImg:
        "https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/share-img-wx.png",
    };
  },
  mounted() {
    //android禁止微信浏览器调整字体大小
    //TODO: 可能会在刚刚进去的时候大字体，1秒之后变回来
    if (
      typeof WeixinJSBridge == "object" &&
      typeof WeixinJSBridge.invoke == "function"
    ) {
      this.handleFontSize();
    } else {
      if (document.addEventListener) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          this.handleFontSize,
          false
        );
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", this.handleFontSize);
        document.attachEvent("onWeixinJSBridgeReady", this.handleFontSize);
      }
    }
    this.autoplay();
    if (navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1) {
      this.getJsConfig(window.location.href.split("#")[0]);
    }
  },
  methods: {
    changePlay() {
      console.log("修改播放状态");
      if (this.radioPlay) {
        this.$refs.MusicPlay.pause();
        this.radioPlay = false;
      } else {
        this.$refs.MusicPlay.play();
        this.radioPlay = true;
      }
    },
    oncaPlay() {
      if (!this.radioPlay) {
        this.$refs.MusicPlay.play();
        this.radioPlay = true;
      }
    },
    autoplay() {
      let audio = this.$refs.MusicPlay;
      this.$wx.miniProgram.getEnv((res) => {
        //判断是否处在小程序环境中
        if (res.miniprogram) {
          audio.play();
          this.radioPlay = true;
        }
      });
      document.addEventListener("visibilitychange", () => {
        //初始化监听事件
        if (document.hidden) {
          //页面隐藏则关闭音乐
          audio.pause();
        } else {
          if (this.radioPlay) {
            setTimeout(() => {
              audio.play();
              // this.radioPlay = true; //控制音乐图标变化
            }, 2000);
          }
        }
      });
    },
    getJsConfig(url) {
      http
        .getJsapiTicket({ url})
        .then((res) => {
          console.log(res);
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
          if (this.$route.name != "Poster") {
            console.log("配置全局");
            if (
              navigator.userAgent.toLowerCase().indexOf("miniprogram") !== -1
            ) {
              this.miniProgramShareConfig();
            } else {
              this.weChatDefaultShareConfig();
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast("授权错误");
        });
    },
    //小程序环境分享配置
    miniProgramShareConfig() {
      let shareInfo = {
        title: this.shareTitle,
        type: 1, //进小程序的webview
        url: window.location.href,
        imageUrl:
          "https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/share-img-mini.png",
      };
      this.$wx.miniProgram.postMessage({ data: shareInfo });
    },
    //微信环境分享配置
    weChatDefaultShareConfig() {
      let title = this.shareTitle;
      this.$wx.ready(() => {
        this.$wx.updateAppMessageShareData({
          //微信朋友分享
          title, // 分享标题
          desc: this.shareSubtitle, // 分享描述
          link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: this.shareImg, // 分享图标
          success: () => {
            console.log("设置成功");
          },
        });
        this.$wx.updateTimelineShareData({
          //微信朋友圈分享
          title,
          link: window.location.href,
          imgUrl: this.shareImg,
          success: () => {
            console.log("设置成功");
          },
        });
      });
    },
    handleFontSize() {
      // 设置网页字体为默认大小
      WeixinJSBridge.invoke("setFontSizeCallback", {
        fontSize: 0,
      });
      // 重写设置网页字体大小的事件
      WeixinJSBridge.on("menu:setfont", function() {
        WeixinJSBridge.invoke("setFontSizeCallback", {
          fontSize: 0,
        });
      });
    },
  },
};
</script>

<style lang="scss">
#app {
  // color: #2c3e50;
  // background: #bd3132;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.radio {
  position: fixed;
  right: 20px;
  top: 20px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  z-index: 9;
  img {
    width: 100%;
    height: 100%;
  }
  .music-play {
    animation: run 3s infinite linear;
  }
  @keyframes run {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

//toast自定义样式
.bm-toast {
  width: fit-content !important;
  padding: 1.25rem 1.56rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0.5rem;
  opacity: 0.8;
  font-size: 1.31rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 1.84rem;
}

.audio-c {
  position: fixed;
  bottom: 0;
  opacity: 0;
}
</style>
