module.exports = class extends think.cmswing.app {
  /**
     * 获取服务详情
     * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
     */
  async viewAction() {
    const id = this.get('id');
    const server = await this.model('server').find(id);
    return this.success({
      server: server,
      title: this.config('setupapp.APP_SERVER_TOP')
    });
  }

  /**
     * 获取服务预约相关信息
     */
  async orderAction() {
    let imgs = this.config('setupapp.SLIOB_APP_HOLD');
    imgs = imgs.split(',');
    const imgUrls = [];
    for (let img of imgs) {
      if (img) {
        img = await this.model('ext_attachment_pic').find(img);
        imgUrls.push(super.getHost() + img.path);
      }
    }
    return this.success({
      imgUrls: imgUrls,
      title: this.config('setupapp.APP_TITLE_SERVER')
    });
  }

  /**
     * 提交服务预约
     */
  async addAction() {
    const name = this.post('name');
    const tel = this.post('tel');
    const company = this.post('company');
    const order = {
      name: name,
      tel: tel,
      company: company,
      create_time: super.getTime()
    };
    const res = await this.model('server_order').add(order);
    if (res) {
      return this.success(res);
    } else {
      return this.fail(res);
    }
  }
};
