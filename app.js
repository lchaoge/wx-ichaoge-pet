const urlMapping = require('./assets/js/urlMapping.js');
const util = require("./assets/js/util.js");
const watch = require("./assets/js/watch.js");
const { $Message } = require('./dist/base/index');
//app.js
App({
  globalData: {
    urlMapping: urlMapping,
    util: util,
    currentUser: null,
    currentPet:null,
  },
  // 属性监听
  setWatcher(page) {
    watch.setWatcher(page);
  },
  onLaunch () {
    
  },
  // 用户登录
  loginUser(){
    // 获取本地用户
    let user = wx.getStorageSync('currentUser');
    if(user){
      this.globalData.currentUser = user;
      // 获取本地宠物
      let currentPet = wx.getStorageSync('currentPet');
      if (currentPet) {
        this.globalData.currentPet = currentPet;
      }
    }else{
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            // 发起网络请求
            wx.request({
              method: "POST",
              data: res.code,
              url: urlMapping.POST_USER_LOGIN,
              success: res => {
                if (res.data.code == "000") {
                  console.log(res.data.model)
                  let currentUser = res.data.model.loginUser;
                  let currentPet = res.data.model.loginPet;
                  try {
                    wx.setStorageSync("currentUser", currentUser);
                    wx.setStorageSync("currentPet", currentPet);
                    this.globalData.currentUser = currentUser;
                    this.globalData.currentPet = currentPet;
                    this.getUserInfo(false,(data)=>{});
                  } catch (e) {
                    console.log('用户存储本地失败！' + res.data.message)
                  }
                }
              },
              fail:res=>{
                console.log(res);
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  // 获取用户的所有权限
  getUserInfo(isUpdate,callback){
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success: (res)=>{
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: (res)=>{
              console.log(that.globalData)
              let params = {
                userId: that.globalData.currentUser.id,
                photo: res.userInfo.avatarUrl,
                sex: res.userInfo.gender,
                nickName: res.userInfo.nickName,
                address: res.userInfo.country + " " + res.userInfo.province + " " + res.userInfo.city
              }
              // 修改userinfo
              wx.request({
                method: "POST",
                data: params,
                url: urlMapping.POST_USERINFO_UPDATE,
                success: res => {
                  if (res.data.code == "000") {
                    if (isUpdate){
                      wx.showToast({ title: '更新成功', icon: 'none', mask: true })
                    }else{
                      $Message({content: '授权成功！',type: 'success'});
                    }
                    let currentUser = res.data.model;
                    callback(res.data.model)
                    try {
                      wx.setStorageSync("currentUser", currentUser);
                      that.globalData.currentUser = currentUser;
                    } catch (e) {
                      wx.showToast({title: '用户存储本地失败', icon: 'none',mask: true})
                      console.log('用户存储本地失败!' + res.data.message)
                    }
                  }else{
                    wx.showToast({title: '用户修改失败', icon: 'none', mask: true})
                    console.log('用户修改失败！' + res.data.message)
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  // 获取当前萌宠卡
  getCurrentPet(userParams, callback){
    let params = userParams;
    this.globalData.util.ajax({
      url: this.globalData.urlMapping.POST_USER_QUERYUSERANDPET,
      type: "POST",
      data: params
    }).then(res => {
      console.log(res)
      if (res.code == "000") {
        this.globalData.currentUser = res.model.currentUser;
        this.globalData.currentPet = res.model.currentPet;
        wx.setStorageSync("currentUser", res.model.currentUser);
        wx.setStorageSync("currentPet", res.model.currentPet);
        callback(res);
      }
    }).catch(error => {
      console.log(error)
    })
  }
  
})