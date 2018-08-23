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
    map.show_type = ['in', '0,2'];
    if (this.get('keyword')) {
      map.name = ['like', '%' + this.get('keyword') + '%'];
    }
    const list = await this.model('server').where(map).order('id DESC').page(this.get('page') || 1, 20).countSelect();
    for (const server of list.data) {
      const img = await this.model('ext_attachment_pic').find(server.icon);
      server.icon = img.path;
    }
    const html = this.pagination(list);
    this.assign('list', list);
    this.assign('pagerData', html); // 分页展示使用
    this.meta_title = '公司业务服务';
    return this.display();
  }
  async indexwebAction() {
    // auto render template file ad_index.htm
    // 搜索
    const map = {};
    map.show_type = ['in', '0,1'];
    if (this.get('keyword')) {
      map.name = ['like', '%' + this.get('keyword') + '%'];
    }
    const list = await this.model('server').where(map).order('id DESC').page(this.get('page') || 1, 20).countSelect();
    for (const server of list.data) {
      const img = await this.model('ext_attachment_pic').find(server.icon);
      server.icon = img.path;
    }
    const html = this.pagination(list);
    this.assign('list', list);
    this.assign('pagerData', html); // 分页展示使用
    this.meta_title = '公司业务服务';
    this.tactive = 'article';
    return this.display();
  }
  async addAction() {
    // auto render template file ad_page.htm
    // 搜索
    if (this.isPost) {
      const data = this.post();
      const res = await this.model('server').add(data);
      if (res) {
        return this.success({name: '添加成功！', url: '/admin/server/index'});
      } else {
        return this.fail('添加失败！');
      }
    } else {
      this.active = '/admin/server/index';
      this.meta_title = '新增公司业务服务';
      await this.hook('adminUpPic', 'icon', '', {$hook_key: 'icon'});
      await this.hook('adminUpPic', 'background_image', '', {$hook_key: 'background_image'});
      await this.hook('adminEdit', 'content', '', {$hook_key: 'content'});
      return this.display();
    }
  }
  async editAction() {
    // auto render template file ad_page.htm
    // 搜索
    if (this.isPost) {
      const data = this.post();
      const res = await this.model('server').update(data);
      if (res) {
        return this.success({name: '修改成功！', url: '/admin/server/index'});
      } else {
        return this.fail('修改失败！');
      }
    } else {
      const id = await this.get('id');
      const server = await this.model('server').find(id);
      this.assign('server', server);
      this.active = '/admin/server/index';
      this.meta_title = '编辑公司业务服务';
      await this.hook('adminUpPic', 'icon', server.icon, {$hook_key: 'icon'});
      await this.hook('adminUpPic', 'background_image', server.background_image, {$hook_key: 'background_image'});
      await this.hook('adminEdit', 'content', server.content, {$hook_key: 'content'});
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
    await this.model('server').where({id: ['IN', ids]}).delete();
    return this.success({name: '删除成功!'});
  }
};
