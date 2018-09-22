const app = getApp()
Page({
  data: {
    switch: true, // 许被推荐
    photoAlbum: {
      petId:"",
      content:"", // 内容
      type: "", // 类型：1=图片，0=视频
      recordDate:"", // 记录时间
      recommend: "1", // 允许被推荐  1: 允许，0: 不允许
      photoAlbumImageList:[],
      labelSortList:[]
    },
    labelModal:false, // 标签模态框状态
    labelSortList:[], // 所有标签
    maxFileCount: 9,//允许最多9张图片
    uploader:{
      files:[],
      maxFileCount:2
    },
    spinShow:true,
    currentPet:null,
    currData:"",
  },
  onLoad (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.params){
      let photoAlbum = JSON.parse(options.params);
      this.uploaderEvt(photoAlbum.photoAlbumImageList, photoAlbum.type);
      this.setData({
        currentPet: app.globalData.currentPet,
        currData: app.globalData.util.getDateFunc(),
      })
    }
  },
  onReady () {
    // 页面渲染完成
    this.uploader = this.selectComponent("#uploader");
    this.setData({
      "photoAlbum.recordDate": app.globalData.util.getDateFunc(),
      spinShow: false
    });

  },
  onShow () {
    // 页面显示
    this.queryLabelSort();
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
  // 查询所有标签
  queryLabelSort(){
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_LABELSORT_QUERYALL,
      type: "POST",
      data: {}
    }).then(res => {
      console.log(res)
      if (res.code == "000") {
        this.setData({
          labelSortList:res.model
        })
      }
    }).catch(error => {
      console.log("查询所有标签失败:"+error)
    })
  },
  // 选择标签
  onChangeTag(e){
    const detail = e.detail;
    this.setData({
      ['labelSortList[' + e.detail.name + '].checked']: detail.checked
    })
  },
  // 保存标签 
  modalSuccess(e){
    let labelSortList = this.data.labelSortList
    let list = [];
    labelSortList.forEach(item => {
      if (item.checked){
        list.push(item);
      }
    })
    this.setData({
      "photoAlbum.labelSortList": list,
      labelModal: false
    })
  },
  // 打开模态框
  modalShow(){
    this.setData({
      labelModal: true
    })
  },
  // 关闭标签模态框 
  modalCancel(e){
    this.setData({
      labelModal:false
    })
  },
  // 允许被推荐
  switchChange(){
    this.setData({
      "switch": !this.data.switch
    })
    if(this.data.switch){
      this.setData({
        "photoAlbum.recommend":1
      })
    }else{
      this.setData({
        "photoAlbum.recommend": 0
      })
    }
  },
  // 修改内容
  contentEvt(e){
    this.setData({
      "photoAlbum.content": e.detail.detail.value
    })
  },
  // 修改记录时间
  changeRecordDate(e){
    this.setData({
      "photoAlbum.recordDate": e.detail.value
    })
  },
  uploaderChange(e){
    this.uploaderEvt(e.detail.files, this.data.photoAlbum.type)
  },
  // 上传图片
  uploaderEvt(fileList, type){
    fileList.forEach((item, index) => {

      wx.showLoading({
        title: '上传中 ' + index + '/' + (fileList.length+1)+'...',
        mask: true
      });
      wx.uploadFile({
        url: app.globalData.urlMapping.POST_PHOTOALBUM_UPLOADFILE,
        filePath: item,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {
          'type': type
        },
        success: (res) => {
          let data = JSON.parse(res.data);
          if (data.code == "000") {
            let photoAlbumImageList = data.model ? this.data.photoAlbum.photoAlbumImageList.concat(data.model) : this.data.photoAlbum.photoAlbumImageList
            this.setData({
              "photoAlbum.photoAlbumImageList": photoAlbumImageList
            })
            console.log(this.data.photoAlbum)
            
          } else {
            console.log("上传图片失败");
          }
        },
        fail: (error) => {
          wx.showLoading({
            title: '上传失败',
            mask: true
          })
          console.log("上传图片失败：" + error.errMsg);
        },
        complete() {       
          wx.hideLoading();        
        }
      })
    })
  },
  // 发布
  insertEvt(e){
    this.setData({
      "photoAlbum.photoAlbumImageList": this.uploader.getFiles() //调用组件外显方法，获取文件列表
    })
    console.log(this.data.photoAlbum)
    app.globalData.util.ajax({
      url: app.globalData.urlMapping.POST_PHOTOALBUM_INSERT,
      type: "POST",
      data: this.data.photoAlbum
    }).then(res => {
      console.log(res)
      if (res.code == "000") {
        wx.showToast({
          title: "发布成功",
          mask: true,
          icon: 'success',
          success:()=>{
            wx.navigateBack();
          }
        })
      }
    }).catch(error => {
      console.log(error)
    })
  },


    
})