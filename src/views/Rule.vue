<template>
  <div class="rule-page">
    <img
      src="https://lndxappcdn.jinlingkeji.cn/wishes-project/wishes_common/rule.png"
      alt="活动规则"
    />
    <img
      class="goback"
      src="../assets/images/goback.png"
      alt="返回首页"
      @click="goBack"
    />
  </div>
</template>

<script>
export default {
  name: "Rule",
  methods: {
    goBack() {
      this.$router.replace({ name: "Home" });
    },
  },
};
</script>

<style lang="scss" scoped>
.rule-page {
  width: 100%;
  img {
    width: 100%;
  }
  .goback {
    position: fixed;
    right: 30px;
    bottom: 160px;
    width: 108px;
    height: 108px;
    border-radius: 100%;
  }
}
</style>
