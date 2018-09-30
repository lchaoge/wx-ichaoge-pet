const app = getApp()
Page({
  data: {
    photoAlbum:{
      type:3,
      petId:"",
      photoAlbumImageList:[]
    },
    spinShow: true
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad(options) {
    if (options.type){
      this.setData({
        "photoAlbum.type":options.type
      })
    }
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
    
  },
  // 页面隐藏
  onHide () {
    
  },
  // 页面关闭
  onUnload () {
    
  },
  actionBackEvt() {
    wx.navigateBack()
  },
  // 上传GIF
  addGifEvt(){
    
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          "photoAlbum.petId": app.globalData.currentPet.id,
          "photoAlbum.photoAlbumImageList": res.tempFilePaths
        })
        let photoAlbum = JSON.stringify(this.data.photoAlbum);
        wx.navigateTo({
          url: "/pages/pet/insertPhotoAlbum/insertPhotoAlbum?params=" + photoAlbum,
        })
      },
      fail: (error) => {
        console.log("选择图片失败：" + error);
      },
      complete: () => {

      }
    })
  }
})