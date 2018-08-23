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
    const list = await this.model('case').where(map).order('id DESC').page(this.get('page') || 1, 20).countSelect();
    for (const server of list.data) {
      const img = await this.model('ext_attachment_pic').find(server.app_cover_img);
      const img1 = await this.model('ext_attachment_pic').find(server.web_cover_img);
      server.app_cover_img = img.path;
      server.web_cover_img = img1.path;
      server.time = parseInt(server.time) * 1000;
      let servers = '';
      if (server.server_id) {
        servers = server.server_id.split(',');
      }
      let s = '';
      for (const i of servers) {
        const a = await this.model('server').find(parseInt(i));
        if (JSON.stringify(a) != '{}') {
          s += a.title + ',';
        }
      }
      server.server_id = s;
    }
    const html = this.pagination(list);
    this.assign('list', list);
    this.assign('pagerData', html); // 分页展示使用
    const serverList = await this.model('server').select();
    this.assign('serverList', serverList);
    this.meta_title = '服务案例';
    return this.display();
  }

  async addAction() {
    // auto render template file ad_page.htm
    // 搜索
    if (this.isPost) {
      const data = this.post();
      if (think.isArray(data.server_id)) {
        data.server_id = data.server_id.join(',');
      }
      data.time = Date.parse(new Date()) / 1000;
      data.read_num = 0;
      const res = await this.model('case').add(data);
      if (res) {
        return this.success({name: '添加成功！', url: '/admin/case/index'});
      } else {
        return this.fail('添加失败！');
      }
    } else {
      this.active = '/admin/case/index';
      this.meta_title = '新增服务案例';
      await this.hook('adminEdit', 'content', '', {$hook_key: 'content'});
      await this.hook('adminUpPic', 'app_cover_img', '', {$hook_key: 'app_cover_img'});
      await this.hook('adminUpPic', 'web_cover_img', '', {$hook_key: 'web_cover_img'});
      const serverList = await this.model('server').select();
      this.assign('serverList', serverList);
      return this.display();
    }
  }
  async editAction() {
    // auto render template file ad_page.htm
    // 搜索
    if (this.isPost) {
      const data = this.post();
      if (think.isArray(data.server_id)) {
        data.server_id = data.server_id.join(',');
      }
      const res = await this.model('case').update(data);
      if (res) {
        return this.success({name: '修改成功！', url: '/admin/case/index'});
      } else {
        return this.fail('修改失败！');
      }
    } else {
      const id = await this.get('id');
      const server = await this.model('case').find(id);
      this.assign('case', server);
      this.active = '/admin/case/index';
      this.meta_title = '编辑服务案例';
      await this.hook('adminEdit', 'content', server.content, {$hook_key: 'content'});
      await this.hook('adminUpPic', 'app_cover_img', server.app_cover_img, {$hook_key: 'app_cover_img'});
      await this.hook('adminUpPic', 'web_cover_img', server.web_cover_img, {$hook_key: 'web_cover_img'});
      const serverList = await this.model('server').select();
      const str = server.server_id;
      if (str) {
        server.server_id = str.split(',');
        for (const item of serverList) {
          for (const i of server.server_id) {
            if (parseInt(i) == item.id) {
              item.check = 0;
            }
          }
        }
      }
      this.assign('serverList', serverList);
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
    await this.model('case').where({id: ['IN', ids]}).delete();
    return this.success({name: '删除成功!'});
  }
};
