<template>
  <div
    class="home-page"
  >
    <div class="site">
      <img
        class="site-img"
        :src="bgUrl"
        alt=""
      />
      <div class="ac-rule" @click="toRule">
        <span>活动规则</span>
      </div>
      <div class="create-card">
        <img
          ref="clickBtn"
          :class="createBtnClass"
          src="https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/create-card.png"
          alt="制作新年贺卡"
          @click="checkedPage"
        />
      </div>
    </div>

<!-- 动画 -->
    <!-- <lottie-content
      :options="defaultAnimOptions"
      @animCreated="handleWithCard"
    ></lottie-content> -->
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      bgUrl: "https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/wishes-bg.png",
      createBtnClass: {
        animate__animated: true,
        animate__bounce: true,
        animate__jello: false,
        animate__inf: true,
      },
    };
  },
  methods: {
    checkedPage() {
      this.createBtnClass['animate__jello'] = true
      setTimeout(()=>{
        this.$router.replace({ name: "Selected" });
      },800)
    },
    toRule() {
      this.$router.replace({ name: "Rule" });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100vh;
  background: url("https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/wishes-bg-l.png")
    no-repeat;
  background-size: 100%;
  position: relative;
  @media screen and (min-height: 810px) {
    background-size: 100% 100%;
  }
  
}
.site {
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .site-img{
    z-index: -1;
  }
}

.ac-rule {
  width: 100%;
  position: absolute;
  top: 114vw;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    display: inline-block;
    height: 32px;
    margin-right: 16px;
    position: relative;
    line-height: 32px;
    text-align: center;
    color: #666565;
    font-family: PingFangSC-Regular, PingFang SC;
    &::after {
      content: "";
      width: 12px;
      height: 12px;
      border-top: 4px solid #a09b9a;
      border-right: 4px solid #a09b9a;
      position: absolute;
      right: -24px;
      top: 8px;
      transform: rotate(45deg);
    }
  }
}
.create-card {
  width: 100%;
  position: absolute;
  top: 138.5vw;
  height: calc(133vmin / 7.5);
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 500px;
    height: 100%;
  }
  @media screen and(min-height: 810px) {
    top: 150vw;
  }
}

</style>
