<template>
<div class="svg-box">
  <div id="lottie" :style="style" :ref="options.refName"></div>
</div>
</template>

<script>
import lottie from "lottie-web";
import { Overlay } from "vant";
export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
    height: Number,
    width: Number,
    show: Boolean,
  },
  components: {
    "van-overlay": Overlay,
  },
  data() {
    return {
      style: {
        width: this.width ? `${this.width}px` : "100%",
        height: this.height ? `${this.height}px` : "100%",
        overflow: "hidden",
        margin: "0 auto",
      },
    };
  },
  mounted() {
    //初始化动画
    this.anim = lottie.loadAnimation({
      container: this.$refs[this.options.refName],
      renderer: "svg",
      name: this.options.refName || "",
      loop: this.options.loop || false,
      autoplay: this.options.autoplay || false,
      animationData: this.options.animationData,
      // rendererSettings: this.options.rendererSettings,
    });
    this.anim.setSpeed(this.options.animationSpeed || 1);
    this.$emit("animCreated", this.anim);
  },
};
</script>

<style lang="scss">
.svg-box {
  //  width: 100vw;
  // height: 100vh;
  // position: relative;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 3;
  #lottie{
    //  width: 100%;
    // height: 100%;
    // transform: translate3d(0, 0, 0);
    // text-align: center;
    // opacity: 1;
    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 3;
    // display: flex;
    // flex-direction: row;
    // justify-content: center;
    // align-items: center;
  }
}
</style>
