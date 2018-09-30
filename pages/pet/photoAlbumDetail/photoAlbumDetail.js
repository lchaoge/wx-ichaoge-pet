const app = getApp()
Page({
  data: {
    photoAlbum:{
      id:"",
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
          name: '删除',
        }
      ]
    },
    gridItemHeight:"100px",
    gridItemImgHeight: "99px",
    comment:{
      visible:false,
      from:{
        photoAlbumId: "", // 写真集ID
        userId: "", // 用户ID
        stayUserId: "", // 评论者ID
        parentId: "", // 评论父id
        floor: "", // 楼层
        content: "" // 评论内容
      }
    },
    photoAlbumComment:[], // 所有评论
    validateModal: {
      visible: false,
      actions: [
        {
          name: '确定',
          color: '#1AAD16',
        }
      ],
      message: ""
    },
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad (options) {
    
    if (options.id){
      this.setData({
        "photoAlbum.id": options.id
      })
    }
    this.setData({
      currentPet: app.globalData.currentPet
    })
    // 允许转发
    wx.showShareMenu({
      withShareTicket: true
    })

    // 查询写真集
    this.queryPhotoAlbumEvt(this.data.photoAlbum.id);
  },
  // 页面渲染完成
  onReady () {
    
    setTimeout(() => {
      this.setData({
        spinShow: false
      });
    }, 1000)
  },
  // 页面显示
  onShow () {
    
    // 允许转发
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  // 页面隐藏
  onHide () {
    
  },
  // 页面关闭
  onUnload () {
    
  },
  actionBackEvt() {
    wx.navigateBack();
  },
  // 转发
  onShareAppMessage(res) {
    let currentPet = wx.getStorageSync("currentPet");
    return {
      title: currentPet.nickname + '的写真集',
    }
  },
  // 关闭删除
  actionSheetCancelEvt(){
    this.setData({
      "actionSheet.visible": false
    })
  },
  // 打开删除
  addPhotoAlbum(){
    this.setData({
      "actionSheet.visible": true
    })
  },
  // 删除写真集
  actionSheetEvt(e){
    if(e.detail.index == 0){
      this.deletePhotoAlbumEvt()
    }
  },
  // 服务器删除写真集
  deletePhotoAlbumEvt(){
    let photoAlbumImageList = this.data.photoAlbum.photoAlbumImageList.map(item=>{
      return item.id
    })
    let labelSortList = this.data.photoAlbum.labelSortList.map(item => {
      return item.id
    })
    let params = {
      id: this.data.photoAlbum.id,
      photoAlbumImageList: photoAlbumImageList,
      labelSortList: labelSortList
    }
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_PHOTOALBUM_DELETEPHOTOALBUMBYID,
      type: "POST",
      data: params
    }).then(res => {
      console.log(res)
      if (res.code == "000") {
        wx.showToast({
          title: "删除成功",
          mask: true,
          icon: 'success',
          success: () => {
            wx.navigateTo({
              url: "/pages/pet/photoAlbum/photoAlbum",
            })
          }
        })
      }
    }).catch(error => {
      console.log(error)
    })
  },
  queryPhotoAlbumEvt(id){
    let params = {
      id
    }
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_PHOTOALBUM_QUERYPHOTOALBUMBYID,
      type: "POST",
      data: params
    }).then(res => {
      console.log(res)
      if (res.code == "000") {
        this.setData({
          photoAlbum: res.model.photoAlbum,
          "photoAlbum.photoAlbumImageList": res.model.photoAlbumImageList,
          "photoAlbum.labelSortList": res.model.labelSortList
        })
        // 计算图片大小
        this.computeImage(res.model.photoAlbumImageList.length);
        // 查询评论
        this.queryAllFloorEvt();
      }
    }).catch(error => {
      console.log(error)
    })
  },
  computeImage(size){
    let num = 1;
    if (size==1){
      num = 1;
    } else if (size == 2 || size == 4){
      num = 2;
    } else {
      num = 3;
    }
    // 设置宽度
    let windowWidth = wx.getSystemInfoSync().windowWidth / num
    this.setData({
      gridItemHeight: windowWidth + 'px',
      gridItemImgHeight: (windowWidth - 1) + 'px'
    }) 
  },
  // 浏览图片
  previewImage(e){
    let item = e.currentTarget.dataset.files,
      currUrl = e.currentTarget.dataset.url
    let files = item.map(el=>{
      return el.imageUrl
    })
    wx.previewImage({
      current: currUrl, // 当前显示图片的http链接
      urls: files // 需要预览的图片http链接列表
    })
  },
  // 评论触发focus事件
  commentFocusEvt(e){
    this.setData({
      "comment.visible":true
    })
  },
  // 评论起开事件
  commentBlurEvt(e){
    setTimeout((e)=>{
      this.setData({
        "comment.visible": false
      })
    },500)
  },
  commentInputEvt(e){
    this.setData({
      "comment.from.content":e.detail.value
    })
  },
  validateModalClose(e){
    this.setData({
      "validateModal.visible": false
    })
  },
  insertCommentEvt(){
    this.setData({
      "comment.from.stayUserId": this.data.photoAlbum.creator, // 被评论的人ID
      "comment.from.photoAlbumId": this.data.photoAlbum.id, // 写真集ID
      "comment.from.userId": app.globalData.currentUser.id, // 用户ID
      "comment.from.content": this.data.comment.from.content // 评论内容
    })
    let params = this.data.comment.from;
    // 验证
    if (this.data.comment.from.content == "") {
      this.setData({
        "validateModal.visible": true,
        "validateModal.message": '评论内容不能为空'
      })
      return false;
    }
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_PHOTOALBUMCOMMENT_INSERT,
      type: "POST",
      data: params
    }).then(res => {
      console.log(res)
      if (res.code == "000") {
        this.setData({
          "photoAlbumComment": res.model,
          "comment.visible": false,
          "comment.from.content": "", // 清空文本框
        })
      }else{
        console.log(res.message);
      }
    }).catch(error => {
      console.log(error)
    })
  },
  // 根据写真集ID查询写真集所有楼层
  queryAllFloorEvt(){
    let params = {
      photoAlbumId: this.data.photoAlbum.id
    }
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_PHOTOALBUMCOMMENT_SELECTALLFLOOR,
      type: "POST",
      data: params
    }).then(res => {
      console.log(res)
      if (res.code == "000") {
        this.setData({
          "photoAlbumComment": res.model
        })
      } else {
        console.log(res.message);
      }
    }).catch(error => {
      console.log(error)
    })
  }
  

    
})