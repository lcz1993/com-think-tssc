// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015-2115 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: arterli <arterli@qq.com>
// +----------------------------------------------------------------------
module.exports = class extends think.cmswing.center {
  /**
     * __before action
     * @private
     */
  async __before() {
    await super.__before();
    const icon = this.config('setupweb.WEB_LOGO_ICO');
    let iconLogo;
    if (icon) {
      iconLogo = await this.model('ext_attachment_pic').find(icon);
      iconLogo = iconLogo.path;
    }
    this.assign('iconLogo', iconLogo);
    const logo = this.config('setupweb.WEB_LOGO');
    let logo_;
    if (logo) {
      logo_ = await this.model('ext_attachment_pic').find(logo);
      logo_ = logo_.path;
    }
    this.assign('logo', logo_);
    const navigation = this.config('setupweb.SETUP_WEB_NAVIGATION');
    const navigationUrl = this.config('setupweb.SETUP_WEB_ROUTER');
    const navigationList = [];
    for (const item in navigation) {
      const a = {};
      a.name = navigation[item];
      a.url = navigationUrl[item];
      navigationList.push(a);
    }
    this.assign('navigationList', navigationList);
    const copyright = this.config('setupweb.SETUP_WEB_BOTTOM');
    const record = this.config('setupweb.SETUP_WEB_RECORD');
    this.assign('copyright', copyright);
    this.assign('record', record);
    const encodeImg = await this.model('ext_attachment_pic').find(this.config('setupweb.WEB_RECORD'));
    this.assign('encodeImg', encodeImg.path);
    this.assign('title', this.config('setupweb.TSSC_INDEX_TITLE'));
    this.assign('leftTitle', this.config('setupweb.SETUP_WEB_FOOTER'));
    this.assign('rightTitle', this.config('setupweb.SETUP_WEB_FOOTER_LOOK'));
    const left = this.config('setupweb.TALK_CONTENT_LEFT');
    const right = this.config('setupweb.TALK_CONTENT_RIGHT');
    const talkList = [];
    for (const item in left) {
      const a = {};
      a.left = left[item];
      a.right = right[item];
      talkList.push(a);
    }
    this.assign('talkList', talkList);
  }
  /**
     * index action
     * @return {Promise} []
     */
  async indexAction() {
    let url = this.ctx.url;
    url = url.split('?')[0];
    url = url.split('/');
    url = url[url.length - 1];
    const title = this.config('setupweb.WEB_INDEX_PAGE_TITLE');
    const content = this.config('setupweb.WEB_INDEX_PAGE_CONTENT');
    const img = this.config('setupweb.WEB_INDEX_PAGE_IMG');
    let imgUrl;
    if (img) {
      imgUrl = await this.model('ext_attachment_pic').find(img);
      imgUrl = imgUrl.path;
    }
    const imgBottom = this.config('setupweb.WEB_INDEX_BOTTOM_IMG');
    let imgBottomUrl;
    if (imgBottom) {
      imgBottomUrl = await this.model('ext_attachment_pic').find(imgBottom);
      imgBottomUrl = imgBottomUrl.path;
    }
    const data = {
      url: url,
      title: title,
      content: content,
      imgUrl: imgUrl,
      imgBottomUrl: imgBottomUrl
    };
    this.assign('data', data);
    const serverList = await this.model('server').where('show_type = 0 or show_type = 1').field(['id', 'title', 'title_eng', 'desc', 'background_image']).select();
    for (const server of serverList) {
      server.name = server.title;
      const img = await this.model('ext_attachment_pic').find(server.background_image);
      server.imgurl = img.path;
    }
    this.assign('serverList', serverList);
    let bc_imgs = this.config('setupweb.INDEX_PAGE_IMAGE');
    bc_imgs = bc_imgs.split(',');
    const imgList = [];
    for (let a of bc_imgs) {
      if (a) {
        a = await this.model('ext_attachment_pic').find(a);
        imgList.push(a.path);
      }
    }
    const introduction = {
      page3: {
        title: this.config('setupweb.INDEX_PAGE3_TITLE')[1],
        title_eng: this.config('setupweb.INDEX_PAGE3_TITLE')[2],
        desc: this.config('setupweb.INDEX_PAGE3_DESC'),
        content_iden: 'INDEX_PAGE3_CONTENT',
        bc_img: imgList[0]
      },
      page4: {
        title: this.config('setupweb.INDEX_PAGE3_TITLE')[1],
        title_eng: this.config('setupweb.INDEX_PAGE3_TITLE')[2],
        desc: this.config('setupweb.INDEX_PAGE3_DESC'),
        content_iden: 'INDEX_PAGE3_CONTENT',
        bc_img: imgList[1]
      },
      page5: {
        title: this.config('setupweb.INDEX_PAGE3_TITLE')[1],
        title_eng: this.config('setupweb.INDEX_PAGE3_TITLE')[2],
        desc: this.config('setupweb.INDEX_PAGE3_DESC'),
        content_iden: 'INDEX_PAGE3_CONTENT',
        bc_img: imgList[2]
      },
      page6: {
        bc_img: imgList[3]
      }
    };
    this.assign('introduction', introduction);
    return this.display();
  }
  async caseAction() {
    let url = this.ctx.url;
    url = url.split('?')[0];
    url = url.split('/');
    url = url[url.length - 1];
    const data = {
      url: url
    };
    this.assign('data', data);
    const serverList = await this.model('server').where('show_type = 0 or show_type = 1').field(['id', 'title', 'title_eng', 'desc', 'background_image']).select();
    for (const server of serverList) {
      if (server.id == this.get('server_id')) {
        server.active = 'active';
      }
      server.name = server.title;
    }
    this.assign('serverList', serverList);
    if (this.get('server_id')) {
      this.assign('server_id', this.get('server_id'));
    }
    const map = {};
    if (this.get('server_id')) {
      map.server_id = ['like', '%' + this.post('server_id') + '%'];
    }
    const list = await this.model('case').where(map).order('id DESC').page(this.post('page') || 1, 10).countSelect();
    const d = list.data;
    for (const item of d) {
      if (item.web_cover_img) {
        const a = await this.model('ext_attachment_pic').find(item.web_cover_img);
        item.imgUrl = a.path;
      }
    }
    this.assign('caseList', d);
    return this.display();
  }
  async caseListAction() {
    const map = {};
    if (this.post('server_id')) {
      map.server_id = ['like', '%' + this.post('server_id') + '%'];
    }
    const list = await this.model('case').where(map).order('id DESC').page(this.post('page') || 1, 10).countSelect();
    const data = list.data;
    for (const item of data) {
      if (item.web_cover_img) {
        const a = await this.model('ext_attachment_pic').find(item.web_cover_img);
        item.imgUrl = a.path;
      }
    }
    this.success(list);
  }
  async teamAction() {
    let url = this.ctx.url;
    url = url.split('?')[0];
    url = url.split('/');
    url = url[url.length - 1];
    const team = this.config('setupweb.WEB_TEAM_TITLE');
    const data = {
      url: url,
      team: team
    };
    this.assign('data', data);
    const peopleList = await this.model('people').field(['id', 'image']).select();
    for (const item of peopleList) {
      if (item.image) {
        const a = await this.model('ext_attachment_pic').find(item.image);
        item.imgUrl = a.path;
      }
    }
    this.assign('peopleList', peopleList);
    const people = await this.model('people').find(peopleList[0].id);
    const a = await this.model('ext_attachment_pic').find(people.image);
    people.imgUrl = a.path;
    this.assign('people', people);
    return this.display();
  }
  async peopleAction() {
    const id = this.get('id');
    const people = await this.model('people').find(id);
    const a = await this.model('ext_attachment_pic').find(people.image);
    people.imgUrl = a.path;
    return this.success(people);
  }
  async aboutAction() {
    let url = this.ctx.url;
    url = url.split('?')[0];
    url = url.split('/');
    url = url[url.length - 1];
    let logoImgUrl = this.config('setupweb.WEB_ABOUT_LOGO');
    if (logoImgUrl) {
      logoImgUrl = await this.model('ext_attachment_pic').find(logoImgUrl);
      logoImgUrl = logoImgUrl.path;
    }
    const aboutTopTitle = this.config('setupweb.WEB_ABOUT_TITLE')[1];
    const aboutTopContent = this.config('setupweb.WEB_ABOUT_TITLE')[2];
    const img = this.config('setupweb.WEB_INDEX_PAGE_IMG');
    let imgUrl;
    if (img) {
      imgUrl = await this.model('ext_attachment_pic').find(img);
      imgUrl = imgUrl.path;
    }
    const c = this.config('setupweb.WEB_ABOUT_IDEA_CONTENT');
    const aboutIdeaTitleContent = [];
    for (const item in c) {
      aboutIdeaTitleContent.push(c[item]);
    }
    const adva = this.config('setupweb.WEB_ABOUT_ADVA_CONTENT');
    const advaImg = this.config('setupweb.WEB_ABOUT_ADVA_IMGS').split(',');
    const advaList = [];
    for (let i = 0; i < advaImg.length; i++) {
      const a = {};
      a.name = adva[i + 1];
      if (advaImg[i]) {
        const imgUrl = await this.model('ext_attachment_pic').find(advaImg[i]);
        a.imgUrl = imgUrl.path;
      }
      advaList.push(a);
    }
    const data = {
      url: url,
      logoImgUrl: logoImgUrl,
      aboutTopTitle: aboutTopTitle,
      aboutTopContent: aboutTopContent,
      imgUrl: imgUrl,
      aboutPageIntroduction: this.config('setupweb.WEB_ABOUT_INTRODUCTION')[1],
      aboutPageIntroductionEng: this.config('setupweb.WEB_ABOUT_INTRODUCTION')[2],
      aboutPageIntroductionContent: this.config('setupweb.WEB_ABOUT_INTRODUCTION_CONTENT'),
      aboutIdeaTitle: this.config('setupweb.WEB_ABOUT_IDEA')[1],
      aboutIdeaTitleEng: this.config('setupweb.WEB_ABOUT_IDEA')[2],
      aboutIdeaTitleContent: aboutIdeaTitleContent,
      aboutAdvaTitle: this.config('setupweb.WEB_ABOUT_ADVA_TITLE')[1],
      aboutAdvaTitleEng: this.config('setupweb.WEB_ABOUT_ADVA_TITLE')[2],
      advaList: advaList
    };
    this.assign('data', data);
    return this.display();
  }
  async talkAction() {
    let url = this.ctx.url;
    url = url.split('?')[0];
    url = url.split('/');
    url = url[url.length - 1];

    const data = {
      url: url,
      talkTitle: this.config('setupweb.WEB_TALK_PAGE_TITLE')[1],
      talkTitleEng: this.config('setupweb.WEB_TALK_PAGE_TITLE')[2],
      title: this.config('setupweb.WEB_INDEX_PAGE_TITLE')
    };
    this.assign('data', data);
    return this.display();
  }
  async integrationAction() {
    const img = this.config('setupweb.WEB_INDEX_PAGE_IMG');
    let imgUrl;
    if (img) {
      imgUrl = await this.model('ext_attachment_pic').find(img);
      imgUrl = imgUrl.path;
    }
    const msg = this.get('msg');
    const content = this.config('setupweb.' + msg);
    let m = msg.split('_');
    m = m[0] + '_' + m[1];
    const data = {
      imgUrl: imgUrl,
      content: content,
      title: this.config('setupweb.' + m + '_TITLE')[1],
      titleEng: this.config('setupweb.' + m + '_TITLE')[2],
      desc: this.config('setupweb.' + m + '_DESC')
    };
    this.assign('data', data);
    return this.display();
  }
  async caseDetailAction() {
    const img = this.config('setupweb.WEB_INDEX_PAGE_IMG');
    let imgUrl;
    if (img) {
      imgUrl = await this.model('ext_attachment_pic').find(img);
      imgUrl = imgUrl.path;
    }
    const id = this.get('id');
    const detail = await this.model('case').find(id);
    const content = detail.content;
    console.log(content);
    const a = await this.hook('pageContent', 'content', content, {$hook_type: '2_1_300'});
    console.log('a' + a);
    this.assign('detail', detail);
    // await this.hook('adminEdit', 'content', server.content, {$hook_key: 'content'});
    const data = {
      imgUrl: imgUrl
    };
    this.assign('data', data);
    return this.display();
  }
};
