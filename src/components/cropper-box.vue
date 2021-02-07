<template>
  <div class="cropper-box" v-if="showCropper">
    <vueCropper
      ref="cropper"
      :img="imgUrl"
      :outputSize="option.outputSize"
      :outputType="option.outputType"
      :autoCrop="option.autoCrop"
      :autoCropWidth="option.autoCropWidth"
      :autoCropHeight="option.autoCropHeight"
      :fixedBox="option.fixedBox"
      :centerBox="option.centerBox"
      :original="option.original"
      :fixedNumber="option.fixedNumber"
      :info="option.info"
    ></vueCropper>
    <div class="btn">
      <div class="cancel" @click="cancelCrop">取消</div>
      <div class="confirm" @click="confirmCrop">确认</div>
    </div>
  </div>
</template>
<script>
import { VueCropper } from "vue-cropper";
export default {
  props: {
    showCropper: {
      type: Boolean,
      default: false,
    },
    imgUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      option: {
        outputSize: 0.2, //裁剪生成图片的质量
        info: false,    //裁剪框的大小信息
        outputType: "png", //裁剪生成图片的格式
        fixedBox: true, //固定截图框大小 不允许改变
        autoCrop: true, //是否默认生成截图框
        autoCropWidth: 375, //默认生成截图框宽度
        autoCropHeight: 247, //默认生成截图框高度
        // fixedNumber: [5, 3], //截图框的宽高比例
        // original: true,       //上传图片按照原始比例渲染
        centerBox: false, //裁剪框是否被限制在图片里
      },
    };
  },
  components: {
    VueCropper,
  },
  methods: {
    cancelCrop() {
      this.$emit("cancelCrop");
    },
    // 确认选择,并且截图
    confirmCrop() {
      // 获取截图的base64 数据
      this.$refs.cropper.getCropData((data) => {
        let img = new Image();
        img.src = data;
        img.onload = () => {
          let _data = this.onImgCompression(img);
          let file = this.dataURLtoFile(data);
          // console.log(
          //   "图片大小-压缩过:",
          //   (file.size / 1024).toFixed(2),
          //   "kb，",
          //   "压缩率：",
          //   0.8
          // );
          this.$emit('confirmCrop', file)
        };
        // let file = this.dataURLtoFile(data);
        //  this.$emit('confirmCrop', file)
        // console.log(data);
        // this.$emit("confirmCrop", data);
      });
      // 获取截图的blob数据
      // this.$refs.cropper.getCropBlob((data) => {
      //   this.$emit("confirmCrop", data);
      // });
    },
    // 压缩图片
    onImgCompression(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      
      //进行压缩
      let compress = 0.8; //压缩率
      return canvas.toDataURL("image/png", compress);
    },
    // image转文件
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
  },
};
</script>

<style lang="scss">
.cropper-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: rgba(#000000, 0.6);
  background: #000000;
}
.btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 60px;
  height: 150px;
  text-align: center;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #000000;
  div {
    width: 100px;
    height: 150px;
    line-height: 150px;
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
  .cancel {
    color: rgba(#ffffff, 0.5);
  }
  .confirm {
    color: #ffffff;
  }
}
</style>
