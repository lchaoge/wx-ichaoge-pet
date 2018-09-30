const app = getApp()
Page({
  data: {
    photoAlbum:{
      petId:"",
      content: "", // 内容
      type: "", // 类型：1=图片，0=视频
      recordDate: "", // 记录时间
      recommend: "1", // 允许被推荐  1: 允许，0: 不允许
      photoAlbumImageList:[],
      labelSortList:[],
    },
    queryObj: {
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      pageCount: 20, // 共多少页
      count: 0, // 共多少条
      list: []
    },
    spinShow:true,
    currentPet:null,
    actionSheet:{
      visible:false,
      actions: [
        {
          name: '上传照片',
        },
        {
          name: '上传视频'
        }
      ]
    },
    gridItemHeight:"100px"
  },
  onLoad (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      currentPet: app.globalData.currentPet
    })
    // 允许转发
    wx.showShareMenu({
      withShareTicket: true
    })
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

    this.loadMore();
    // 允许转发
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onHide () {
    // 页面隐藏
  },
  onUnload () {
    // 页面关闭
  },
  actionBackEvt() {
    wx.switchTab({
      url: "/pages/index/pet/pet",
    })
  },
  // 转发
  onShareAppMessage(res) {
    let currentPet = wx.getStorageSync("currentPet");
    return {
      title: currentPet.nickname + '的写真集',
    }
  },
  // 写真集
  loadMore(e) {
    if (this.data.queryObj.currentPage > this.data.queryObj.pageCount) {
      return false;
    }
    let params = {
      petId: this.data.currentPet.id,
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
        // 设置宽度
        let windowWidth = wx.getSystemInfoSync().windowWidth/3
        this.setData({    
          gridItemHeight: windowWidth + 'px'  
        })    
     
      }
    }).catch(error => {
      console.log(error)
    })
  },
  // 关闭添加写真
  actionSheetCancelEvt(){
    this.setData({
      "actionSheet.visible": false
    })
  },
  // 添加写真
  addPhotoAlbum(){
    this.setData({
      "actionSheet.visible": true
    })
  },
  // 添加写真
  actionSheetEvt(e){
    if (e.detail.index == 0){
      // 上传图片
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          console.log(res);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          this.uploadFile(res.tempFilePaths, 1);
        },
        fail: (error) => {
          console.log("选择图片失败：" + error);
        },
        complete: () => {
          
        }
      })
    }else if(e.detail.index == 1){
      // 上传视频
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success:(res)=>{
          console.log(res);
          let fileList = [];
          fileList.push(res.tempFilePath)
          this.uploadFile(fileList,2);
        },
        fail: (error) => {
          console.log("选择视频失败：" + error);
        },
        complete:()=>{
        
        }
      })
    }
    
  },
  /**
   * 上传图片或视频到服务器
   * 返回服务器路径
   * @type 类型：1=图片，2=视频,3=GIF
   */
  uploadFile(fileList, type){
    this.setData({
      "photoAlbum.type":type,
      "photoAlbum.petId":app.globalData.currentPet.id,
      "photoAlbum.photoAlbumImageList": fileList
    })
    // 跳入新增页
    this.setData({
      "actionSheet.visible": false
    })
    let photoAlbum = JSON.stringify(this.data.photoAlbum);
    wx.navigateTo({
      url: "/pages/pet/insertPhotoAlbum/insertPhotoAlbum?params=" + photoAlbum,
    })
    
  },
  // 进入详情
  detailEvt(e){
    let photoAlbumId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/pet/photoAlbumDetail/photoAlbumDetail?id=" + photoAlbumId,
    })
  },
  // 播放视频
  playEvt(e) {
    wx.navigateTo({
      url: '../../common/video/video?src=' + e.currentTarget.dataset.url,
    })
  },

    
})