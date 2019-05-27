/*
 * 说明：注册页面
 * 时间：2018/11/6 15:52
 * 创建：Vin Gogh
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ImageBackground,
  Platform,
  Keyboard
} from 'react-native';
import Button from '../../components/Button'
 
import * as Data from "../../utils/Data"
import {  Toast } from 'native-base';
import { JSEncrypt } from 'jsencrypt';
import GLOBAL_CONFIG from '../../constants/Global'; 
import ERROR_CONFIG from '../../constants/Error'; 
import Loading from '../../components/Loading';
import NavigationUtil from '../../utils/NavigationUtil';

const headBg=require('../../img/login/login_background.png');
const userPhone=require('../../img/login/icon_input_phone.png');
const passWord=require('../../img/login/icon_input_password.png');
const confirmPassWord=require('../../img/login/icon_input_password_sure.png');
const vCode=require('../../img/login/icon_input_code.png');
let timer;
let remainTime =60;
const encrypt = new JSEncrypt(); //初始化字符串加密对象
	  encrypt.setPublicKey(GLOBAL_CONFIG.publicKey); //设置公钥

class Register extends Component {
  static navigationOptions = { 
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {userPhone:'',password:'',confirmPassWord:'',vCode:'',disabled:false,sendVcodeText:'发送验证码',loadState:false };  
  }

  componentWillMount(){
    
  } 

  componentDidMount() { 
    
  }

  register(){
    console.log('press register');
    Keyboard.dismiss();
    if(!this.state.userPhone.trim()) {
        Toast.show({
            text: '请输入手机号'
        })
        return;
    }
    if(!/^0?1[2|3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.state.userPhone.trim())) {
        Toast.show({
            text: '请输入正确的手机号'
        })
        return;
    }
    if(!this.state.password.trim() || !this.state.confirmPassWord.trim()) {
        Toast.show({
            text: '两次密码需填写完整'
        })
        return;
    }
    if(this.state.password.trim().length < 6 || this.state.password.trim().length > 18) {
        Toast.show({
            text: '密码长度为6~18位'
        })
        return;
    }
    if(this.state.confirmPassWord.trim().length < 6 || this.state.confirmPassWord.trim().length > 18) {
        Toast.show({
            text: '密码长度为6~18位'
        })
        return;
    }
    if(this.state.password.trim() !== this.state.confirmPassWord.trim()) {
        Toast.show({
            text: '两次密码不一致'
        })
        return;
    }
    if(!/^[a-zA-Z0-9]+$/.test(this.state.password.trim()) || !/^[a-zA-Z0-9]+$/.test(this.state.confirmPassWord.trim())) {
        Toast.show({
            text: '密码不能含有特殊字符'
        })
        return;
    }

    if(!this.state.vCode.trim()) {
        Toast.show({
            text: '请输入验证码'
        })
        return;
    }

    //还应调取后台接口验证验证码的正确性
    			// var userPassword = encrypt.encrypt(ui.password.value.trim()); //对密码进行加密操作 => 弃用
    this.setState({loadState:true},() => {
      Data.userRegister(this.state.userPhone.trim(),this.state.vCode.trim(),this.state.password.trim(),(res) => {
        console.log('===用户注册===' + JSON.stringify(res));
        this.setState({loadState:false},()=>{
          if(res.SystemCode == 1) { //注册成功
              Toast.show({
                  text: '注册成功，请登录'
              })
              setTimeout(function() {
                NavigationUtil.reset(this.props.navigation,'Login')//打开登录
              }, 1000)
          }
          else if(res.SystemCode == 10005) { //验证码过期
              Toast.show({
                  text: '验证码过期'
              })
          } else if(res.SystemCode == 10006) { //手机号和验证码不匹配
              Toast.show({
                  text: '验证码错误'
              })
          } else {
              Toast.show({
                  text: ERROR_CONFIG[res.SystemCode]
              })
          }
        });
      },(err) => {
        this.setState({loadState:false},()=>{
          Toast.show({
              text: '服务器异常，请稍后重试！'
          })
        })
      })
    });
    
  }

  sendVcode(){
    //判断手机号是否合法，合法则调取短信，不合法return
    const regTel = /^0?1[2|3|4|5|6|7|8|9][0-9]\d{8}$/;
    if(!this.state.userPhone.trim()) {
        Toast.show({
            text: '请输入手机号'
        })
        return;
    }
    if(!regTel.test(this.state.userPhone.trim())) {
        Toast.show({
            text: '请输入正确的手机号'
        })
        return;
    }
    Data.sendCheckMsg(this.state.userPhone.trim(),'1',(res) => {
        console.log('===发送短信===' + JSON.stringify(res));
        if(res.SystemCode == 1) { //发送成功
            Toast.show({
                text: '发送成功'
            })
            this.setTimerOne();
        } else if(res.SystemCode == 10005) { //短信还在有效期内

        }
    },(err) => {
        Toast.show({
            text: '服务器异常，请稍后重试！'
        })
    })
  }

  setTimerOne(){
    if(timer) {
        clearTimeout(timer);
    }
    this.setState({disabled:true},()=>{
        this.setState({sendVcodeText:remainTime + '秒'},()=>{
            remainTime--;
            if(remainTime === -1) {
                this.setState({disabled:false},()=>{
                    this.setState({sendVcodeText:'发送验证码'},()=>{
                        clearTimeout(timer);
                        remainTime = 60;
                        return;
                    })
                })
            }
            timer = setTimeout(this.setTimerOne.bind(this), 1000);
        })
    })
    
  }
  
  render() { 
    return (
      <View>
        <ImageBackground source={headBg} style={{width:'100%' , height:'100%'}} resizeMode="stretch"> 
          <View style={styles.content}> 
            <View  style={styles.title}> 
              <Text  style={styles.titleText}>注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</Text>
              <Text  style={styles.english}>S&nbsp;I&nbsp;G&nbsp;N&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U&nbsp;P</Text>
            </View>
            <View style={styles.formBox}>
              <View style={styles.input}>
                <Image source={userPhone} style={styles.inputImg} resizeMode="contain"></Image>
                <TextInput
                  style={styles.textInput}
                  placeholder={'请输入手机号'} 
                  onChangeText={(userPhone) => {
                    this.setState({userPhone})
                  }}  
                  underlineColorAndroid="transparent"
                  value={this.state.userPhone}    
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
              <View style={styles.input2}>
                <Image source={confirmPassWord} style={styles.inputImg} resizeMode="contain"></Image>
                <TextInput
                  style={styles.textInput}
                  placeholder={'请确认密码'}
                  onChangeText={(confirmPassWord) => this.setState({confirmPassWord})}
                  secureTextEntry={true} 
                  underlineColorAndroid="transparent"
                  value={this.state.confirmPassWord}     
                />
              </View>
              <View style={styles.input3}>
                <Image source={vCode} style={styles.inputImg} resizeMode="contain"></Image>
                <TextInput
                  style={styles.textInputV}
                  placeholder={'请输入验证码'}
                  onChangeText={(vCode) => this.setState({vCode})}
                  underlineColorAndroid="transparent"
                  value={this.state.vCode}     
                />
                <Button
                    disabled={this.state.disabled}
                    onPress={this.sendVcode.bind(this)}
                    text={this.state.sendVcodeText}
                    style={styles.vCodeBtn}
                    containerStyle={styles.vCodeBtnContainer}
                />
              </View>
              <Text style={styles.grey}>密码长度6~18位，不能含有特殊字符</Text>
              <Button
                onPress={this.register.bind(this)}
                text="注    册"
                style={styles.loginButton}
                containerStyle={styles.loginContainer}
              />
              <View style={styles.footBtns}>
                
                <Text style={styles.footBtn}
                      onPress={() => {
                        NavigationUtil.reset(this.props.navigation,'Login')//打开登录
                      }}
                >
                  我要登陆
                </Text>
              </View>
            </View>
          </View>
          <Loading visible={this.state.loadState} waitingText="提交中..."></Loading>
        </ImageBackground>
      </View>
      
    );
  }
}



const styles = StyleSheet.create({
  content:{
    // paddingTop:15
  },
  grey:{
    color:"grey",
    fontSize:12,
    lineHeight:20,
    marginBottom:5
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
    paddingBottom:4,
    fontSize:20
  },
  vCodeBtnContainer: {
    justifyContent: "center",
    display:"flex",
    width:"30%",
    position:'absolute', 
    right:0,
    bottom: 8,
    borderRadius:15
  },
  vCodeBtn:{
    backgroundColor: "#f0ad4e",
    textAlign: "center",
    width: "100%",
    color: "white",
    paddingTop: 6,
    paddingBottom:6,
    fontSize:15,
    borderRadius: 15,
    overflow:'hidden'
  },
  title:{
    width: "100%",
    marginTop:Platform.OS === "ios" ? 210 : 185,
    marginBottom: 15 
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
    marginBottom:6
  },
  input1:{
    flexDirection:"row",
    marginBottom: 6,
    borderBottomColor: 'grey', borderBottomWidth: 0.5
  },
  input2:{
    flexDirection:"row",
    marginBottom: 6,
    borderBottomColor: 'grey', borderBottomWidth: 0.5
  },
  input3:{
    flexDirection:"row",
    marginBottom: 10,
    borderBottomColor: 'grey', borderBottomWidth: 0.5
  },
  inputImg:{
    width:16,
    position:"absolute",
    left:5
  },
  textInput:{
    height: 45,  width: "100%", lineHeight: 20, paddingLeft: 35, color: "gray", paddingTop: 0, paddingBottom: 0
  },
  textInputV:{
    height: 45,  width: "70%", lineHeight: 20, paddingLeft: 35, color: "gray", paddingTop: 0, paddingBottom: 0
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

export default  Register;
