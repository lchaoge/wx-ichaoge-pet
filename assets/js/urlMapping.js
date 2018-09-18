/*
 * Description = UrlMapping后台接口
 * Author = chaoge
 * Date = 2018/08/28
*/
function UrlMapping(){}
UrlMapping.isLocalHost = false; // 是测试吗
UrlMapping.origin = UrlMapping.isLocalHost ? 'http://47.105.121.106:3000' : 'http://qa.pet.ichaoge.com';

// 用户
UrlMapping.POST_USER_LOGIN = UrlMapping.origin + '/api/user/wxLogin' ;   // 登录               
UrlMapping.POST_USER_DECODE = UrlMapping.origin + '/api/user/decode';   // 解密用户手机号               

// 用户信息
UrlMapping.POST_USERINFO_UPDATE = UrlMapping.origin + '/api/userInfo/update';   // 修改用户信息               

// 宠物分类
UrlMapping.POST_PETSORT_QUERYALLPETSORT = UrlMapping.origin + '/api/petSort/queryAllPetSort';   // 获取宠物分类列表

// 宠物卡
UrlMapping.POST_PET_UPLOADFILE = UrlMapping.origin + '/api/pet/uploadFile';   // 上传图片
UrlMapping.POST_PET_INSERT = UrlMapping.origin + '/api/pet/insert';   // 增加宠物卡
UrlMapping.POST_PET_UPDATE = UrlMapping.origin + '/api/pet/update';   // 修改宠物卡
UrlMapping.POST_PET_QUERYPETBYID = UrlMapping.origin + '/api/pet/queryPetById';   // 根据ID查询宠物卡
UrlMapping.POST_PET_QUERYPETALL = UrlMapping.origin + '/api/pet/queryPetAll';   // 查询所有宠物卡

// 用户收货地址
UrlMapping.POST_ADDRESS_INSERT = UrlMapping.origin + '/api/address/insert';   // 增加收货地址
UrlMapping.POST_ADDRESS_ISDEFAULT = UrlMapping.origin + '/api/address/isDefault';   // 查询默认收到地址

module.exports = UrlMapping;
