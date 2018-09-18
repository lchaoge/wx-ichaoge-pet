const app = getApp()
Page({
  data: {
    spinShow: true,
    address:{}, // 用户收货地址
    isAddress: true
  },
  onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.isDefaultEvt();
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
      debugger
      wx.login({
        //获取code 使用wx.login得到的登陆凭证，用于换取openid
        success: (res) => {
          // 解密用户手机号
          let params = {
            encrypdata: e.detail.encryptedData,
            ivdata: e.detail.iv,
            code: res.code
          }
          wx.request({
            method: "POST",
            url: app.globalData.urlMapping.POST_USER_DECODE,
            data: params,
            success: (res) => {
              console.log(res.data)
              if (res.data.code == "000") {
                console.log(res.data);
              } else {
                console.log("解密用户手机号失败")
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
    debugger
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
          console.log("保存收货地址成功");
          this.setData({
            address: res.data.model,
            isAddress:false
          })
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
          console.log("查询默认收货地址");
          this.setData({
            address: res.data.model,
            isAddress: false
          })
        }
      },
      fail: (error) => {
        console.log("查询默认收货地址失败：" + error.errMsg)
      }
    })
    
  }


})