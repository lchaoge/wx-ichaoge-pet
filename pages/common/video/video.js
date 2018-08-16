const app = getApp()

Page({
  data: {
    video:{
      src:""
    }
  },
  onLoad(options) {
    this.setData({
      "video.src": options.src ? options.src:""
    })

  },
  
})