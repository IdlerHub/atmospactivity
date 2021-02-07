<template>
  <div class="default-anim">
    <!-- 动画 -->
    <lottie-content
      :options="defaultAnimOptions"
      @animCreated="handleWithCard"
    ></lottie-content>
  </div>
</template>

<script>
import lottieContent from "@/components/lottie-content";
import defaultAnimateData from "@/assets/data/homeAni.json";
export default {
  name: "DefaultAnim",
  data() {
    return {
      defaultAnim: null,
      defaultAnimOptions: {
        animationData: defaultAnimateData,
        refName: "testanimate",
        loop: true,
        animationSpeed: 1,
        autoplay: true,
      },
    };
  },
  components: {
    lottieContent,
  },
  mounted(){
    const width = document.body.offsetWidth; // 可见屏幕的高
    const height = document.body.offsetHeight; // 可见屏幕的高
    if(width) {
    }
  },
  methods: {
    handleWithCard(anim) {
      this.defaultAnim = anim;
      this.defaultAnim.addEventListener("loopComplete", () => {
        this.defaultAnim.goToAndStop(this.defaultAnim.totalFrames - 1, true);
        this.$router.replace({name: 'Home'})
      });
    },
  },
};
</script>

<style lang="scss">
.default-anim {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #fed48a;
  #lottie {
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0);
    text-align: center;
    opacity: 1;
    
    z-index: 3;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
  }
}

</style>
