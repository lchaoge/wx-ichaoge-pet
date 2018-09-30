const app = getApp()
Page({
  data: {
    spinShow: true,
    queryObj: {
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      pageCount: 20, // 共多少页
      count: 0, // 共多少条
      list: []
    },
    currentPet: null,
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad(options) {
    this.setData({
      currentPet: app.globalData.currentPet
    })
    this.countWidth();
    
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
    this.loadMore();
  },
  // 页面隐藏
  onHide() {
    
  },
  // 页面关闭
  onUnload() {
    
  },
  actionBackEvt() {
    wx.switchTab({
      url: '/pages/index/userinfo/userinfo'
    })
  },
  // 计算宽度
  countWidth(){
    let systemInfo = wx.getSystemInfoSync();
    this.setData({
      itemWidth:(systemInfo.windowWidth- 30) / 2
    })
  },
  // 写真集GIF分页
  loadMore(e) {
    if (this.data.queryObj.currentPage > this.data.queryObj.pageCount) {
      return false;
    }
    let params = {
      petId: this.data.currentPet.id,
      type:3,
      recommend:1,
      currentPage: this.data.queryObj.currentPage,
      pageSize: this.data.queryObj.pageSize
    }
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_PHOTOALBUM_QUERYALLPAGE,
      type: "POST",
      data: params
    }).then(res => {
      console.log(res)
      if (res.code == "000") {
        let currentPage = res.model.currentPage
        if (res.model.currentPage <= res.model.pageCount) {
          currentPage++;
        }
        if (res.model.data.length > 0) { // 判断是不是有数据
          let list = this.data.queryObj.list.concat(res.model.data)
          this.setData({
            "queryObj.currentPage": currentPage, // 当前页
            "queryObj.pageSize": res.model.pageSize, // 每页条数
            "queryObj.pageCount": res.model.pageCount, // 共多少页
            "queryObj.count": res.model.count, // 共多少条
            "queryObj.list": list
          })
        }
        // // 设置宽度
        // let windowWidth = wx.getSystemInfoSync().windowWidth / 3
        // this.setData({
        //   gridItemHeight: windowWidth + 'px'
        // })

      }
    }).catch(error => {
      console.log(error)
    })
  },
  detailEvt(e){
    let photoAlbumId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/pet/photoAlbumDetail/photoAlbumDetail?id=" + photoAlbumId,
    })
  },
  addPhotoAlbum(){
    wx.navigateTo({
      url: "/pages/common/gif/gif?type=3"
    })
  }


})