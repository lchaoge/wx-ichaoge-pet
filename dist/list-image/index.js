Component({
  externalClasses: ['i-class'],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
  * 组件的属性列表
  */
  properties: {
    files: {
      type: Array,
      value: []
    },
    itemHeight: { 
      type: String,
      value: "100px"
    },
    imageHeight: {
      type: String,
      value: "99px"
    }
  },
  data: {
    files:[],
    itemHeight: "100px",
    imageHeight: "99px"
  },
  methods: {
    
    // 浏览图片
    previewImage(e) {
      let item = e.currentTarget.dataset.files,
        currUrl = e.currentTarget.dataset.url
      let files = item.map(el => {
        return el.imageUrl
      })
      wx.previewImage({
        current: currUrl, // 当前显示图片的http链接
        urls: files // 需要预览的图片http链接列表
      })
    },
    /*************供外部调用接口*******************/
    getFiles () {
      return this.data.files;
    }
  }
})
