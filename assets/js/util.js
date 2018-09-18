function Util() {}
/**
	 * 获取日期
	 * 对Date的扩展，将 Date 转化为指定格式的String
	 * 月(M)、日(d)、小时(h)、分(m)、秒(s)可以用 1-2 个占位符，
	 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	 * 例子：
	 * publicNode.dateFormat("yyyy-MM-dd hh:mm:ss.S","2016-07-02") ==> 2006-07-02 08:09:04.423
	 * publicNode.dateFormat("yyyy-M-d h:m:s.S","2016/07/02")      ==> 2006-7-2 8:9:4.18
	 * publicNode.dateFormat("yyyy-M-d h:m:s.S","2016/7/2")      ==> 2006-7-2 8:9:4.18
	 * times:格式必须为：2016-07-02||2016/07/02
	 */
Util.dateFormat = (fmt, times)=>{
  if (fmt === "" && fmt === undefined) {
    return null;
  }
  let date = new Date();
  if (undefined !== times && times !== "") {
    let timestamp = times;
    if (!(/[0-9]{13}/.test(times))) {
      if (/^(\d{4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/.test(times)) {
        timestamp = new Date((times + "").replace(/(-|年|月)/g, '/').replace(/日/g, "")).getTime();
      } else {
        return null;
      }
    }
    date = new Date(parseInt(timestamp));
  }
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 * 获取日期
 * getDateFunc('all',null)
 */
Util.getDateFunc = (allFlag, times)=>{
  let date = new Date();
  if (undefined !== times && /^[0-9]*$/.test(times)) {
    date = new Date(times);
  }
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = (month > 9 ? month : '0' + month);
  let day = date.getDate();
  day = (day > 9 ? day : '0' + day);
  let hours = date.getHours();
  hours = (hours > 9 ? hours : '0' + hours);
  let minutes = date.getMinutes();
  minutes = (minutes > 9 ? minutes : '0' + minutes);
  let seconds = date.getSeconds();
  seconds = (seconds > 9 ? seconds : '0' + seconds);
  return allFlag == 'all' ? (year + '-' + month + "-" + day + " " + hours + ':' + minutes + ':' + seconds) : (year + '-' + month + "-" + day);
}

/**
 * 判断开始时间小于结束时间
 */
Util.compareDate = (startTime, endTime)=>{
  return ((new Date(startTime.replace(/-/g, "\/"))) > (new Date(endTime.replace(/-/g, "\/"))));
}

/**
 * 获取用户注册多少天
 *  
 */
Util.getUserRegDay = (time)=>{
  // 当前日期
  let a = new Date().getTime();
  // 注册日期
  let b = new Date(time).getTime();
  // 日期差  得到的是毫秒
  let diff = a - b;
  // 算天数
  let days = diff / 1000 / 60 / 60 / 24;
  // 除去未完成的今天，这就是你要的天数
  days = Math.floor(days);
  // let year = (days / 365).toFixed(0)
  return days
}

/**
 * @获取发布日期
 * @getDateDiff(1489821062951)
 * @dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
 * @param {Object} dateTimeStamp
 */
Util.getDateDiff = (dateTimeStamp)=>{
  let result = '';
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();
  let diffValue = now - dateTimeStamp;
  if (diffValue < 0) { return; }
  let monthC = diffValue / month;
  let weekC = diffValue / (7 * day);
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  if (monthC >= 1 || weekC >= 1) {
    //			result="" + parseInt(monthC) + "月前";
    //		}
    //		else if(weekC>=1){
    //			result="" + parseInt(weekC) + "周前";	
    result = "" + this.dateFormat("MM-dd", new Date(dateTimeStamp).getTime());
  }
  else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else {
    result = "刚刚";
  }
  return result;
}

module.exports = Util;
