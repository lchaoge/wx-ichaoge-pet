//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tabCurrent: 'tab2',
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
    ],
  
  },
  onLoad() {

  },
  tabItemEvt(e){
    this.setData({
      tabCurrent: e.currentTarget.dataset.index
    });
  },
  searchEvt(){
    console.log("搜索")
  }

})
