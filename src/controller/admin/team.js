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
    const list = await this.model('team').where(map).order('id DESC').page(this.get('page') || 1, 20).countSelect();
    for (const team of list.data) {
      const img = await this.model('ext_attachment_pic').find(team.app_cover_img);
      const img1 = await this.model('ext_attachment_pic').find(team.web_cover_img);
      team.app_cover_img = img.path;
      team.web_cover_img = img1.path;
    }
    const html = this.pagination(list);
    this.assign('list', list);
    this.assign('pagerData', html); // 分页展示使用
    this.meta_title = '公司团队';
    return this.display();
  }

  async addAction() {
    // auto render template file ad_page.htm
    // 搜索
    if (this.isPost) {
      const data = this.post();
      data.time = Date.parse(new Date()) / 1000;
      data.read_num = 0;
      const res = await this.model('team').add(data);
      if (res) {
        return this.success({name: '添加成功！', url: '/admin/team/index'});
      } else {
        return this.fail('添加失败！');
      }
    } else {
      this.active = '/admin/team/index';
      this.meta_title = '新增团队';
      await this.hook('adminEdit', 'content', '', {$hook_key: 'content'});
      await this.hook('adminUpPic', 'app_cover_img', '', {$hook_key: 'app_cover_img'});
      await this.hook('adminUpPic', 'web_cover_img', '', {$hook_key: 'web_cover_img'});
      return this.display();
    }
  }
  async editAction() {
    // auto render template file ad_page.htm
    // 搜索
    if (this.isPost) {
      const data = this.post();
      const date = new Date(data.time);
      data.time = Date.parse(date) / 1000;
      const res = await this.model('team').update(data);
      if (res) {
        return this.success({name: '修改成功！', url: '/admin/team/index'});
      } else {
        return this.fail('修改失败！');
      }
    } else {
      const id = await this.get('id');
      const data = await this.model('team').find(id);
      data.time = global.dateformat('Y-m-d H:i:s', data.time*1000);
      this.assign('data', data);
      this.active = '/admin/team/index';
      this.meta_title = '编辑团队';
      await this.hook('adminEdit', 'content', data.content, {$hook_key: 'content'});
      await this.hook('adminUpPic', 'app_cover_img', data.app_cover_img, {$hook_key: 'app_cover_img'});
      await this.hook('adminUpPic', 'web_cover_img', data.web_cover_img, {$hook_key: 'web_cover_img'});
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
    await this.model('team').where({id: ['IN', ids]}).delete();
    return this.success({name: '删除成功!'});
  }
};
