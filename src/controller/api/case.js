module.exports = class extends think.cmswing.app {
  /**
     * 获取首页数据
     * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
     */
  async indexAction() {
    const title = this.config('setupapp.APP_TITLE_CASE');
    let imgs = this.config('setupapp.SLIOB_APP_CASE');
    imgs = imgs.split(',');
    const imgUrls = [];
    for (let img of imgs) {
      img = await this.model('ext_attachment_pic').find(img);
      imgUrls.push(super.getHost() + img.path);
    }
    const serverList = await this.model('server').field(['id', 'title']).select();
    for (const server of serverList) {
      server.name = server.title;
    }
    return this.success({
      serverList: serverList,
      title: title,
      imgUrls: imgUrls
    });
  }
  /**
     * 获取案例数据
     * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
     */
  async listAction() {
    const map = {};
    if (this.get('server_id')) {
      map.server_id = ['like', '%' + this.get('server_id') + '%'];
    }
    const caseList = await this.model('case').field(['id', 'title', 'app_cover_img']).where(map).page(this.get('page') || 1, 10).countSelect();
    for (const c of caseList.data) {
      const img = await this.model('ext_attachment_pic').find(c.app_cover_img);
      c.imgUrl = super.getHost() + img.path;
    }
    return this.success({
      caseList: caseList
    });
  }
  /**
     * 获取案例详情
     */
  async viewAction() {
    const id = this.get('id');
    if (id == '') {
      return this.fail('id不能为空');
    }
    const news = await this.model('case').find(id);
    news.read_num = news.read_num + 1;
    await this.model('case').update(news);
    const caseDetail = {
      title: news.title,
      time: global.dateformat('Y-m-d', news.time * 1000),
      readNum: news.read_num
    };
    return this.success({
      caseDetail: caseDetail,
      content: news.content,
      title: this.config('setupapp.APP_TITLE_CASE_DETAIL')
    });
  }
};
