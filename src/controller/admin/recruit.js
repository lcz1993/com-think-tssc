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
    this.tactive = 'server';
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
    const list = await this.model('recruit').where(map).order('id DESC').page(this.get('page') || 1, 20).countSelect();
    const html = this.pagination(list);
    this.assign('list', list);
    this.assign('pagerData', html); // 分页展示使用
    this.meta_title = '招聘信息';
    return this.display();
  }

  async addAction() {
    // auto render template file ad_page.htm
    // 搜索
    if (this.isPost) {
      const data = this.post();
      data.time = Date.parse(new Date()) / 1000;
      const res = await this.model('recruit').add(data);
      if (res) {
        return this.success({name: '添加成功！', url: '/admin/recruit/index'});
      } else {
        return this.fail('添加失败！');
      }
    } else {
      this.active = '/admin/recruit/index';
      this.meta_title = '新增招聘';
      await this.hook('adminEdit', 'content', '', {$hook_key: 'content'});
      return this.display();
    }
  }
  async editAction() {
    // auto render template file ad_page.htm
    // 搜索
    if (this.isPost) {
      const data = this.post();
      const res = await this.model('recruit').update(data);
      if (res) {
        return this.success({name: '修改成功！', url: '/admin/recruit/index'});
      } else {
        return this.fail('修改失败！');
      }
    } else {
      const id = await this.get('id');
      const recruit = await this.model('recruit').find(id);
      this.assign('data', recruit);
      this.active = '/admin/recruit/index';
      this.meta_title = '编辑招聘信息';
      await this.hook('adminEdit', 'content', recruit.content, {$hook_key: 'content'});
      return this.display();
    }
  }
  /**
     * 删除话题
     */
  async delAction() {
    const ids = this.para('ids');
    if (think.isEmpty(ids)) {
      return this.fail('参数不能为空!');
    }
    // 删除话题
    await this.model('recruit').where({id: ['IN', ids]}).delete();
    return this.success({name: '删除成功!'});
  }
};
