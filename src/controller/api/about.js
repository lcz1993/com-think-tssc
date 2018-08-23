module.exports = class extends think.cmswing.app {
  /**
     * 获取首页数据
     * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
     */
  async indexAction() {
    let imgs = this.config('setupapp.SLIOB_APP_ABOUT');
    imgs = imgs.split(',');
    const imgUrls = [];
    for (let img of imgs) {
      img = await this.model('ext_attachment_pic').find(img);
      imgUrls.push(super.getHost() + img.path);
    }
    const aboutOurTitle = this.config('setupapp.APP_ABOUT_TOP');
    const addOurTitle = this.config('setupapp.APP_ADDOUR_TOP');
    const companyName = this.config('setupapp.APP_ABOUT_TITLE');
    const companyContent = this.config('setupapp.APP_ABOUT_CONTENT');
    const recruitTitle = this.config('setupapp.APP_ADDOUR_TITLE');
    const teamTitle = this.config('setupapp.APP_TEAM_TITLE');
    const recruitList = await this.model('recruit').field(['id', 'title', 'time', 'pay', 'edu', 'number']).select();
    for (const recruit of recruitList) {
      recruit.name = recruit.title;
      recruit.num = recruit.number;
      recruit.time = global.dateformat('Y-m-d', recruit.time * 1000);
    }
    const teamList = await this.model('team').field(['id', 'name', 'app_cover_img']).select();
    for (const team of teamList) {
      if (team.app_cover_img) {
        const img = await this.model('ext_attachment_pic').find(team.app_cover_img);
        team.imgUrl = super.getHost() + img.path;
      }
    }
    return this.success({
      imgUrls: imgUrls,
      aboutOurTitle: aboutOurTitle,
      addOurTitle: addOurTitle,
      recruitList: recruitList,
      teamList: teamList,
      recruitTitle: recruitTitle,
      teamTitle: teamTitle,
      companyName: companyName,
      companyContent: companyContent,
      title: this.config('setupapp.APP_TITLE_ABOUT')
    });
  }
  /**
     * 获取案例详情
     */
  async teamViewAction() {
    const id = this.get('id');
    if (id == '') {
      return this.fail('id不能为空');
    }
    const team = await this.model('team').find(id);
    return this.success({
      teamName: team.name,
      content: team.content,
      title: this.config('setupapp.APP_TITLE_TEAM')
    });
  }
  /**
     * 获取招聘详情
     */
  async recruitViewAction() {
    const id = this.get('id');
    if (id == '') {
      return this.fail('id不能为空');
    }
    const recruit = await this.model('recruit').find(id);
    const recruitDetail = {
      title: recruit.title,
      time: global.dateformat('Y-m-d', recruit.time * 1000),
      edu: recruit.edu,
      pay: recruit.pay,
      id: recruit.id
    };
    return this.success({
      recruitDetail: recruitDetail,
      content: recruit.content,
      title: this.config('setupapp.APP_TITLE_RECRUIT')
    });
  }

  /**
     * 添加招聘信息
     */
  async addAction() {
    const name = this.post('name');
    const year = this.post('year');
    const tel = this.post('tel');
    const adv = this.post('adv');
    const recruit_id = this.post('recruit_id');
    const userInfo = this.post('userInfo');
    const recruit = {
      name: name,
      recruit_id: recruit_id,
      year_work: year,
      tel: tel,
      desc: adv,
      create_time: super.getTime(),
      is_adopt: 0,
      wx_user_id: userInfo.id
    };
    const res = await this.model('recruit_user').add(recruit);
    if (res) {
      return this.success(res);
    } else {
      return this.fail(res);
    }
  }
};
