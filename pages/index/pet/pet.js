const app = getApp()
Page({
  data: {
    showLeft: false,
    spinShow: true,
    scrollTop:65,
    currentPet:null,
    queryObj:{
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      pageCount:10, // 共多少页
      count:0, // 共多少条
      list:[]
    },
    countObj:{
      photoAlnumCount:0 // 写真
    }
  },
  onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数
    
    this.setData({
      showLeft: false,
      spinShow: false
    });
    
    this.getCurrentPet();
    this.loadMore();
    this.queryCount();
  },
  onReady() {
    // 页面渲染完成
  },
  onShow() {
    // 页面显示
    this.setData({
      showLeft: false,
      spinShow: false
    });

    this.getCurrentPet();
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
  // 下拉刷新
  loadMore (e) {
    if (this.data.queryObj.currentPage > this.data.queryObj.pageCount){
      return false;
    }
    let params = {
      currentPage: this.data.queryObj.currentPage,
      pageSize: this.data.queryObj.pageSize
    }
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_USER_QUERYALLPAGE,
      type: "POST",
      data: params
    }).then(res => {
      console.log(res)
      if(res.code == "000"){
        let currentPage = res.model.currentPage
        if (res.model.currentPage <= res.model.pageCount){
          currentPage++;
        }
        if (res.model.data.length>0){ // 判断是不是有数据
          let list = this.data.queryObj.list.concat(res.model.data)
          this.setData({
            "queryObj.currentPage": currentPage, // 当前页
            "queryObj.pageSize": res.model.pageSize, // 每页条数
            "queryObj.pageCount": res.model.pageCount, // 共多少页
            "queryObj.count": res.model.count, // 共多少条
            "queryObj.list": list
          })
        }
      }
    }).catch(error => {
      console.log(error)
    })
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
  },
  // 进入写真集
  photoAlbumEvt(){
    wx.navigateTo({
      url: "/pages/pet/photoAlbum/photoAlbum",
    })
  },
  // 查询宠物的各个数据
  queryCount(){
    let params = {
      id:this.data.currentPet.id
    }
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_PET_QUERYCOUNT,
      type: "POST",
      data: params
    }).then(res => {
      console.log(res)
      if (res.code == "000") {
        this.setData({
          "countObj.photoAlnumCount": res.model.photoAlnumCount
        })
      }else{
        console.log(res)
      }
    }).catch(error => {
      console.log(error)
    })
  }

});
