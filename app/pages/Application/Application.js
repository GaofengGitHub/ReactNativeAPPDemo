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
import React from 'react';
import {
  InteractionManager,
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import Geolocation from 'Geolocation';

import * as Data from "../../utils/Data";
import NavigationUtil from '../../utils/NavigationUtil';
import ERROR_CONFIG from '../../constants/Error'; 
import { Toast,Text,Title } from 'native-base';


// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');
const annuncement = require('../../img/application/app_announcement.png');
const signIn = require('../../img/application/app_signIn.png');
const space = require('../../img/application/app_my_home.png');
const questions = require('../../img/application/app_develop_lo.png');
const badge = require('../../img/application/app_my_badge.png');
const collection = require('../../img/application/app_collection.png');
const more = require('../../img/application/app_more.png');
const localIcon= require('../../img/application/app_icon_location.png');



class Application extends React.Component {
    static navigationOptions = {
        title: '应用', 
        header:null,
        tabBarIcon: ({ focused, tintColor }) => {
            if(focused){
            home=require(`../../img/main/nav-app-active.png`)
            }else{ 
            home=require(`../../img/main/nav-app.png`) 
            } 
            return <Image source={home} style={{"width":20}} resizeMode="contain"></Image>
        }
    };
  constructor(props) {
    super(props);
    this.state = {
      weatherContent:{},
      LocalPosition:'',
      cityName:'',
      district:''
    };
  }

  componentDidMount() {
    
    InteractionManager.runAfterInteractions(() => {
    });
  }

  componentWillMount() {
    this.getlocal(this.getWeather.bind(this));
  }

  getlocal(cb) {
    Geolocation.getCurrentPosition(
      val => {
        let ValInfo =
          '速度：' +
          val.coords.speed +
          '\n经度：' +
          val.coords.longitude +
          '\n纬度：' +
          val.coords.latitude +
          '\n准确度：' +
          val.coords.accuracy +
          '\n行进方向：' +
          val.coords.heading +
          '\n海拔：' +
          val.coords.altitude +
          '\n海拔准确度：' +
          val.coords.altitudeAccuracy +
          '\n时间戳：' +
          val.timestamp;
        this.setState({ LocalPosition: ValInfo });
        Data.lonlatToLocation(val.coords.longitude,val.coords.latitude,(res) => {
          console.log('===地理位置===' + JSON.stringify(res));
          if(res.result.address_component) { //包含城市名
            this.setState({cityName:res.result.address_component.city,district:res.result.address_component.district},() => {
              cb();
            })
          } else {
            this.setState({cityName:'南京市'},() => {
              cb();
            })
          }
          
        },(err) => {
          console.log("err"+err);
          if(err=="Error: 599"){
            Toast.show({
              text: '身份验证过期，请退出重新登录'
            })
            NavigationUtil.reset(this.props.navigation, 'Login');
          }else{
            Toast.show({
              text: '定位出错'
            })
          }
        })
      },
      val => {
        let ValInfo = '获取坐标失败：' + val;
        this.setState({ LocalPosition: ValInfo }); //如果为空的话 没允许开启定位服务

      },
    );
  }

  getWeatherData(){
    Data.getWeather(this.state.cityName,(res) => {
      console.log('===天气信息===' + JSON.stringify(res));
      if(res.SystemCode == 1) { //请求天气成功
        this.setState({weatherContent:JSON.parse(res.data.weatherContent)},() => {

        })
				// if(weatherContent.msg == 'ok') {
				// 	ui.weather.innerHTML = template('weatherTmpl', {
				// 		cityName: cityName,
				// 		district: district,
				// 		weatherContent: weatherContent.result.daily
				// 	})
				// 	document.getElementById("teacher_weather").innerHTML = template('weatherTmpl', {
				// 		cityName: cityName,
				// 		district: district,
				// 		weatherContent: weatherContent.result.daily
				// 	})
				// 	document.getElementById("qrscan_weather").innerHTML = template('weatherTmpl', {
				// 		cityName: cityName,
				// 		district: district,
				// 		weatherContent: weatherContent.result.daily
				// 	})
				// }
			} else {
        Toast.show({
          text: ERROR_CONFIG[res.SystemCode]
        })
			}
    },(err) => {
      console.log("err"+err);
      if(err=="Error: 599"){
        Toast.show({
          text: '身份验证过期，请退出重新登录'
        })
        NavigationUtil.reset(this.props.navigation, 'Login');
      }else{
        Toast.show({
          text: '服务器异常，请稍后重试'
        })
      }
    })
  }

  getWeather(){
    if(!this.state.cityName) {
			this.setState({cityName:'南京市'},() => {
        this.getWeatherData();
      })
    }else{
      this.getWeatherData();
    }
  }

  // 轮播图
  renderBanner() {
    return (
      <View style={styles.wrapper}>
          <Image source={require('../../img/application/app_banner_1.png')} style={styles.bannerImg} resizeMode="cover"/>
      </View>
    );
  }
  
  _onPressDirectBtn=(destination)=>{
    console.log("press direct destination: "+destination);
  }

  render() {

    // let todayWeather=uri(`asset:/${this.state.weatherContent.result.daily[0].day.img}.png`);
    return (
      <SafeAreaView style={styles.container}>
        <Title style={styles.title}>应用</Title>   
        <View style={styles.swiperContainer}>
        {this.renderBanner()}
        </View>
        <View style={styles.directButtonBox}> 
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'annuncement')} style={styles.directButtonShell}>
            <View style={styles.directButton}>
                <Image source={annuncement} resizeMode="contain" style={styles.directButtonImg}></Image>
                <Text style={styles.directButtonZH}>公告</Text>  
                <Text style={styles.directButtonEN}>Announcement</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'signIn')} style={styles.directButtonShell}>
            <View style={styles.directButton}>
                <Image source={signIn} resizeMode="contain" style={styles.directButtonImg}></Image>
                <Text style={styles.directButtonZH}>每日签到</Text>  
                <Text style={styles.directButtonEN}>Sign In</Text>
            </View>
          </TouchableOpacity> 
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'space')} style={styles.directButtonShell}>
            <View style={styles.directButton}>
                <Image source={space} resizeMode="contain" style={styles.directButtonImg}></Image>
                <Text style={styles.directButtonZH}>我的空间</Text>  
                <Text style={styles.directButtonEN}>Space</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'questions')} style={styles.directButtonShell}>
            <View style={styles.directButton}>
                <Image source={questions} resizeMode="contain" style={styles.directButtonImg}></Image>
                <Text style={styles.directButtonZH}>交通答题</Text>  
                <Text style={styles.directButtonEN}>Questions</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'badge')} style={styles.directButtonShell}>
            <View style={styles.directButton}>
                <Image source={badge} resizeMode="contain" style={styles.directButtonImg}></Image>
                <Text style={styles.directButtonZH}>我的徽章</Text>  
                <Text style={styles.directButtonEN}>Badge</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'collection')} style={styles.directButtonShell}>
            <View style={styles.directButton}>
                <Image source={collection} resizeMode="contain" style={styles.directButtonImg}></Image>
                <Text style={styles.directButtonZH}>我的收藏</Text>  
                <Text style={styles.directButtonEN}>Collection</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'more')} style={styles.directButtonShell}>
            <View style={styles.directButton}>
                <Image source={more} resizeMode="contain" style={styles.directButtonImg}></Image>
                <Text style={styles.directButtonZH}>更 多</Text>  
                <Text style={styles.directButtonEN}>More</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.directButtonShellWeather}>
            
              {this.state.weatherContent.msg=='ok'?( 
                <View style={{backgroundColor:"white",borderRadius:3,width:"100%",height:"100%",flexDirection:"row",justifyContent:"space-between",alignItems:'center'}}>
                  <View style={{paddingLeft:20,paddingRight:20,width:"40%"}}>
                    <Text style={styles.tempText}>{this.state.weatherContent.result.daily[0].day.temphigh}°C</Text>
                    <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                      <Image source={{uri:`weather${this.state.weatherContent.result.daily[0].day.img}`}}  style={styles.weatherImg}></Image>
                    </View>
                  </View>
                  <View style={{width:"60%"}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:'center',marginBottom:6}}>
                      <Image source={localIcon}  style={{width:12,height:12,marginRight:2}}></Image>
                      <Text style={{fontSize:12,marginRight:4}}>{this.state.cityName}</Text>
                      <Text style={{fontWeight:'bold'}}>{this.state.district}</Text>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:'center'}}>
                      <View style={styles.weekWeather}>
                        <Text style={styles.week}>明天</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                          <Image source={{uri:`weather${this.state.weatherContent.result.daily[1].day.img}`}}  style={styles.weatherImgL}></Image>
                        </View>
                      </View>
                      <View style={styles.weekWeather}>
                        <Text style={styles.week}>{this.state.weatherContent.result.daily[2].week}</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                          <Image source={{uri:`weather${this.state.weatherContent.result.daily[2].day.img}`}}  style={styles.weatherImgL}></Image>
                        </View>
                      </View>
                      <View style={styles.weekWeather}>
                        <Text style={styles.week}>{this.state.weatherContent.result.daily[3].week}</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                          <Image source={{uri:`weather${this.state.weatherContent.result.daily[3].day.img}`}}  style={styles.weatherImgL}></Image>
                        </View>
                      </View>
                      <View style={styles.weekWeather}>
                        <Text style={styles.week}>{this.state.weatherContent.result.daily[4].week}</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                          <Image source={{uri:`weather${this.state.weatherContent.result.daily[4].day.img}`}}  style={styles.weatherImgL}></Image>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ):(
                <View style={{backgroundColor:"white",borderRadius:3,width:"100%",height:"100%",flexDirection:"row",justifyContent:"center",paddingLeft:6,paddingRight:6,alignItems:'center'}}>
                  <Text style={styles.directButtonNoWeath}>天气正在加载中...</Text> 
                </View>
              )}
            
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title:{
    backgroundColor:"#eb3a3a",
    lineHeight:33,
    fontSize: 16,
    color:'white'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent:"flex-start"
  },
  swiperContainer: {
    height:width * 9 / 20,
  },
  bannerImg:{ 
    width:width,
    height:width * 9 / 20,
  },
  directButtonBox: {
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"space-between",
    alignContent:"flex-start",
    marginTop:8,
    paddingLeft:8,
    paddingRight:8 
  },
  directButtonShell:{
    width:"32%",
    height:112,
    marginBottom:4
    // justifyContent:"center"
  },
  directButtonShellWeather:{
    width:"66%",
    height:112,
    marginBottom:4
  },
  directButton:{
    backgroundColor:"white",borderRadius:3,width:"100%",height:"100%"
  },
  directButtonImg:{
    width:"100%",
    height:43,
    marginTop:16,
    marginBottom:4 
  },
  tempText:{
    fontSize:22,
    marginBottom:2
  },
  weatherImg:{
    width:40,
    height:40,
    marginBottom:8
  },
  weatherImgL:{
    width:15,
    height:15
  },
  week:{
    fontSize:10,
    textAlign:'center',
    marginBottom:2
  },
  weekWeather:{
    marginRight:6,
    flexDirection:'column',
    justifyContent:'center',
    alignContent:'center'
  },
  directButtonZH:{
    textAlign:"center",
    color:"#585858",
    fontSize:13,
    fontWeight:'bold'
  },
  directButtonNoWeath:{
    textAlign:"center",
    color:"#585858",
    fontSize:16,
    fontWeight:'bold'
  },
  directButtonEN:{
    textAlign:"center",
    color:"#585858",
    fontSize:10
  }
});


export default Application;
