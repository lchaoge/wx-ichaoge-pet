const app = getApp()
Page({
  data: {
    spinShow: true,
    address:{}, // 用户收货地址
    currentUser:null,
    isAddress: true,
    isPhone: true,
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
    this.isDefaultEvt();
    this.getCurrentUser();
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面关闭
  },
  actionBackEvt() {
    wx.switchTab({
      url: '/pages/index/userinfo/userinfo'
    })
  },
  // 获取用户信息
  getCurrentUser(){
    let params = {
      id:app.globalData.currentUser.id
    }
    wx.request({
      method: "POST",
      url: app.globalData.urlMapping.POST_USER_QUERYBYID,
      data: params,
      success: (res) => {
        if (res.data.code == "000") {
          console.log("获取用户信息成功");
          wx.setStorageSync("currentUser", res.data.model);
          this.setData({
            currentUser: res.data.model,
          })
          if (this.data.currentUser.phone != "" && this.data.currentUser.phone != null){
            this.setData({
              isPhone: false
            })
          }
        }
      },
      fail: (error) => {
        console.log("获取用户信息失败" + error.errMsg)
      }
    })
  },
  // 设置手机号
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        showCancel: false,
        content: '未授权',
      })
    } else {
      wx.login({
        //获取code 使用wx.login得到的登陆凭证，用于换取openid
        success: (res) => {
          // 解密用户手机号
          let params = {
            userId:app.globalData.currentUser.id,
            encrypdata: e.detail.encryptedData,
            ivdata: e.detail.iv,
            code: res.code
          }
          wx.request({
            method: "POST",
            url: app.globalData.urlMapping.POST_USER_DECODE,
            data: params,
            success: (res) => {
              if (res.data.code == "000") {
                console.log(res.data.model);
                this.setData({
                  isPhone:false,
                  currentUser: res.data.model
                })
              } else {
                wx.showToast({ title: '获取手机号失败', icon: 'none', mask: true })
                console.log("获取手机号失败")
              }
            },
            fail: (error) => {
              console.log("解密用户手机号失败" + error.errMsg)
            }
          })
        },
        fail:(error)=>{
          console.log("登录失败");
        }
      })    
    }
  },   
  // 设置收货地址
  addressEvt(e){
    wx.authorize({
      scope: "scope.address",
      success:(res)=>{
        wx.chooseAddress({
          success: (address) => {
            console.log(address);
            let params = {
              "userId": app.globalData.currentUser.id, // 用户ID
              "consignee": address.userName, // 收货人
              "phone": address.telNumber, // 收货人手机号
              "zipCode": address.postalCode, // 邮政编码
              "province": address.provinceName, // 省
              "city": address.cityName, // 市
              "districtn": address.countyName, // 区
              "street": address.detailInfo, // 街道
              "address": address.provinceName + " " + address.cityName + " " + address.countyName+" "+address.detailInfo // 详细地址
            }
            this.saveAddressEvt(params);
          },
          fail: (error) => {
            console.log("获取收货地址失败：" + error);
          }
        })
      },
      fail:(error)=>{
        console.log("获取收货地址权限失败："+error);
      }
    })
  },
  // 保存地址到服务器
  saveAddressEvt(address){
    wx.request({
      method: "POST",
      url: app.globalData.urlMapping.POST_ADDRESS_INSERT,
      data: address,
      success: (res) => {
        console.log(res.data)
        if (res.data.code == "000") {
          this.setData({
            address: res.data.model,
            isAddress:false
          })
        }else{
          wx.showToast({ title: '保存收货地址失败', icon: 'none', mask: true })
        }
      },
      fail: (error) => {
        console.log("保存收货地址失败" + error.errMsg)
      }
    })
  },
  // 查询默认收货地址
  isDefaultEvt(){
    let params = {
      userId : app.globalData.currentUser.id
    }
    wx.request({
      method: "POST",
      url: app.globalData.urlMapping.POST_ADDRESS_ISDEFAULT,
      data: params,
      success: (res) => {
        console.log(res.data)
        if (res.data.code == "000") {
          this.setData({
            address: res.data.model,
            isAddress: false
          })
        }else{
          console.log("查询默认收货地址失败：")
          wx.showToast({ title: '查询默认收货地址失败：', icon: 'none', mask: true })
        }
      },
      fail: (error) => {
        console.log("查询默认收货地址失败：" + error.errMsg)
      }
    })
    
  }


})