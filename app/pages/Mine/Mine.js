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
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import Geolocation from 'Geolocation';

import * as Data from "../../utils/Data";
import NavigationUtil from '../../utils/NavigationUtil';
import ERROR_CONFIG from '../../constants/Error'; 
import { Toast,Text,Title,Thumbnail,ListItem,Left,Icon,Button,Right,Body,Card } from 'native-base';
import storeSimple from 'react-native-simple-store';


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
        title: '我的', 
        header:null,
        tabBarIcon: ({ focused, tintColor }) => {
            if(focused){
            home=require(`../../img/main/nav-my-active.png`)
            }else{ 
            home=require(`../../img/main/nav-my.png`) 
            } 
            return <Image source={home} style={{"width":20}} resizeMode="contain"></Image>
        }
    };
  constructor(props) {
    super(props);
    this.state = {
      nickname:'',
      headImg:'icon_user_portrait'
    };
  }

  componentDidMount() {
    
    InteractionManager.runAfterInteractions(() => {
    });
  }

  componentWillMount() {
    this.initPage()
  }

  initPage(nickname,headImg){
    storeSimple.get('userInfo').then((userInfo) => {
      console.log('userinfo=='+JSON.stringify(userInfo));
      this.setState({
        nickname:userInfo.nickName || userInfo.realName,
        headImg:userInfo.photo!='0'? (userInfo.photo || userInfo.portrait) : 'icon_user_portrait'
      })
      // const userId=userInfo.userId;
      // Data.getUserInfo(userId,( res ) => {
      //   console.log('===用户信息 我的===' + JSON.stringify(res))
      //   userInfo.nickName = res.data.name;
      //   storeSimple.update("userInfo",userInfo).then(() => {
          
      //   })
      //   if(res.SystemCode == 1) {
			// 		var userData = JSON.parse(plus.storage.getItem('userInfo'));
			// 		userData.nickName = res.data.name ||userInfo.nickName;
			// 		plus.storage.setItem('userInfo', JSON.stringify(userData));
			// 		ui.name.innerText = userData.nickName ;
			// 	} 
      // },(err) => {
      //   console.log(err+'');
      //   if(err=="Error: 599"){
      //     Toast.show({
      //       text: '身份验证过期，请重新登录'
      //     })
      //     NavigationUtil.reset(this.props.navigation, 'Login');
      //   }else{
      //     NavigationUtil.reset(this.props.navigation, 'Login');
      //   }
      // })
    })
  }

  // 轮播图
  renderBanner() {
    return (
      <ImageBackground source={require('../../img/user/bg.png')} style={styles.bannerImg} resizeMode="stretch">
        <View style={styles.headBanner}>
          <TouchableOpacity onPress={this._onPressHeadToggle.bind(this)}>
            <Thumbnail source={{uri: this.state.headImg}}  style={styles.headIcon} />
          </TouchableOpacity> 
          <Text>{this.state.nickname}</Text>
        </View>
      </ImageBackground>
    );
  }
  
  _onPressHeadToggle= () =>{
    console.log('toggle headImg')
  }
  
  onPressMineList=(go) => {
    switch (go) {
      case 'info' : console.log("press go info page"); break;
      case 'exchange' : console.log("press go exchange page"); break;
      case 'identy' : console.log("press go identy page"); break;
      case 'feedback' : console.log("press go feedback page"); break;
      case 'manule' : console.log("press go manule page"); break;
      case 'setting' : console.log("press go setting page"); break;
    }
  }

  render() {

    // let todayWeather=uri(`asset:/${this.state.weatherContent.result.daily[0].day.img}.png`);
    return (
      <SafeAreaView style={styles.container}>
        <Title style={styles.title}>我的</Title>   
        <View style={styles.swiperContainer}>
        {this.renderBanner()}
        </View>
        <View style={styles.directButtonBox}> 
            <ListItem icon  style={styles.itemHeight}>
                <Left>
                  <Thumbnail source={{uri: `icon_info`}} small />
                </Left>
                <Body style={styles.itemHeight}>
                  <TouchableOpacity onPress={this.onPressMineList.bind(this,'info')}>
                    <Text style={styles.listText}>我的资料</Text>
                  </TouchableOpacity>
                </Body>
                <Right style={styles.itemHeight}>
                  <TouchableOpacity onPress={this.onPressMineList.bind(this,'info')}>
                    <Icon active name="arrow-forward" />
                  </TouchableOpacity>
                </Right>
            </ListItem>
            <ListItem icon style={styles.itemHeight}>
              <Left style={styles.itemHeight}>
                <Thumbnail source={{uri: `icon_exchange`}} small />
              </Left>
              <Body style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'exchange')}>
                  <Text style={styles.listText}>我的兑换</Text>
                </TouchableOpacity>
              </Body>
              <Right style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'exchange')}>
                  <Icon active name="arrow-forward" />
                </TouchableOpacity>
              </Right>
            </ListItem>
            <ListItem icon style={styles.itemHeight}>
              <Left style={styles.itemHeight}>
                <Thumbnail source={{uri: `icon_collect`}} small />
              </Left>
              <Body style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'identy')}>
                  <Text style={styles.listText}>身份管理</Text>
                </TouchableOpacity>
              </Body>
              <Right style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'identy')}>
                  <Icon active name="arrow-forward" />
                </TouchableOpacity>
              </Right>
            </ListItem>
            <ListItem icon style={styles.itemHeight}>
              <Left style={styles.itemHeight}>
                <Thumbnail source={{uri: `icon_advice`}} small />
              </Left>
              <Body style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'feedback')}>
                  <Text style={styles.listText}>我的反馈</Text>
                </TouchableOpacity>
              </Body>
              <Right style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'feedback')}>
                  <Icon active name="arrow-forward" />
                </TouchableOpacity>
              </Right>
            </ListItem>
            <ListItem icon style={styles.itemHeight}>
              <Left style={styles.itemHeight}>
                <Thumbnail source={{uri: `icon_exchange`}} small />
              </Left>
              <Body style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'manule')}>
                  <Text style={styles.listText}>操作手册</Text>
                </TouchableOpacity>
              </Body>
              <Right style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'manule')}>
                  <Icon active name="arrow-forward" />
                </TouchableOpacity>
              </Right>
            </ListItem>
            <ListItem icon style={styles.itemHeight}>
              <Left style={styles.itemHeight}>
                <Thumbnail source={{uri: `icon_setting`}} small />
              </Left>
              <Body style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'setting')}>
                  <Text style={styles.listText}>我的设置</Text>
                </TouchableOpacity>
              </Body>
              <Right style={styles.itemHeight}>
                <TouchableOpacity onPress={this.onPressMineList.bind(this,'setting')}>
                  <Icon active name="arrow-forward" />
                </TouchableOpacity>
              </Right>
            </ListItem>
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
    height:125,
  },
  headBanner:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  bannerImg:{ 
    width:width,
    height:125,
    justifyContent:'center',
  },
  headIcon:{
    marginLeft:20,
    marginRight:20
  },
  listText:{
    color:'#5d5d5d' ,
    fontSize:14
  },
  itemHeight:{
    height:60
  },
  directButtonBox: {
    marginTop:8,
    paddingLeft:8,
    paddingRight:8 ,
    backgroundColor:'white'
  },
});


export default Application;
