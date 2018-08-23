// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015-2115 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: arterli <arterli@qq.com>
// +----------------------------------------------------------------------
// 商品类别
module.exports = class extends think.cmswing.admin {
  constructor(ctx) {
    super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
    this.tactive = 'order';
  }

  /**
     * __before action
     * @private
     */
  async __before() {
    await super.__before();
  }

  /**
     * index action
     * @return {Promise} []
     */
  async indexAction() {
    // auto render template file ad_index.htm
    // 搜索
    const map = {};
    if (this.get('keyword')) {
      map.name = ['like', '%' + this.get('keyword') + '%'];
    }
    const list = await this.model('wx_user').where(map).order('id DESC').page(this.get('page') || 1, 20).countSelect();
    const html = this.pagination(list);
    this.assign('list', list);
    this.assign('pagerData', html); // 分页展示使用
    this.meta_title = '小程序用户';
    return this.display();
  }
  async viewAction() {
    // auto render template file ad_page.htm
    // 搜索
    const id = await this.get('id');
    const data = await this.model('wx_user').find(id);
    this.assign('data', data);
    this.active = '/admin/job/index';
    this.meta_title = '查看用户信息';
    return this.display();
  }
};
