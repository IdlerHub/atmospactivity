<template>
  <div :class="pageClass">
    <div class="site">
      <img
        src="https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/selected-bg.png"
        alt=""
      />
      <div class="select-img-box">
        <div class="select-img-list">
          <div
            class="img-item"
            v-for="(item, index) in 4"
            :key="index"
            @click="setSelectedInd(index)"
          >
            <van-uploader :after-read="afterRead" />
          </div>
        </div>
      </div>
      <div class="selected-img">
        <div class="selected-box" @click="setSelectedInd(4)">
          <img
            class="mine-img"
            src="https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/open-img.png"
            alt="其他年味贺卡"
          />
          <van-uploader :after-read="afterRead" />
        </div>
      </div>
      <!-- 图片裁剪 -->
      <Cropper
        :imgUrl="userImgUrl.content"
        :showCropper="showCropper"
        @confirmCrop="confirmCrop"
        @cancelCrop="cancelCrop"
      ></Cropper>
      <!-- 姓名填写弹窗 -->
      <div
        v-if="inputName"
        class="username-mask animate__animated animate__fadeIn"
        @click="closeMask"
      >
        <div class="wrapper" @click.stop>
          <div class="box-title">祝福署名</div>
          <div class="box-ipt">
            <input
              type="text"
              placeholder="请输入您的名字"
              maxlength="10"
              v-model="userName"
              @blur="scrollTop"
            />
          </div>
          <div class="create-card" @click="createCard">生成贺卡</div>
        </div>
        <img src="../assets/images/close.png" alt="关闭" @click="closeMask" />
      </div>
    </div>
  </div>
</template>

