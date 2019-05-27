/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import GLOBAL_CONFIG from './Global'
export const WEXIN_ARTICLE_LIST = 'http://route.showapi.com/582-2';
export const WEXIN_ARTICLE_TYPE = 'http://route.showapi.com/582-1';

/*主机地址*/
	// export const HOST_CONFIG =  'http://192.168.241.21:8081/zhsxd/'; //桂程 
//	export const HOST_CONFIG =  'http://192.168.241.17:8080/zhssd/';//丁辉
// 	export const HOST_CONFIG = "http://192.168.241.113:8080/zhsxd/"; //李志伟
//	export const HOST_CONFIG = "http://192.168.241.111:8088/zhssd/"; //向龙
//	export const HOST_CONFIG = "http://192.168.241.128:8080/zhsxd/"; //王星星
//	export const HOST_CONFIG = "http://192.168.1.113:8580/"; //钱迪
//	export const HOST_CONFIG = 'http://192.168.241.96/zhsxd/'; //陈星明
	// export const HOST_CONFIG = 'http://192.168.241.40:8089/zhsxd/'; //黄梦舒
//  export const HOST_CONFIG = 'http://192.168.31.186:8080/zhsxd/'; //仇中雪
// export const HOST_CONFIG = 'http://192.168.241.48:18080/zhsxd/'; //内网测试
//  export const HOST_CONFIG = 'http://192.168.31.56:8080/zhsxd/'; //蒋帅
//	export const HOST_CONFIG = 'http://120.55.168.21:28080/zhsxd/'; //预生产  
	export const HOST_CONFIG = 'http://47.102.23.142:8080/zhsxd/'; //负载均衡


/*图片服务器*/
export const IMAGE_SERVER = ''; //测试图片服务
export const FILE_UPLOAD = HOST_CONFIG + 'mobile/upload/uploadFile'; //阿里oss存贮
export const UPLOAD_URL = HOST_CONFIG + 'mobile/upload/sts'; //断点续传sts
export const OSS_URL = 'https://zhsxd.oss-cn-shanghai.aliyuncs.com'; //阿里域名
export const OSS_URL_TEST = 'https://jsruiyin.oss-cn-hangzhou.aliyuncs.com'; //测试环境阿里域名
/*图片操作*/
export const IMAGE_GET_CONFIG = IMAGE_SERVER + ''; //获取图片
export const IMAGE_UPLOAD_CONFIG = IMAGE_SERVER + 'api/uploadImage/'; //上传图片

/*腾讯地图*/
export const TENGXUN_MAP_URL = 'https://apis.map.qq.com/ws/geocoder/v1/?key='+GLOBAL_CONFIG.tengxunMapKey+'&location='

/*自动更新*/
export const APP_UPDATE_SERVER = HOST_CONFIG + 'resources/app-version.json';

/*操作手册*/
export const APP_OPERATION_MANUAL = HOST_CONFIG + 'resources/operation-document.html'

