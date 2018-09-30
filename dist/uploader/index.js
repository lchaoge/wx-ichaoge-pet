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
    maxFileCount: { //允许最多9张图片
      type: Number,
      value: 9
    },
    isCanAddFile: {
      type: Boolean,
      value: true
    },
    imageWidth:{
      type: Number,
      value: 100
    }
  },
  data: {
    files:[],
    maxFileCount:9,
    isCanAddFile:true,
    imageWidth:100
  },
  methods: {
    // 计算图片宽度
    _computeImage(size) {
      // 设置宽度
      let windowWidth = wx.getSystemInfoSync().windowWidth-40;
      this.setData({
        imageWidth: windowWidth / 3
      })
    },
    /*图片上传 */
    chooseImage (e) {
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res)=>{
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

          // 计算宽度
          // this._computeImage();

          if (that.data.files.length >= that.data.maxFileCount-1) {
            that.data.isCanAddFile = false;
          }
          that.setData({
            files: that.data.files.concat(res.tempFilePaths),
            isCanAddFile: that.data.isCanAddFile
          });
          
          this.triggerEvent('change', {
            files: res.tempFilePaths
          })
          
        }
      })
    },
     /*图片预览*/
    previewImage (e) {
      // var preUlrs = [];
      // this.data.files.map((value, index)=>{
      //     preUlrs.push(value.OrigionUrl);
      //   }
      // );
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
      })
    },
    /*图片删除*/
    deleteImage(e) {
      var that = this;
      var files = that.data.files;
      var index = e.currentTarget.dataset.index; //获取当前长按图片下标
      wx.showModal({
        title: '提示',
        content: '确定要删除此图片吗？',
        success:(res)=>{
          if (res.confirm) {
            files.splice(index, 1);
          } else if (res.cancel) {
            return false;
          }
          that.setData({
            files,
            isCanAddFile: true
          });
          this.triggerEvent('remove', {
            files: files
          })
        }
      })
    },
    /*************供外部调用接口*******************/
    getFiles () {
      return this.data.files;
    }
  }
})
