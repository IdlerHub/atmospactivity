import { get, post } from '../utils/request.js';

//post 使用JSSDK url:当前路径
function getJsapiTicket(param) {
  return post('/weixin-mp/wx/jsapi/getJsapiTicket', param)
}

/**
 * @description: 华为云临时
 */
function getObsToken(data) {
  return post('/activity-general/voteCloud/getObsToken', data);
}

/**
 * @description: 保存祝福信息
 */
function saveBlessing(data) {
  return post('/activity-general/festival/saveBlessing', data);
}

/**
 * @description: 获取对应的祝福信息
 * { openUserId }
 */
function getBlessingInfo(data) {
  return post('/activity-general/festival/getBlessingInfo', data);
}

export default {
  getJsapiTicket,
  getObsToken,
  saveBlessing,
  getBlessingInfo
}