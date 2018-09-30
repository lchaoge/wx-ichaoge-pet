/*
 * Description = UrlMapping后台接口
 * Author = chaoge
 * Date = 2018/08/28
*/
function UrlMapping(){}
UrlMapping.isLocalHost = true; // 是测试吗
UrlMapping.origin = UrlMapping.isLocalHost ? 'http://pet.ichaoge.com:3000' : 'http://pet.ichaoge.com:3000'

// 用户
UrlMapping.POST_USER_LOGIN = UrlMapping.origin + '/api/user/wxLogin' ;   // 登录               
UrlMapping.POST_USER_DECODE = UrlMapping.origin + '/api/user/decode';   // 解密用户手机号               
UrlMapping.POST_USER_QUERYBYID = UrlMapping.origin + '/api/user/queryById';   // 根据ID查询用户               
UrlMapping.POST_USER_QUERYALLPAGE = UrlMapping.origin + '/api/user/queryAllPage';   // 分页查询               
UrlMapping.POST_USER_QUERYUSERANDPET = UrlMapping.origin + '/api/user/queryUserAndPet';   // 根据ID查询用户和萌宠卡

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
UrlMapping.POST_PET_QUERYCOUNT = UrlMapping.origin + '/api/pet/queryCount';   // 查询宠物各个数据

// 用户收货地址
UrlMapping.POST_ADDRESS_INSERT = UrlMapping.origin + '/api/address/insert';   // 增加收货地址
UrlMapping.POST_ADDRESS_ISDEFAULT = UrlMapping.origin + '/api/address/isDefault';   // 查询默认收到地址

// 写真集
UrlMapping.POST_PHOTOALBUM_UPLOADFILE = UrlMapping.origin + '/api/photoAlbum/uploadFile';   // 上传图片
UrlMapping.POST_PHOTOALBUM_INSERT = UrlMapping.origin + '/api/photoAlbum/insert';   // 新增
UrlMapping.POST_PHOTOALBUM_QUERYALLPAGE = UrlMapping.origin + '/api/photoAlbum/queryAllPage';   // 写真集分页
UrlMapping.POST_PHOTOALBUM_QUERYPHOTOALBUMBYID = UrlMapping.origin + '/api/photoAlbum/queryPhotoAlbumById';   // 根据ID查询写真集
UrlMapping.POST_PHOTOALBUM_DELETEPHOTOALBUMBYID = UrlMapping.origin + '/api/photoAlbum/deletePhotoAlbumById';   // 根据ID删除写真集

// 写真集评论
UrlMapping.POST_PHOTOALBUMCOMMENT_INSERT = UrlMapping.origin + '/api/photoAlbumComment/insert';   // 新增写真集评论
UrlMapping.POST_PHOTOALBUMCOMMENT_SELECTALLFLOOR = UrlMapping.origin + '/api/photoAlbumComment/selectAllFloor';   // 根据写真集ID查询写真集所有楼层

// 标签
UrlMapping.POST_LABELSORT_QUERYALL = UrlMapping.origin + '/api/labelSort/queryAll';   // 查询所有标签

module.exports = UrlMapping;
