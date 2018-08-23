module.exports = class extends think.cmswing.app {
  /**
     * 获取首页数据
     * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
     */
  async indexAction() {
    const a = this.config('setupapp.APP_HOME_NEWS_SAYING');
    const title = this.config('setupapp.APP_HOME_NEWS_TITLE');
    const companyTrends = [];
    for (const key in a) {
      companyTrends.push(a[key]);
    }
    let imgs = this.config('setupapp.SLIOB_APP_NEWS');
    imgs = imgs.split(',');
    const imgUrls = [];
    for (let img of imgs) {
      img = await this.model('ext_attachment_pic').find(img);
      imgUrls.push(super.getHost() + img.path);
    }
    return this.success({
      companyTrends: companyTrends,
      title: title,
      imgUrls: imgUrls
    });
  }
  /**
     * 获取资讯数据
     * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
     */
  async listAction() {
    const newsList = await this.model('news').field(['id', 'title', 'app_cover_img', 'desc', 'time']).page(this.get('page') || 1, 10).countSelect();
    for (const news of newsList.data) {
      let date = global.dateformat('Y-m-d', news.time * 1000);
      date = date.split('-');
      news.day = date[2];
      news.year = date[0];
      news.month = date[1];
      const img = await this.model('ext_attachment_pic').find(news.app_cover_img);
      news.imgUrl = super.getHost() + img.path;
    }
    return this.success({
      newsList: newsList
    });
  }

  /**
     * 获取资讯详情
     */
  async viewAction() {
    const id = this.get('id');
    if (id == '') {
      return this.fail('id不能为空');
    }
    const news = await this.model('news').find(id);
    news.read_num = news.read_num + 1;
    await this.model('news').update(news);
    const newsDetail = {
      title: news.title,
      time: global.dateformat('Y-m-d', news.time * 1000),
      readNum: news.read_num
    };
    return this.success({
      newsDetail: newsDetail,
      content: news.content,
      title: this.config('setupapp.APP_TITLE_NEWS_DETAIL')
    });
  }
};
