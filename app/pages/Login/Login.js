/*
 * 说明：登录页面
 * 时间：2018/11/6 15:52
 * 创建：Vin Gogh
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TextInput,
  ImageBackground,
  DeviceEventEmitter,
  NativeModules,
  Linking,
  Platform,
  Keyboard,
  SafeAreaView
} from 'react-native';
import Button from '../../components/Button'
import LoadingCircleFull from '../../components/LoadingCircleFull'
import CodePush from 'react-native-code-push';
 
import * as Data from "../../utils/Data"
import { connect } from 'react-redux'; 
import {compareVersion,getNowVersion} from "../../utils/VersionUpdate"
import {  Toast } from 'native-base';
import { JSEncrypt } from 'jsencrypt';
import GLOBAL_CONFIG from '../../constants/Global'; 
import ERROR_CONFIG from '../../constants/Error'; 
import * as loginCreators from '../../actions/login';
import { bindActionCreators } from 'redux';
import NavigationUtil from '../../utils/NavigationUtil';
import storeSimple from 'react-native-simple-store';

const headBg=require('../../img/login/login_background.png');
const userName=require('../../img/login/icon_input_user.png');
const passWord=require('../../img/login/icon_input_password.png');
const encrypt = new JSEncrypt(); //初始化字符串加密对象
	  encrypt.setPublicKey(GLOBAL_CONFIG.publicKey); //设置公钥
let isLogining=false;
let userInfo;
console.log('登录页进来了')

class Login extends Component {
  static navigationOptions = { 
    header: null
  }

  constructor(props) {
    super(props);
    this.state = { user: '', password: '',loadState:false };  
  }

  componentWillMount(){
    const ov = getNowVersion();
    Data.getSerVersion((res) => { 
      if(res.status == 1) {//获取成功
        const nv = Platform.OS === "ios" ? res.ios_version : res.android_version;
        if(compareVersion(ov,nv)){
          Alert.alert(
            '温馨提示',
            '检测到最新版本，本次更新优化了功能操作 ，不更新会影响您的使用，强烈建议更新！！！',
            [
              {text: "取消", style: 'cancel'},
              {text: '更新', onPress: () => {
                if(Platform.OS === "ios"){ 
                  Linking.openURL(res.ios_url);
                }else{
                  NativeModules.upgrade.upgrade(res.android_url); 
                  DeviceEventEmitter.addListener('LOAD_PROGRESS',(msg)=>{
                      let title = "当前下载进度：" + msg ;
                      // ToastAndroid.show(title, ToastAndroid.SHORT);  
                      Toast.show({
                        text: title,
                        buttonText: 'Okay' 
                      })
                  }); 
                }
              }}
            ],
            { cancelable: false }
          )
        }
      } 
    },(err) => {
      console.log(err);
    })

    console.log('login热更新前')
    CodePush.sync({
      // deploymentKey: 'xZ3BqnCoE4BbGpOG-asclkJ29BEn2843c37b-557c-497b-92d7-78c4091dd020',//code-push Staging environment android
      // deploymentKey: '2495IcGj_UcrmBbFuHzTj6sXE1Uz2843c37b-557c-497b-92d7-78c4091dd020',//code-push Product environment android
      deploymentKey: 'SBObPh1rdxkwPgCtfkzIZhlpd8Yh2843c37b-557c-497b-92d7-78c4091dd020',
      //code-push Staging environment ios
      // deploymentKey: 'sYj-DCMKuckwO2YdesfrjEzqDNbW2843c37b-557c-497b-92d7-78c4091dd020',
      //code-push Product environment ios
      updateDialog: {
        optionalIgnoreButtonLabel: '稍后',
        optionalInstallButtonLabel: '后台更新',
        optionalUpdateMessage: '智慧少先队有新版本了，是否更新？',
        title: '更新提示',
        mandatoryContinueButtonLabel :'确认',//强制更新按钮
        mandatoryUpdateMessage :'有重要修改，为不影响您的使用体验，请确认更新',//强制更新提示内容
        appendReleaseDescription: true, //(Boolean) - 是否显示更新description，默认false
        descriptionPrefix :''//String) - 更新说明的前缀。 默认是” Description: “
      },
      installMode: CodePush.InstallMode.ON_NEXT_RESTART
    });
    
  } 

  componentDidMount() { 
    
  }

  //检测用户名和密码是否合法
	checkFormData(userName, password) {
		var regTel = /^0?1[2|3|4|5|6|7|8|9][0-9]\d{8}$/;
		var regPwd = /^[a-zA-Z0-9]+$/;
		if(userName == "" || password == "") {
      Toast.show({
        text: '用户名或密码不能为空'
      })
			isLogining = false;
			return;
		}
		if(!regTel.test(userName)) {
      Toast.show({
        text: '请输入正确的手机号码'
      })
			isLogining = false;
			return;
		}
		if(!regPwd.test(password)) {
      Toast.show({
        text: '密码错误'
      })
			isLogining = false;
			return;
		}
		if(password.length < 6) {
      Toast.show({
        text: '密码错误'
      })
			isLogining = false;
			return;
		}
		if(password.length > 18) { 
      Toast.show({
        text: '密码错误'
      })
			isLogining = false;
			return;
		}
		return true
	}

  login(){
    const { loginActions } = this.props;
    console.log("press login");
    Keyboard.dismiss();
    if(!isLogining) {
      isLogining = true;
      let userName = this.state.user,
        password = this.state.password.trim();
      let pd = password;
      if(this.checkFormData(userName, password)) {
        password = encrypt.encrypt(password); //对密码进行加密操作
        this.setState({loadState:true}); 
        Data.login({
          userName: userName,
          passWord: password,
          gPassWord: '', 
          userType: '3'
        },(res) => {  
          console.log('===用户账号密码登录===' + JSON.stringify(res)); 
          this.setState({loadState:false});
          isLogining = false;
          if(res.SystemCode == 1) { //登录验证通过 
            userInfo = res.data; 
            loginActions.setCurrentRole(res.defaultRole);
            loginActions.setPassword(pd);
            this.loginSuccess(userInfo);
          } else if(res.SystemCode == 1008) {
            Toast.show({
              text: '该用户正在等待审核'
            })
            return;
          } else {
            Toast.show({
              text: ERROR_CONFIG[res.SystemCode]
            })
          }
        },(err)=> {
          console.log(err);
          this.setState({loadState:false});
          Toast.show({
            text: '服务器异常，请稍后重试！'
          })
          isLogining = false;
        })
      }
    }
  }

  loginSuccess(userInfo){
    // const { loginActions } = this.props; 
    // loginActions.setUserInfo(userInfo);
    storeSimple.save("userInfo",userInfo);
    Data.validateHaveChildren((res) => {  
        console.log('===是否存在孩子===' + JSON.stringify(res)); //0不存在 大于0存在
        if(res.SystemCode == 1) {
          this.setChildState(res.childrenNumbers)
        } else {
          this.setChildState(0)
        }
      },(err)=> {
        console.log('===查询孩子信息失败===' + JSON.stringify(err));
			  this.setChildState(0); 
      })
  }

  setChildState(childNum){
    const { loginActions } = this.props; 
    loginActions.setIsHaveChild(childNum+'');
    NavigationUtil.reset(this.props.navigation,'Home')//打开首页
    Toast.show({
      text: '登录成功'
    })
  }

  
  render() { 
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ImageBackground source={headBg} style={{width:'100%' , height:'100%'}} resizeMode="stretch"> 
          <View style={styles.content}> 
            <View  style={styles.title}> 
              <Text  style={styles.titleText}>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Text>
              <Text  style={styles.english}>L&nbsp;&nbsp;&nbsp;O&nbsp;&nbsp;&nbsp;G&nbsp;&nbsp;&nbsp;I&nbsp;&nbsp;&nbsp;N</Text>
            </View>
            <View style={styles.formBox}>
              <View style={styles.input}>
                <Image source={userName} style={styles.inputImg} resizeMode="contain"></Image>
                <TextInput
                  style={styles.textInput}
                  placeholder={'请输入用户名'} 
                  onChangeText={(user) => {
                    this.setState({user})
                  }}  
                  underlineColorAndroid="transparent"
                  value={this.state.user}    
                />
              </View>
              <View style={styles.input1}>
                <Image source={passWord} style={styles.inputImg} resizeMode="contain"></Image>
                <TextInput
                  style={styles.textInput}
                  placeholder={'请输入密码'}
                  onChangeText={(password) => this.setState({password})}
                  secureTextEntry={true} 
                  underlineColorAndroid="transparent"
                  value={this.state.password}     
                />
              </View>
              <Button
                onPress={this.login.bind(this)}
                text="登    录"
                style={styles.loginButton}
                containerStyle={styles.loginContainer}
              />
              <View style={styles.footBtns}>
                <Text style={styles.footBtn1}
                      onPress={() => {
                        this.props.navigation.navigate("Register");
                      }}
                >
                  注册账号
                </Text>
                <Text style={styles.footBtn}
                      onPress={() => {
                        this.props.navigation.navigate("ForgetPsw");
                      }}
                >
                  忘记密码
                </Text>
              </View>
            </View>
          </View>
          <LoadingCircleFull visible={this.state.loadState}></LoadingCircleFull>
        </ImageBackground>
      </SafeAreaView>
      
    );
  }
}



const styles = StyleSheet.create({
  safeContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent:"flex-start"
  },
  content:{
    // paddingTop:15
    zIndex:1
  },
  loginContainer: {
    justifyContent: "center",
    display:"flex",
    width:"100%"
  },
  loginButton: {
    backgroundColor: "#eb3a3a",
    textAlign: "center",
    width: "100%",
    color: "white",
    paddingTop: 4,
    paddingBottom:4
  },
  title:{
    width: "100%",
    marginTop:Platform.OS === "ios" ? 210 : 185,
    marginBottom: 20 
  },
  titleText:{
    textAlign: "center",
    fontSize: 20, 
    color: "#eb3a3a",
    fontWeight: "bold"
    
  },
  english:{
    textAlign: "center",
    fontSize: 14, 
    color: "#eb3a3a", 
    fontWeight: "200"
  },
  formBox:{
    width:"85%",
    marginLeft:"auto",
    marginRight:"auto"
  },
  input:{
    flexDirection: "row",
    borderBottomColor: 'gray', borderBottomWidth: 0.5,
    marginBottom:10
  },
  input1:{
    flexDirection:"row",
    marginBottom: 30,
    borderBottomColor: 'grey', borderBottomWidth: 0.5
  },
  inputImg:{
    width:20,
    position:"absolute",
    left:5
  },
  textInput:{
    height: 45,  width: "100%", lineHeight: 20, paddingLeft: 35, color: "gray", paddingTop: 0, paddingBottom: 0
  },
  footBtns:{
    flexDirection:"row",
    justifyContent:"center"
  },
  footBtn:{
    color: "#eb3a3a",
    width:100,
    textAlign: "center",
    marginTop:15
  },
  footBtn1:{
    color: "#eb3a3a",
    width:100,
    textAlign: "center",
    marginTop:15,
    borderRightWidth:1,
    borderRightColor:'#cccccc',
  }
});

const mapStateToProps = (state) => {
  // const { category } = state;
  // return {
  //   category
  // };
  return state;
};

const mapDispatchToProps = (dispatch) => {
  const loginActions = bindActionCreators(loginCreators, dispatch);
  return {
    loginActions
  };
};


export default  connect( mapStateToProps,mapDispatchToProps)(Login);
