const httpBase = {
  development: 'https://activitygwdev.jinlingkeji.cn',
  test: 'https://activitygwtest.jinlingkeji.cn',
  production: 'https://activitygwpro.jinlingkeji.cn'
}

const domainBase = {
  development: 'https://globalh5dev.jinlingkeji.cn/atmospactivity/',
  test: 'https://globalh5test.jinlingkeji.cn/atmospactivity/',
  production: 'https://globalh5pro.jinlingkeji.cn/atmospactivity/'
}

const APPID = {
  development: 'wx82110e9ea8978e79', // 胖老头---改名为中老年音乐学堂
  test: 'wx8730f23e7d539293', // 中老年健康云
  production: 'wxbd85dc45a5a84cd8' // 网上老年大学
}

// https://lndxappcdn.jinlingkeji.cn/+路径
const HTPP_BASEURL = httpBase[process.env.NODE_ENV]
const DOMAIN_BASEURL = domainBase[process.env.NODE_ENV]
const JSAPIAPPID = APPID[process.env.NODE_ENV]

export { HTPP_BASEURL, DOMAIN_BASEURL, JSAPIAPPID }