/*接口地址*/
export const API_CONFIG = {
    //登录
    login: HOST_CONFIG + 'mobile/login/userLogin',
    //天气
    getWeather: HOST_CONFIG + 'mobile/weather/getWeather',
    //活动列表
    getActivityList: HOST_CONFIG + 'mobile/activity/getActivity',
    //培训列表
    getTrainList: HOST_CONFIG + 'mobile/activity/getTrain',
    //活动详情
    getActivityDetail: HOST_CONFIG + 'mobile/activity/getActivityDetails',
    //发送短信验证码
    sendCheckMsg: HOST_CONFIG + 'mobile/login/sendCheckMsg',
    //主页面推荐列表
    getListRecommend: HOST_CONFIG + 'mobile/info/listRecommend',
    //主页面新闻列表
    getNewsList: HOST_CONFIG + 'mobile/info/listNews',
    //主页面文章列表
    getArticleList: HOST_CONFIG + 'mobile/info/listArticle',
    //文章和新闻获详情
    getNewsDetail: HOST_CONFIG + 'mobile/info/getId',
    //查看文章和新闻的评论
    getNewsComment: HOST_CONFIG + 'mobile/info/listComment',
    //注册提交
    userRegister: HOST_CONFIG + 'mobile/login/userRegister',
    //获取区域or学习
    getAreaList: HOST_CONFIG + 'mobile/login/getAreaList',
    //获取班级
    getClassName: HOST_CONFIG + 'mobile/login/getClassName',
    //获取学校or班级数据
    //		getLinkage: HOST_CONFIG + 'mobile/login/getLinkage',
    //修改密码
    updatePassword: HOST_CONFIG + 'mobile/login/updatePassword',
    //清空手势密码
    closeGpassword: HOST_CONFIG + 'mobile/login/closeGpassword',
    //注册提交确认信息
    saveStudent: HOST_CONFIG + 'mobile/login/saveStudent',
    //公告
    getAnnoucementList: HOST_CONFIG + 'mobile/info/listAnnouncement',
    //对咨询添加评论
    addComment: HOST_CONFIG + 'mobile/info/addComment',
    //收藏新闻和活动
    collectActivity: HOST_CONFIG + 'mobile/activity/collectActivity',
    //取消收藏
    cancelCollect: HOST_CONFIG + 'mobile/activity/cancelCollect',
    //我的中队列表
    squadronIdxList: HOST_CONFIG + 'mobile/squadron/listData',
    //提交签到
    produceCredits: HOST_CONFIG + 'mobile/cretid/produceCredits',
    //获取签到积分总数
    getCredits: HOST_CONFIG + 'mobile/cretid/getCredits',
    //获取签到活动总数
    getMyActivityCount: HOST_CONFIG + 'mobile/activity/getMyActivityCount',
    //获取签到徽章总数
    getMyMedalCount: HOST_CONFIG + 'mobile/medal/getMyMedalCount',
    //签到内活动兑换列表
    fnGetActivityListInSign: HOST_CONFIG + 'mobile/activity/myCostActivity',
    //忘记密码
    forgotPwd: HOST_CONFIG + 'mobile/login/rememberPassword',
    //新增圈子
    addSquadron: HOST_CONFIG + 'mobile/squadron/save',
    //收藏列表
    collectList: HOST_CONFIG + 'mobile/mine/getMyCollect',
    //新闻点赞
    addNewsPraise: HOST_CONFIG + 'mobile/info/newsPraise',
    //活动报名
    activitySignIn: HOST_CONFIG + 'mobile/activity/activityApplyOption',
    //中队圈列表
    circleList: HOST_CONFIG + 'mobile/squadron/listData',
    //删除圈子
    delCircleItem: HOST_CONFIG + 'mobile/squadron/delete',
    //圈子点赞
    praiseCircleItem: HOST_CONFIG + 'mobile/squadron/admireInsert',
    //取消圈子点赞
    cancelPraise: HOST_CONFIG + 'mobile/squadron/admireDelete',
    //我的反馈列表
    getFeedbackList: HOST_CONFIG + 'mobile/feedback/feedbackList',
    //添加反馈
    addFeedback: HOST_CONFIG + 'mobile/feedback/addFeedback',
    //评论列表
    listData: HOST_CONFIG + 'mobile/newsComment/listData',
    //我的活动
    myActivity: HOST_CONFIG + 'mobile/activity/myActivity',
    //我的活动作品页面
    myActivityDetail: HOST_CONFIG + 'mobile/activity/myActivityDetail',
    //删除我的活动
    delActivityWorksDetail: HOST_CONFIG + 'mobile/homework/delete',
    //推荐活动作品
    recmondWorksDetail: HOST_CONFIG + 'mobile/homework/recmond',
    //获取作品详情
    myWork: HOST_CONFIG + 'HomeworkClientService/getByActId',
    //提交作业
    uploadWork: HOST_CONFIG + 'mobile/homework/upload',
    //积分兑换列表
    getGoodsList: HOST_CONFIG + 'mobile/point/goods/listData',
    //积分详情
    getMyPoints: HOST_CONFIG + 'mobile/mine/getMyPoints',
    //token旧换新
    tokenExchange: HOST_CONFIG + 'mobile/login/changToken',  
    //景点介绍
    //listScenic: HOST_CONFIG + 'mobile/tourist/listScenic',
    //获取区域列表
    //getAreaSenseList : HOST_CONFIG+ 'mobile/tourist/list',
    //景点详情
    //listScenicDetail: HOST_CONFIG + 'mobile/tourist/listScenicDetail',
    //旅游路线列表
    //listRoute: HOST_CONFIG + 'mobile/tourist/listRoute',
    //旅游路线详情
    //listRouteDetail: HOST_CONFIG + 'mobile/tourist/listRouteDetail',
    //最新活动接口
    getNewActivityList: HOST_CONFIG + 'mobile/activity/getNewActivity',
    //宁聚青春注册接口
    //serRegisterNjqc: HOST_CONFIG + 'mobile/login/userRegisterNjqc',
    //获取用户信息
    getUserInfo: HOST_CONFIG + 'mobile/userDetail/getByUserId',
    //提交修改用户信息
    saveUserInfo: HOST_CONFIG + 'mobile/userDetail/save',
    //获取班级列表
    getClassList: HOST_CONFIG + 'mobile/mine/getClassList',
    //修改用户头像
    changeImage: HOST_CONFIG + 'mobile/userDetail/changeImage',
    //MD5加密
    //MD5String:HOST_CONFIG + 'mobile/tourist/MD5String',
    //是否有学生信息
    validateHaveChildren: HOST_CONFIG + 'mobile/login/validateHaveChildren',
    //添加学生
    addStudent: HOST_CONFIG + 'mobile/mine/addStudent',
    //更新学生
    updateStudent: HOST_CONFIG + 'mobile/mine/updateStudent',
    //查询学生列表
    findStudentList: HOST_CONFIG + 'mobile/mine/findStudentList',
    //切换默认孩子
    switchRole: HOST_CONFIG + 'mobile/mine/changeChildRole',
    //查询角色列表
    getRoleList: HOST_CONFIG + 'mobile/mine/roleList',
    //切换角色
    changeManageRole: HOST_CONFIG + 'mobile/mine/changeManageRole',
    //我的中队
    getByClass: HOST_CONFIG + 'mobile/homework/getByClass',
    //审批列表
    getScheduleList: HOST_CONFIG + 'mobile/mine/findTeacherStudentList',
    //我的徽章
    myMedal: HOST_CONFIG + 'mobile/mine/myMedal',
    //审批学生
    examineStudent: HOST_CONFIG + 'mobile/mine/examineStudent',
    //我的兑换
    getExchangeList: HOST_CONFIG + 'mobile/point/certificate/listData',
    //主题活动
    themeContainsActivities: HOST_CONFIG + 'mobile/activity/themeContainsActivities',
    //删除孩子
    deleteChild: HOST_CONFIG + 'mobile/mine/deleteChild',
    //扫描二维码
    scanCode: HOST_CONFIG + 'mobile/point/certificate/scanCode',
    //取消活动报名
    cancelActivity: HOST_CONFIG + 'mobile/',
    //小交警寒假特训中的提交作业接口
    submitwork: HOST_CONFIG + 'mobile/submitwork/upload',
    //删除活动详情新
    delActivityWorksDetail1: HOST_CONFIG + 'mobile/submitwork/delete',
    //获取交通答题题库
    trafficQustions: HOST_CONFIG + 'mobile/exam/beginExam',
    //提交交通答题
    commitAnswer: HOST_CONFIG + 'mobile/exam/endExam',
};