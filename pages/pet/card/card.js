const app = getApp()
Page({
  data: {
    spinShow:true,
    currentUser:null,
    petList: []
  },
  onLoad (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      currentUser: app.globalData.currentUser
    })
    this.queryPetEvt();
  },
  onReady () {
    // 页面渲染完成
    setTimeout(() => {
      this.setData({
        spinShow: false
      });
    }, 1000)
  },
  onShow () {
    // 页面显示
  },
  onHide () {
    // 页面隐藏
  },
  onUnload () {
    // 页面关闭
  },
  actionBackEvt() {
    wx.navigateBack();
  },
  addCard(){
    wx.navigateTo({
      url: '/pages/pet/insert/insert'
    })
  },
  // 查询萌宠卡
  queryPetEvt() {
    let params = {
      userId: this.data.currentUser.id
    }
    wx.request({
      method: "POST",
      url: app.globalData.urlMapping.POST_PET_QUERYPETALL,
      data: params,
      success: (res) => {
        console.log(res)
        if (res.data.code == "000") {
          let petList = res.data.model.map(item=>{
            item.homeDate = app.globalData.util.dateFormat("yyyy-MM-dd", item.homeDate)
            item.birthDate = app.globalData.util.getUserRegDay(app.globalData.util.dateFormat("yyyy-MM-dd", item.birthDate))
            return item
          })
          this.setData({
            petList
          })
        } else {
          console.log("查询所有萌宠卡失败");
        }
      },
      fail:(error)=>{

      },
      complete:()=>{

      }
    })
  },
  // 点击萌宠卡
  setStoragePet(event){
    let params = {
      id: event.currentTarget.dataset.pet.id
    }
    wx.request({
      method: "POST",
      url: app.globalData.urlMapping.POST_PET_QUERYPETBYID,
      data: params,
      success: (res) => {
        console.log(res)
        if (res.data.code == "000") {
          wx.setStorageSync('currentPet', res.data.model);
          app.globalData.currentPet = res.data.model;
          wx.switchTab({
            url: "/pages/index/pet/pet"
          })
        } else {
          console.log("查询萌宠卡失败");
        }
      },
      fail: (error) => {
        console.log("查询萌宠卡失败" + error);
      },
      complete: () => {

      }
    })

   
  }
  
    
})