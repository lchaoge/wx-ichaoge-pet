//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tabCurrent: 'tab2',
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
    ],
    src: '',
    spinShow: true
  },
  onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady() {
    // 页面渲染完成
    setTimeout(() => {
      this.setData({
        spinShow: false
      });
    }, 1000)
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面关闭
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
  }

})
