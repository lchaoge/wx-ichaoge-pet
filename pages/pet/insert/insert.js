const { $Message } = require('../../../dist/base/index');
const app = getApp()
Page({
  data: {
    picker:{
      isShow:false,
      petSortArray: [],
      petSortValue: [0,0,0],
      petSortName:"",
      column1: [],
      column2: [],
      column3:[],
    },
    currData: "",
    spinShow:true,
    petUrl:"", // 宠物保存
    pet:{
      petSortId:"",
      userId: "",
      nickname:"", // 宠物名
      photo:"", // 头像
      sex: "1", // 性别
      weight: "", // 体重
      describes: "", // 描述
      sterilization: "1", // 是否绝育
      birthDate: "", // 出生日期
      homeDate: "" // 到家日期
    },
    validateModal:{
      visible: false,
      actions: [
        {
          name: '确定',
          color: '#1AAD16',
        }
      ],
      message:""
    }
  },
  onLoad (options) {
    this.setData({
      "pet.userId": app.globalData.currentUser.id
    })
    // 页面初始化 options为页面跳转所带来的参数
    let petId = options.petId;
    if (petId) {
      // 修改
      this.setData({
        petUrl: app.globalData.urlMapping.POST_PET_UPDATE
      })
      wx.request({
        method: "POST",
        url: app.globalData.urlMapping.POST_PET_QUERYPETBYID,
        data: {
          id:petId
        },
        success: (res)=>{
          console.log(res.data)
          if(res.data.code == "000"){
            let pet = res.data.model;
            pet.birthDate = app.globalData.util.dateFormat("yyyy-MM-dd",pet.birthDate);
            pet.homeDate = app.globalData.util.dateFormat("yyyy-MM-dd", pet.homeDate);
            this.setData({
              pet
            })
          }
        },
        fail:(error)=>{
          console.log("查询萌宠卡失败"+error)
        }
      })
    }else{
      // 新增
      this.setData({
        petUrl: app.globalData.urlMapping.POST_PET_INSERT
      })
    }
    this.setData({
      currData: app.globalData.util.getDateFunc()
    });
    this.queryAllPetSort();
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
    wx.navigateBack()
  },
  // 昵称
  nicknameInput(event){
    this.setData({
      "pet.nickname": event.detail.value
    })
  },
  // 头像
  chooseImage(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res)=>{
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.uploadImg(res.tempFilePaths[0])
      },
      fail:(error)=>{
        console.log("选择图片失败："+error);
      }
    })
  },
  
  // 上传照片
  uploadImg: function (file) {
    wx.uploadFile({
      url: app.globalData.urlMapping.POST_PET_UPLOADFILE, //仅为示例，非真实的接口地址
      filePath: file,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      // formData: {
      //   'user': '黑柴哥'
      // },
      success: (res)=>{
        let data = JSON.parse(res.data);
        if(data.code == "000"){
          this.setData({
            "pet.photo": data.model.photo
          })
          console.log(this.data.pet)
        }else{
          console.log("上传图片失败");
        }
      },
      fail:(error)=>{
        console.log("上传图片失败："+error);
      }
    })
  },


  // 切换性别
  changeSex(event){
    this.setData({
      "pet.sex": event.detail.name
    })
  },
  // 体重
  weightInput(event) {
    this.setData({
      "pet.weight": event.detail.value
    })
  },
  // 描述
  describeInput(event) {
    this.setData({
      "pet.describes": event.detail.value
    })
  },
  // 切换是否绝育
  changeSterilization(event) {
    this.setData({
      "pet.sterilization": event.detail.name
    })
  },
  // 出生日期
  changeBirthDate(event){
    this.setData({
      "pet.birthDate": event.detail.value
    })
  },
  // 到家日期
  changeHomeDate(event){
    this.setData({
      "pet.homeDate": event.detail.value
    })
  },
  changePetSortId(event) {
    this.setData({
      "picker.isShow": true
    })
  },
  // 隐藏picker-view
  hideMaskSelected(event){
    this.setData({
      "picker.isShow": false
    })
  },
  bindChangePickerView(event){
    // 错误
    console.log(event.detail.value)
    let i = 0;
    this.data.picker.petSortArray
    event.detail.value.find((item,index)=>{
      if(item==0){
        if (index==0){
          event.detail.value[0] = 0;
          event.detail.value[1] = 0;
          event.detail.value[2] = 0;
        } else if (index==1){
          event.detail.value[1] = 0;
          event.detail.value[2] = 0;
        } else if (index == 2) {
          event.detail.value[2] = 0;
        }
      }
    })
    console.log(event.detail.value)
    this.setData({
      "picker.petSortValue": event.detail.value,
      "picker.column1": this.data.picker.petSortArray,
      "picker.column2": this.data.picker.petSortArray[event.detail.value[0]].childList,
      "picker.column3": this.data.picker.petSortArray[event.detail.value[0]].childList[event.detail.value[1]].childList,
      "picker.petSortName": this.data.picker.petSortArray[event.detail.value[0]].name + "," +
                            this.data.picker.petSortArray[event.detail.value[0]].childList[event.detail.value[1]].name + "," +
                            this.data.picker.petSortArray[event.detail.value[0]].childList[event.detail.value[1]].childList[event.detail.value[2]].name,
      "pet.petSortId": this.data.picker.petSortArray[event.detail.value[0]].childList[event.detail.value[1]].childList[event.detail.value[2]].id
    })
  },
  // 获取宠物分类
  queryAllPetSort(){
    wx.request({
      url: app.globalData.urlMapping.POST_PETSORT_QUERYALLPETSORT,
      method: "POST",
      success: (res)=>{
        if(res.data.code==="000"){
          this.setData({
            "picker.petSortArray": res.data.model,
            "picker.column1": res.data.model, 
            "picker.column2": res.data.model[this.data.picker.petSortValue[0]].childList,
            "picker.column3": res.data.model[this.data.picker.petSortValue[0]].childList[this.data.picker.petSortValue[1]].childList,
          });
          this.setData({
            "picker.petSortName": this.data.picker.petSortArray[this.data.picker.petSortValue[0]].name + "," +
              this.data.picker.petSortArray[this.data.picker.petSortValue[0]].childList[this.data.picker.petSortValue[1]].name + "," +
              this.data.picker.petSortArray[this.data.picker.petSortValue[0]].childList[this.data.picker.petSortValue[1]].childList[this.data.picker.petSortValue[2]].name,
            "pet.petSortId": this.data.picker.petSortArray[0].childList[0].childList[0].id
          })
        }else{
          console.log("获取宠物分类失败");
        }
      }
    })
  },
  // 隐藏验证提示框
  validateModalClose() {
    this.setData({
      "validateModal.visible":false
    })
  },
  // 保存宠物资料
  insertEvt() {
    if (this.data.pet.nickname == ""){ // 宠物名
      this.setData({
        "validateModal.visible": true,
        "validateModal.message":'“宠物名” 还没有写'
      })
      return false;
    }
    if (this.data.pet.weight == "") { // 体重
      this.setData({
        "validateModal.visible": true,
        "validateModal.message": '体重是按公斤(kg)来计算的。请输入正确的体重'
      })
      return false;
    }
    if (this.data.pet.describes == "") { // 描述
      this.setData({
        "validateModal.visible": true,
        "validateModal.message": '“一句描述” 还没有写'
      })
      return false;
    }
    if (this.data.pet.photo == "") { // 头像
      this.setData({
        "validateModal.visible": true,
        "validateModal.message": '“头像” 还没有写'
      })
      return false;
    }
    if (this.data.pet.birthDate == "") { // 出生日期
      this.setData({
        "validateModal.visible": true,
        "validateModal.message": '“出生日期” 还没有写'
      })
      return false;
    }
    if (this.data.pet.homeDate == "") { // 到家日期
      this.setData({
        "validateModal.visible": true,
        "validateModal.message": '“到家日期” 还没有写'
      })
      return false;
    }
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    console.log(this.data.pet);

    wx.request({
      method: "POST",
      url: this.data.petUrl,
      data: this.data.pet,
      success: (res)=>{
        console.log(res)
        setTimeout(()=>{
          wx.hideLoading()
        }, 500);
        if(res.data.code=="000"){
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          wx.hideToast({
            success:()=>{
              wx.setStorageSync("currentPet", res.data.model);
              app.globalData.currentPet = res.data.model;
              wx.navigateBack();
            }
          });
        }else{
          console.log("保存宠物资料失败");
        }
      },
      fail:(error)=>{
        setTimeout(() => {
          wx.hideLoading()
        }, 500);
        console.log("保存宠物资料失败");
      },
      complete:()=>{
       
      }
    })
  },
})