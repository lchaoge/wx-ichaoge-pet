//index.js
//获取应用实例
const app = getApp()
const { $Message } = require('../../../dist/base/index');

Page({
  data: {
    tabCurrent: 'tab2',
    imgUrls: [
      './images/banner1.png',
      './images/banner2.png',
      './images/banner3.png',
      './images/banner4.png',
      './images/banner5.png',
      './images/banner6.png'
    ],
    userUrls:[
      './images/1.png',
      './images/2.png',
      './images/3.png'
    ],
    src: '',
    spinShow: true,
    loginModal:{
      visible: false,
      actions: [
        {
          name: '取消'
        },
        {
          name: '确认',
          color: '#1AAD16',
          loading: false
        }
      ]
    }
    
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad(options) {
    
    let isLogin = wx.getStorageSync('currentUser')!="";
    if (isLogin){
      // 已登录
      app.globalData.currentUser = wx.getStorageSync('currentUser');
      let params = {
        id: app.globalData.currentUser.id
      }
      app.getCurrentPet(params,(res)=>{
        if (res.code == "000"){
          app.globalData.currentUser = res.model.currentUser;
          app.globalData.currentPet = res.model.currentPet;
          wx.setStorageSync("currentUser", res.model.currentUser);
          wx.setStorageSync("currentPet", res.model.currentPet);
        }
      })
    }
    this.setData({
      "loginModal.visible": !isLogin
    });
  },
  // 页面渲染完成
  onReady() {
    
    setTimeout(() => {
      this.setData({
        spinShow: false
      });
    }, 1000)
  },
  // 页面显示
  onShow() {
    
  },
  // 页面隐藏
  onHide() {
    
  },
  // 页面关闭
  onUnload() {
    
  },
  tabItemEvt(e){
    this.setData({
      tabCurrent: e.currentTarget.dataset.index
    });
  },
  searchEvt(){
    wx.navigateTo({
      url: '../../common/search/search',
    })
  },
  myVideoPlayEvt(e){
    wx.navigateTo({
      url: '../../common/video/video?src=' + e.currentTarget.dataset.videourl,
    })
  },
  loginModalClick({ detail }) {
    if (detail.index === 0) {
      this.setData({
        "loginModal.visible": false
      });
    } else {
      const action = [...this.data.loginModal.actions];
      action[1].loading = true;

      this.setData({
        "loginModal.actions": action
      });

      setTimeout(() => {
        action[1].loading = false;
        this.setData({
          "loginModal.visible": false,
          "loginModal.actions": action
        });
        app.loginUser()
      }, 2000);
    }
  },
  navigateToEvt(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }

})
