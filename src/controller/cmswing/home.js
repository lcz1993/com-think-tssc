// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: arterli <arterli@qq.com>
// +----------------------------------------------------------------------
module.exports = class extends think.Controller {
  async __before() {
    // 当前登录状态
    this.is_login = await this.islogin();
    // 关闭站点
    if (this.config('setup.WEB_SITE_CLOSE') == 0) {
      const isshow = await this.session('userInfo');
      if (think.isEmpty(isshow)) {
        const error = this.controller('cmswing/error');
        return error.noAction('该网站已关闭，只有管理员可以正常访问');
      }
    }
    // 用户信息
    this.user = {};
    this.user.roleid = 8;// 游客
    // 访问控制
    if (this.is_login) {
      this.user.roleid = await this.model('member').where({id: this.is_login}).getField('groupid', true);
    }
    this.user = think.extend(this.user, await this.session('webuser'));
    // 获取当前分类信息
    // console.log(action);
    // this.meta_title = cate.meta_title?cate.meta_title:cate.title;
    // 设置主题
    // this.http.theme("default);
    // 购物车
    // 关闭商品模型时同时关闭购物车
  }

  /**
     * 判断是否登录
     * @returns {boolean}
     */
  async islogin() {
    // 前台判断是否登录
    const user = await this.session('webuser');
    const res = think.isEmpty(user) ? false : user.uid;
    return res;
  }
  async weblogin() {
    const islogin = await this.islogin();
    if (!islogin) {
      // 判断浏览客户端
      if (this.isMobile) {
        // 手机端直接跳转到登录页面
        return this.redirect('/center/public/login');
      } else {
        return this.redirect('/cmswing/error/login');
      }
    }
  }

  /**
     * 处理文档列表显示
     * @param {array} list 列表数据
     * @param {integer} model_id 模型id
     */
  async parseDocumentList(list, model_id) {
    model_id = model_id || 1;
    const attrList = await this.model('cmswing/attribute').get_model_attribute(model_id, false, 'id,name,type,extra');
    // attrList=attrList[model_id];
    // this.end(attrList);
    // console.log(attrList);
    if (think.isArray(list)) {
      list.forEach((data, k) => {
        // console.log(data);
        for (const key in data) {
          // console.log(key)
          if (!think.isEmpty(attrList[key])) {
            const extra = attrList[key]['extra'];
            const type = attrList[key]['type'];
            // console.log(extra);
            if (type == 'select' || type == 'checkbox' || type == 'radio' || type == 'bool') {
              // 枚举/多选/单选/布尔型
              const options = parse_config_attr(extra);
              const oparr = Object.keys(options);
              if (options && in_array(data[key], oparr)) {
                data[key] = options[data[key]];
              }
            } else if (type == 'date') { // 日期型
              data[key] = dateformat('Y-m-d', data[key]);
            } else if (type == 'datetime') { // 时间型
              data[key] = dateformat('Y-m-d H:i', data[key]);
            } else if (type === 'pics') {
              data[key] = `<span class="thumb-sm"><img alt="..." src="${data[key]}" class="img-responsive img-thumbnail"></span>`;
            }
          }
        }
        data.model_id = model_id;
        list[k] = data;
      });
      // console.log(222)
      return list;
    }
  }
  // 跨域设置
  setCorsHeader() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'x-requested-with');
    this.header('Access-Control-Request-Method', 'GET,POST,PUT,DELETE');
    this.header('Access-Control-Allow-Credentials', 'true');
  }
};
