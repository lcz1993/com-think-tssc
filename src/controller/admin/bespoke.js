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
    if (this.get('is_adopt')) {
      map.is_adopt = ['=', this.get('is_adopt')];
    } else {
      map.is_adopt = ['=', 0];
    }
    if (this.get('keyword')) {
      map.name = ['like', '%' + this.get('keyword') + '%'];
    }
    const list = await this.model('server_order').where(map).order('id DESC').page(this.get('page') || 1, 20).countSelect();
    const html = this.pagination(list);
    this.assign('list', list);
    this.assign('pagerData', html); // 分页展示使用
    this.assign('is_adopt', this.get('is_adopt') ? this.get('is_adopt') : 0);
    this.meta_title = '服务预约';
    return this.display();
  }
  async editAction() {
    // auto render template file ad_page.htm
    // 搜索
    if (this.isPost) {
      const data = this.post();
      data.is_adopt = 1;
      data.adopt_time = Date.parse(new Date()) / 1000;
      const res = await this.model('server_order').update(data);
      const url = '/admin/bespoke/index';
      if (res) {
        this.redirect(url + '?error=0');
      } else {
        this.redirect(url + '?error=1');
      }
    } else {
      const id = await this.get('id');
      const data = await this.model('server_order').find(id);
      this.assign('data', data);
      this.active = '/admin/bespoke/index';
      this.meta_title = '服务预约受理';
      return this.display();
    }
  }
};
