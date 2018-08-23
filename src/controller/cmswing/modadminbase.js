// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015-2115 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: arterli <arterli@qq.com>
// +----------------------------------------------------------------------
const assert = require('assert');
const Admin = require('./admin');
const path = require('path');
module.exports = class extends Admin {
  /**
   * 模型公共参数
   * @private
   */
  async __before() {
    await super.__before();// 继承父类before
    if (this.get('cate_id')) {
      // 获取当前模型栏目id
      // this.m_cate = await this.category(this.get('cate_id'));
      // if (think.isEmpty(this.m_cate)) {
      //   return this.m_cate;
      // }
      // 当前模型信息
      this.mod = await this.model('cmswing/model').get_model(this.m_cate.model);
      if (think.isEmpty(this.mod)) {
        const error = this.controller('cmswing/error');
        return error.noAction('模型不存在或被禁用!');
      }
    }
  }

  /**
   * index action
   * @return {Promise} []
   * 封面入口
   */
  async indexAction() {
    try {
      return this.action('mod/' + this.mod.name + '/admin', 'index');
    } catch (err) {
      assert(!think.isError(err), err);
    }
  }

  /**
   * 独立模型模版渲染
   * @param p action
   * @param m pc||移动
   * @returns {*}
   */
  modDisplay(p = this.ctx.action, m = '') {
    let c = this.ctx.controller.split('/');
    if (this.ctx.controller === 'cmswing/modadminbase') {
      c = `mod/${this.mod.name}/admin`.split('/');
    }
    if (p === 'm' || !think.isEmpty(m)) {
      if (p === 'm') {
        p = this.ctx.action;
        if (this.ctx.controller === 'cmswing/modadminbase') {
          p = 'index';
        }
      }
      const pp = path.join(think.ROOT_PATH, 'src', 'controller', 'mod', c[1], 'view', 'mobile', c[2]);
      return this.display(`${pp}_${p}`);
    } else {
      const pp = path.join(think.ROOT_PATH, 'src', 'controller', 'mod', c[1], 'view', 'pc', c[2]);
      return this.display(`${pp}_${p}`);
    }
  }
};