<script>
import { CONTENT_TEXT } from "@/assets/data/selectedImgList";
import Cropper from "@/components/cropper-box.vue";
import { Toast, Uploader } from "vant";
import http from "@/api";
export default {
  name: "Selected",
  data() {
    return {
      pageClass: {
        //页面动画
        "selected-page": true,
        animate__animated: false,
        animate__rotateInDownLeft: false,
      },
      showCropper: false, //展示裁剪板
      selectedIndex: "", //用户选择的框
      userImgUrl: "", //用于用户自选图片
      posterInfo: {}, //海报信息
      inputName: false, //显示输入名字弹窗
      userName: "", //用户姓名
      obsOptions: {}, //obs参数
      obsClient: null, //obs对象
    };
  },
  components: {
    Cropper,
    "van-uploader": Uploader,
  },
  mounted() {
    this.obsInit();
  },
  methods: {
    // 初始化OBS
    obsInit() {
      http.getObsToken().then((res) => {
        this.obsOptions = res.data;
        this.obsClient = new ObsClient({
          security_token: res.data.securitytoken,
          access_key_id: res.data.access,
          secret_access_key: res.data.secret,
          server: res.data.endPoint,
        });
      });
    },
    // 获取用户选中的文件
    afterRead(file) {
      this.userImgUrl = file;
      console.log(this.userImgUrl);
      // 展示裁剪工具
      this.showCropper = true;
    },
    setSelectedInd(index) {
      this.selectedIndex = index;
    },
    //取消选择裁剪图片
    cancelCrop() {
      this.showCropper = false;
    },
    // 确认裁剪图片
    confirmCrop(file) {
      // base64转换成file对象
      // let file = this.dataURLtoFile(imgUrl);
      console.log(file);
      //设置上传的名字
      const imgName = this.getRandomName() + "-" + this.userImgUrl.file.name;
      console.log(
        `${this.obsOptions.bucketName}.${this.obsOptions.endPoint}/${this.obsOptions.key}${imgName}`
      );
      const obsImageUrl = `https://${this.obsOptions.bucketName}.${this.obsOptions.endPoint}/${this.obsOptions.key}${imgName}`;
      const loadTip = Toast.loading({
        message: "上传中...",
        forbidClick: true,
        duration: 0,
      });
      this.obsClient.putObject(
        {
          Bucket: this.obsOptions.bucketName,
          Key: this.obsOptions.key + imgName,
          SourceFile: file,
        },
        (err, result) => {
          //关闭裁剪工具
          this.showCropper = false;
          loadTip.clear();
          if (err) {
            Toast.fail("上传失败,请刷新重试");
            console.error("Error-->" + err);
          } else {
            //设置选中信息
            Toast.success({
              message: "上传成功",
              overlay: true,
              forbidClick: true,
              duration: 1500
            });
            this.createPoster(obsImageUrl);
            console.log("Status-->" + result.CommonMsg.Status);
          }
        }
      );
    },
    // 确认使用图片
    createPoster(image) {
      let item = {
        id: this.selectedIndex,
        image,
      };
      this.posterInfo = item;
      this.getContentText();
      // 展示输入名字
      this.inputName = true;
    },
    // 生成贺卡
    createCard() {
      if (this.userName.trim() == "") {
        this.$toast("请输入您的名字");
        return;
      }
      this.posterInfo["name"] = this.userName;
      // this.posterInfo["posterTag"] = "返回的标识"
      // 将信息传到后台,并接收回id进入下一个页面
      const options = {
        name: this.posterInfo["name"],
        image: this.posterInfo["image"],
        content: this.posterInfo["content"],
      };
      http.saveBlessing(options).then((res) => {
        // 存入用户标识
        this.posterInfo["openUserId"] = res.data.openUserId;
        sessionStorage.setItem("posterInfo", JSON.stringify(this.posterInfo));
        // 关闭显示弹窗
        this.inputName = false;
        this.$router.replace({ name: "Poster" });
      });
    },
    // 关闭蒙版
    closeMask() {
      this.inputName = false;
    },
    //base转文件
    dataURLtoFile(base64, fileName = "file") {
      let arr = base64.split(","),
        type = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type });
    },
    //设置随机名称
    getRandomName(hasLine = "-") {
      let s = [];
      let hexDigits = "0123456789abcdef";
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = hasLine;
      let randomName = s.join("");
      return randomName;
    },
    // 获取对应的祝福文本
    getContentText() {
      const id = this.posterInfo.id || 0;
      const selectedList = CONTENT_TEXT.filter((item) => item.id == id);
      const num = parseInt(Math.random() * selectedList[0].content.length);
      // console.log(num)
      // console.log(selectedList[0].content[num]);
      this.posterInfo["content"] = selectedList[0].content[num];
    },
    scrollTop() {
      //键盘收起后就让页面拉到初始位置
      window.scroll(0, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.selected-page {
  width: 100%;
  min-height: 100vh;
  background: url("https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/selected-bg-l.png")
    no-repeat;
  background-size: 100%;
  position: relative;
  @media screen and (min-height: 810px) {
    // background: rgb(199, 27, 16)
    //   url("https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/selected-bg-l.png")
    //   no-repeat;
    background-size: 100% 100%;
  }
  .select-img-box {
    position: absolute;
    top: 34vw;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .select-img-list {
      width: 79.5vw;
      height: calc(679vmin / 7.5);
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .img-item {
        padding: 15px 10px;
        width: 36vw;
        height: calc(300vmin / 7.5);
        background: #ffefdc;
        border-radius: 16px;
        margin-right: 16px;
        margin-bottom: 19px;
        opacity: 0;
        /deep/ .van-uploader {
          width: 100%;
          height: 100%;
          .van-uploader__wrapper {
            width: 100%;
            height: 100%;
            .van-uploader__upload {
              width: 100%;
              height: 100%;
              .van-uploader__input {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        // img {
        //   width: 36vw;
        //   height: calc(202vmin / 7.5);
        //   border-radius: 10px;
        //   overflow: hidden;
        //   margin-bottom: 30px;
        // }
        // .text {
        //   height: 50px;
        //   font-size: 36px;
        //   font-family: PingFangSC-Medium, PingFang SC;
        //   font-weight: 500;
        //   color: #bd3132;
        //   line-height: 50px;
        //   text-align: center;
        // }
      }
      .img-item:nth-child(2n) {
        margin-right: 0;
      }
      @media screen and (max-width: 360px) {
        .img-item {
          width: 34.6vw;
          img {
            width: 34.6vw;
          }
        }
      }
    }
    @media screen and(min-height: 810px) {
      top: 40vw;
    }
  }
}

// 按钮
.selected-img {
  width: 100%;
  position: absolute;
  top: 138.5vw;
  height: calc(133vmin / 7.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .selected-box {
    position: relative;
    height: calc(133vmin / 7.5);
    img {
      width: 500px;
      height: 100%;
    }
    /deep/ .van-uploader {
      opacity: 0;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      .van-uploader__wrapper,
      .van-uploader__upload {
        width: 100%;
        height: 100%;
      }
    }
  }

  @media screen and(min-height: 810px) {
    top: 150vw;
  }
}

.username-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(#000000, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 99;
  .wrapper {
    padding: 30px;
    width: 540px;
    min-height: calc(348vmin / 7.5);
    background: #ffffff;
    border-radius: 16px;
    .box-title {
      height: 56px;
      font-size: 40px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 56px;
      text-align: center;
      margin-top: 12px;
      margin-bottom: 30px;
    }
    .box-ipt {
      padding: 0 30px;
      width: 480px;
      height: 100px;
      background: #f5f6fa;
      border-radius: 12px;
      margin-bottom: 40px;
      input {
        width: 100%;
        padding: 25px 0;
        height: 50px;
        border: none;
        background: none;
        font-size: 36px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333333;
        line-height: 50px;
      }
    }
    .create-card {
      // width: 540px;
      height: 100px;
      background: #f2323a;
      border-radius: 12px;

      font-size: 40px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 100px;
      text-align: center;
    }
  }
  & > img {
    width: 88px;
    height: 88px;
    margin-top: 80px;
  }
}

.site {
  position: relative;
  & > img {
    width: 100%;
    height: 100%;
  }
}
</style>
