const rp = require('request-promise');

module.exports = class extends think.cmswing.app {
  /**
     * 登录
     * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
     */
  async loginAction() {
    const code = this.post('code');
    const fullUserInfo = this.post('userInfo');
    const userInfo = fullUserInfo.userInfo;

    // 获取openid
    const options = {
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      qs: {
        grant_type: 'authorization_code',
        js_code: code,
        secret: think.config('weixin.secret'),
        appid: think.config('weixin.appid')
      }
    };

    let sessionData = await rp(options);
    sessionData = JSON.parse(sessionData);
    if (!sessionData.openid) {
      return this.fail('登录失败');
    }

    // 验证用户信息完整性
    const crypto = require('crypto');
    const sha1 = crypto.createHash('sha1').update(fullUserInfo.rawData + sessionData.session_key).digest('hex');
    if (fullUserInfo.signature !== sha1) {
      return this.fail('登录失败');
    }

    // 解释用户数据
    const WeixinSerivce = this.service('weixin', 'api');
    const weixinUserInfo = await WeixinSerivce.decryptUserInfoData(sessionData.session_key, fullUserInfo.encryptedData, fullUserInfo.iv);
    if (think.isEmpty(weixinUserInfo)) {
      return this.fail('登录失败');
    }

    // 根据openid查找用户是否已经注册
    let userId = await this.model('wx_user').where({ openid: sessionData.openid }).getField('id', true);
    if (think.isEmpty(userId)) {
      // 注册
      userId = await this.model('wx_user').add({
        subscribe_time: parseInt(new Date().getTime() / 1000),
        mobile: '',
        city: '',
        province: '',
        country: '',
        language: '',
        openid: sessionData.openid,
        headimgurl: userInfo.avatarUrl || '',
        sex: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        nickname: userInfo.nickName
      });
    }

    sessionData.user_id = userId;

    // 查询用户信息
    const newUserInfo = await this.model('wx_user').field(['id', 'nickname', 'sex', 'headimgurl']).where({ id: userId }).find();

    const TokenSerivce = this.service('token', 'api');
    const sessionKey = await TokenSerivce.create(sessionData);

    if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
      return this.fail('登录失败');
    }

    return this.success({ token: sessionKey, userInfo: newUserInfo });
  }
};
