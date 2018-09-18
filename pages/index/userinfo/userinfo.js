//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tabbarKey: 'userinfo',
    spinShow: true,
    currentUser:null,
    petList:[]
  },
  onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let isLogin = wx.getStorageSync('currentUser') != null
    if (isLogin) {
      // 已登录
      app.globalData.currentUser = wx.getStorageSync('currentUser');
      app.globalData.currentPet = wx.getStorageSync('currentPet');
      this.setData({
        currentUser: wx.getStorageSync('currentUser')
      })
    }
    this.queryPetEvt();
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
  tabbarEvt({ detail }) {
    wx.navigateTo({
      url: '../' + detail.key + '/' + detail.key
    });
  },
  // 获取用户登录信息
  getUserInfo(){
    app.getUserInfo(true,(currentUser)=>{
      this.setData({
        currentUser
      });
    });
  },
  // 增加萌宠
  insertPet(){
    wx.navigateTo({
      url: '/pages/pet/card/card',
    })
  },
  // 查询萌宠卡
  queryPetEvt(){
    let params = {
      userId: app.globalData.currentUser.id
    }
    wx.request({
      method: "POST",
      url: app.globalData.urlMapping.POST_PET_QUERYPETALL,
      data: params,
      success: (res) => {
        console.log(res)
        if (res.data.code == "000") {
          this.setData({
            petList: res.data.model
          })
        } else {
          console.log("查询所有萌宠卡失败");
        }
      }
    })
  }
 
})
