//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tabbarKey: 'userinfo'
  },
  onLoad() {
  
  },
  tabbarEvt({ detail }) {
    wx.navigateTo({
      url: '../' + detail.key + '/' + detail.key
    });
  }
 
})
