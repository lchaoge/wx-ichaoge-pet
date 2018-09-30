const app = getApp()
Page({
  data: {
    imageWidth:"",
    videoWidth:"",
    videoHeight:"",
    isOnLoadOptions:false, 
    switch: true, // 许被推荐
    firstVideoImageUrl:"",
    photoAlbum: {
      petId:"",
      content:"", // 内容
      type: "", // 类型：1=图片，2=视频，3=GIF
      recordDate:"", // 记录时间
      recommend: "1", // 允许被推荐  1: 允许，0: 不允许
      photoAlbumImageList:[],
      labelSortList:[]
    },
    labelModal:false, // 标签模态框状态
    labelSortList:[], // 所有标签
    labelSortListChecked: [], // 选择的标签
    maxFileCount: 9,//允许最多9张图片
    uploader:{
      files:[],
      maxFileCount:2
    },
    spinShow:true,
    currentPet:null,
    currData:"",
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
  onLoad (options) {
    // 页面初始化 options为页面跳转所带来的参数

    // 启动属性监听
    // app.setWatcher(this);

    console.log(options)
    if (options.params){
      let photoAlbum = JSON.parse(options.params);
      this.uploaderEvt(photoAlbum.photoAlbumImageList, photoAlbum.type);
      this.setData({
        "photoAlbum.type": photoAlbum.type,
        "photoAlbum.petId": photoAlbum.petId,
        currentPet: app.globalData.currentPet,
        currData: app.globalData.util.getDateFunc(),
        isOnLoadOptions:true,
      })
    }else{
      this.setData({
        isOnLoadOptions:false
      })
    }
    this.queryLabelSort();
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
    this.setData({
      labelSortListChecked:[]
    })
    const detail = e.detail;
    let labelSortList = this.data.labelSortList
    labelSortList.forEach(item => {
      item.labelSorts.forEach(labelSort => {
        if (labelSort.id == detail.name){
          labelSort.checked = detail.checked
        }
        if (labelSort.checked){
          let labelSortListChecked = this.data.labelSortListChecked.concat([labelSort])
          this.setData({
            labelSortListChecked: labelSortListChecked
          })
        }
      })
    })
    this.setData({
      labelSortList
    })
  },
  // 计算图片宽度
  computeImage(type) {
    if(type == 2 || type == 3){
      let videoWidth = wx.getSystemInfoSync().windowWidth - 20;
      let videoHeight = videoWidth / 1.3333333333333333;
      this.setData({
        videoWidth,
        videoHeight
      })
    }else{
      // 设置宽度
      let windowWidth = wx.getSystemInfoSync().windowWidth - 40;
      this.setData({
        imageWidth: windowWidth / 3
      })
    }
  },
  // 保存标签 
  modalSuccess(e){
    let labelSortList = this.data.labelSortList
    let list = [];
    labelSortList.forEach(item => {
      item.labelSorts.forEach(labelSort => {
        if (labelSort.checked) {
          list.push(labelSort);
        }
      })
    })
    this.setData({
      "photoAlbum.labelSortList": list,
      labelModal: false
    })
  },
  // 播放视频
  playEvt(e){
    wx.navigateTo({
      url: '../../common/video/video?src=' + e.currentTarget.dataset.url,
    })
  },
  // 删除视频文件
  deleteVideoEvt(){
    this.setData({
      firstVideoImageUrl: "",
      "photoAlbum.photoAlbumImageList": [],
      "photoAlbum.type":"",
      isOnLoadOptions: false
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
  uploaderDelete(e) {
    this.setData({
      "photoAlbum.photoAlbumImageList": e.detail.files
    })
    let maxFileCount = 9 - parseInt(e.detail.files.length);
    if (this.data.photoAlbum.photoAlbumImageList.length == 0) {
      this.setData({
        firstVideoImageUrl: "",
        "photoAlbum.photoAlbumImageList": [],
        "photoAlbum.type": "",
        maxFileCount: maxFileCount,
        isOnLoadOptions: false
      })
    }
  },
  // 上传图片
  uploaderEvt(fileList, type){
    fileList.forEach((item, index) => {
      wx.showLoading({
        title: '上传中 ' + (index+1) + '/' + (fileList.length)+'...',
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
            let photoAlbumImageList = data.model.path ? this.data.photoAlbum.photoAlbumImageList.concat(data.model.path) : this.data.photoAlbum.photoAlbumImageList
            this.setData({
              isOnLoadOptions:true,
              "photoAlbum.photoAlbumImageList": photoAlbumImageList
            })
            if (data.model.type == 2) {
              this.setData({
                firstVideoImageUrl: data.model.firstVideoImageUrl
              })
            }
            this.computeImage(data.model.type);
            
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
  // 提示框关闭
  validateModalClose(e) {
    this.setData({
      "validateModal.visible": false
    })
  },
  // 发布
  insertEvt(e){
    let labelSortListChecked = this.data.labelSortListChecked;
    let array = labelSortListChecked.map(item=>{
      return item.id
    })
    if (this.data.photoAlbum.type == 1){ // 图片
      this.setData({
        "photoAlbum.photoAlbumImageList": this.uploader.getFiles(), //调用组件外显方法，获取文件列表
      })
    } else if (this.data.photoAlbum.type == 2){ // 视频
      let firstVideoImageUrl = this.data.firstVideoImageUrl;
      let url = this.data.photoAlbum.photoAlbumImageList[0] + "," + firstVideoImageUrl
      this.setData({
        "photoAlbum.photoAlbumImageList": [url]
      })
    }
    this.setData({
      "photoAlbum.labelSortList": array
    })
    console.log(this.data.photoAlbum)
    this.setData({
      "photoAlbum.creator":app.globalData.currentUser.id
    })
    if (this.data.photoAlbum.type == "") {
      let event = {
        currentTarget:{
          dataset:{
            type : 1
          }
        }
      }
      this.addFileEvt(event);
      return false;
    }
    if (this.data.photoAlbum.content == ""){
      this.setData({
        "validateModal.visible": true,
        "validateModal.message": '内容不能为空'
      })
      return false;
    }
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
  // 添加写真集图片or视频orGIF
  // 添加写真
  addFileEvt(e) {
    this.setData({
      "photoAlbum.type":e.currentTarget.dataset.type
    });
    if (this.data.photoAlbum.type == 1) {
      // 上传图片
      wx.chooseImage({
        count: this.data.maxFileCount - this.data.photoAlbum.photoAlbumImageList.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          console.log(res);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          this.uploaderEvt(res.tempFilePaths, 1);
        },
        fail: (error) => {
          console.log("选择图片失败：" + error);
        },
        complete: () => {

        }
      })
    } else if (this.data.photoAlbum.type == 2) {
      // 上传视频
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: (res) => {
          console.log(res);
          let fileList = [];
          fileList.push(res.tempFilePath)
          this.uploaderEvt(fileList, 2);
        },
        fail: (error) => {
          console.log("选择视频失败：" + error);
        },
        complete: () => {

        }
      })
    } else if (this.data.photoAlbum.type == 3){
      wx.navigateTo({
        url: "/pages/common/gif/gif?type=" + this.data.photoAlbum.type,
      })
    }

  },
  // 监听图片数组
  // watch: {
  //   "photoAlbum.photoAlbumImageList": (newVal, oldVal)=>{
  //     console.log(newVal, oldVal);
      
  //     if (newVal.length==0){
  //       this.setData({
  //         isOnLoadOptions:false
  //       })
  //     }
  //   }
  // }


    
})