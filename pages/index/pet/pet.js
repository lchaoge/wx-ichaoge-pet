const app = getApp()
Page({
  data: {
    showLeft: false,
    spinShow: true,
    scrollTop:65,
    currentPet:null
  },
  onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getCurrentPet();
  },
  onReady() {
    // 页面渲染完成
    this.setData({
      showLeft: false,
      spinShow: false
    });
  },
  onShow() {
    this.setData({
      showLeft: false,
      spinShow: false
    });
    this.getCurrentPet();
    // 页面显示
  },
  onHide() {
    // 页面隐藏
    this.setData({
      showLeft: false,
      spinShow: true
    });
  },
  onUnload() {
    // 页面关闭
    this.setData({
      showLeft: false,
      spinShow: true
    });
  },
  toggleMore() {
    this.setData({
      showLeft: !this.data.showLeft
    });
  },
  cardEvt(){
    wx.navigateTo({
      url: '/pages/pet/card/card'      
    })
  },
  upper: function (e) {
    wx.showLoading({
      mask: true,
      title: '首次加载中'
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  lower: function (e) {
    wx.showLoading({
      mask: true,
      title: '上拉加载中'
    })

    setTimeout(function(){
      wx.hideLoading()
    },2000)
  },
  getCurrentPet(){
    // 获取本地宠物
    let currentPet = wx.getStorageSync('currentPet');
    if (currentPet) {
      currentPet.birthDate = app.globalData.util.getUserRegDay(currentPet.birthDate);
      currentPet.homeDate = app.globalData.util.dateFormat("yyyy-MM-dd", currentPet.homeDate);
      app.globalData.currentPet = currentPet;
      this.setData({
        currentPet
      })
    }
  }

});
