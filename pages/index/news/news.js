//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tabbarKey: 'news',
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
    // this.queryAllPage()
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
  queryAllPage(){
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_USER_QUERYALLPAGE,
      type:"POST",
      data:{
        currentPage:1,
        pageSize:20
      }
    }).then(res=>{
      console.log(res)
    }).catch(error=>{
      console.log(error)
    })
  }
  
})
