/*
 * 说明：忘记密码
 * 时间：2019/1/15 9:30
 * 创建：Vin Gogh
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button'
 
import * as Data from "../../utils/Data"
import { connect } from 'react-redux'; 
import {  Toast } from 'native-base';
import { JSEncrypt } from 'jsencrypt';
import GLOBAL_CONFIG from '../../constants/Global'; 
import ERROR_CONFIG from '../../constants/Error'; 
import * as loginCreators from '../../actions/login';
import { bindActionCreators } from 'redux';
import Loading from '../../components/Loading';
import NavigationUtil from '../../utils/NavigationUtil';

let timer;
let remainTime =60;
const encrypt = new JSEncrypt(); //初始化字符串加密对象
	  encrypt.setPublicKey(GLOBAL_CONFIG.publicKey); //设置公钥

class ForgetPsw extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '找回密码',
    headerRight: (
      <Icon.Button
        name="md-checkmark"
        backgroundColor="transparent"
        underlayColor="transparent"
        activeOpacity={0.8}
        onPress={() => {
            console.log('完成');
            navigation.state.params.handleReset();
        }}
      />
    )
  });

  constructor(props) {
    super(props);
    this.state = {userPhone:'',password:'',confirmPassWord:'',vCode:'',disabled:false,sendVcodeText:'发送验证码',loadState:false };  
  }

  componentWillMount(){
    
  } 

  componentDidMount() { 
    this.props.navigation.setParams({ handleReset: this.resetPassword.bind(this) });
  }

  resetPassword(){
    console.log('press resetPassword');
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
      Data.forgotPwd(this.state.userPhone.trim(),this.state.vCode.trim(),this.state.password.trim(),(res) => {
        console.log('===找回密码===' + JSON.stringify(res));
        this.setState({loadState:false},()=>{
          if(res.SystemCode == 1) { //修改成功
              Toast.show({
                  text: '修改成功'
              })
              setTimeout(()=> {
                NavigationUtil.reset(this.props.navigation,'Login')//打开登录
              }, 1000)
          } else if(res.SystemCode == 1003) { //用户不存在
              Toast.show({
                  text: '用户不存在'
              })
          } else if(res.SystemCode == 10005) { //验证码超时
              Toast.show({
                  text: '验证码超时'
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
              text: '操作失败，稍后重试'
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
    Data.sendCheckMsg(this.state.userPhone.trim(),'2',(res) => {
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
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <View style={styles.content}> 
                    <View style={styles.formBox}>
                    <View style={styles.input}>
                        <Text style={styles.lable}>手机号码</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder={'请填写手机号码'} 
                        onChangeText={(userPhone) => {
                            this.setState({userPhone})
                        }}  
                        underlineColorAndroid="transparent"
                        value={this.state.userPhone}    
                        />
                    </View>
                    <View style={styles.input1}>
                        <Text style={styles.lable}>新的密码</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder={'请输入新的密码'}
                        onChangeText={(password) => this.setState({password})}
                        secureTextEntry={true} 
                        underlineColorAndroid="transparent"
                        value={this.state.password}     
                        />
                    </View>
                    <View style={styles.input2}>
                        <Text style={styles.lable}>确认密码</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder={'请再次输入新的密码'}
                        onChangeText={(confirmPassWord) => this.setState({confirmPassWord})}
                        secureTextEntry={true} 
                        underlineColorAndroid="transparent"
                        value={this.state.confirmPassWord}     
                        />
                    </View>
                    <View style={styles.input3}>
                        <Text style={styles.lable}>验证码</Text>
                        <TextInput
                        style={styles.textInputV}
                        placeholder={'请填写验证码'}
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
                    
                    </View>
                </View>
                <Loading visible={this.state.loadState} waitingText="找回中..."></Loading>
            </View>
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
    container:{
        paddingTop:6,
        paddingLeft:6,
        paddingRight:6
    },
    content:{
        // paddingTop:15
        backgroundColor:"white"
    },
    grey:{
        color:"grey",
        fontSize:12,
        lineHeight:20,
        marginBottom:10
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
        bottom:8
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
    lable:{
        width:100,
        position:"absolute",
        left:5,
        top:Platform.OS === "ios" ? 15 : 13,
        textAlign:'left',
        color:'black'
    },
    textInput:{
        height: 45,  width: "100%", lineHeight: Platform.OS === "ios" ? 18 : 20, paddingLeft: 72, color: "gray", paddingTop: 0, paddingBottom: 0
    },
    textInputV:{
        height: 45,  width: "70%", lineHeight: 20, paddingLeft: 72, color: "gray", paddingTop: 0, paddingBottom: 0
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


export default  connect( mapStateToProps,mapDispatchToProps)(ForgetPsw);
