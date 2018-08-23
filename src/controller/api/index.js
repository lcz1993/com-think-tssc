module.exports = class extends think.cmswing.app {
  /**
     * 获取首页数据
     * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
     */
  async indexAction() {
    const serverList = await this.model('server').where('show_type = 0 or show_type = 2').select();
    for (const server of serverList) {
      server.name = server.title;
      const img = await this.model('ext_attachment_pic').find(server.icon);
      server.imgurl = super.getHost() + img.path;
    }
    const advantages = this.config('setupapp.APP_HOME_ADVANTAGE');
    const advantageImgs = this.config('setupapp.APP_HOME_ADVANTAGE_IMG').split(',');
    const advantageList = [];
    for (let i = 0; i < advantageImgs.length; i++) {
      const a = {};
      a.name = advantages[i + 1];
      const img = await this.model('ext_attachment_pic').find(advantageImgs[i]);
      a.imgurl = super.getHost() + img.path;
      advantageList.push(a);
    }
    const arr = this.config('setupapp.APP_HOME_TITLE');
    const serverTitle = arr[1];
    const advantageTitle = arr[2];
    const liaisonTitle = arr[3];
    let imgs = this.config('setupapp.SLIOB_APP_HOME');
    imgs = imgs.split(',');
    const imgUrls = [];
    for (let img of imgs) {
      img = await this.model('ext_attachment_pic').find(img);
      imgUrls.push(super.getHost() + img.path);
    }
    const keyArr = this.config('setupapp.APP_HOME_LIAISON_KEY');
    const valueArr = this.config('setupapp.APP_HOME_LIAISON_VALUE');
    const liaison = [];
    for (const key in keyArr) {
      const a = {};
      a.key = keyArr[key];
      a.value = valueArr[key];
      liaison.push(a);
    }
    return this.success({
      serverList: serverList,
      advantageList: advantageList,
      liaison: liaison,
      imgUrls: imgUrls,
      serverTitle: serverTitle,
      advantageTitle: advantageTitle,
      liaisonTitle: liaisonTitle,
      title: this.config('setupapp.APP_TITLE_HOME')
    });
  }
};
