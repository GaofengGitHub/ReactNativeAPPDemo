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
import { Dimensions, Image ,View} from 'react-native';
import storeSimple from 'react-native-simple-store'; 
import { registerApp } from 'react-native-wechat'; 
import AV from 'leancloud-storage';
import SplashScreen from 'react-native-splash-screen';
import NavigationUtil from '../utils/NavigationUtil';
import * as Data from "../utils/Data"
import {store} from "../root"
import * as loginCreators from '../actions/login';
import {  Toast } from 'native-base';
 
console.log("引导页进来。。。")
 
// const maxHeight = Dimensions.get('window').height;
// const maxWidth = Dimensions.get('window').width;
const splashImg = require('../img/splash.png');

class Splash extends React.Component { 
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    // this.state = {
    //   bounceValue: new Animated.Value(1)
    // };
    registerApp('wxb24c445773822c79');
    if (!AV.applicationId) {
      AV.init({
        appId: 'Tfi1z7dN9sjMwSul8sYaTEvg-gzGzoHsz',
        appKey: '57qmeEJonefntNqRe17dAgi4'
      });
    }
  }

  componentDidMount() {
    const { navigate } = this.props.navigation;
    // Animated.timing(this.state.bounceValue, {
    //   toValue: 1.2,
    //   duration: 1000
    // }).start();
    SplashScreen.hide();  
    this.timer = setTimeout(() => {
      storeSimple.get('isInit').then((isInit) => { 
        // console.log(isInit+"是否初次进入")
        if (!isInit) { 
          // navigate('Serve'); 
          NavigationUtil.reset(this.props.navigation,'Serve')
        } else {
          storeSimple.get('userInfo').then((userInfo) => { 
            if(!userInfo){
              console.log("没有用户信息");
              NavigationUtil.reset(this.props.navigation, 'Login');
            }else{
              console.log("有用户信息")
              Data.tokenExchange((data) => {
                console.log('===以旧换新token===' + JSON.stringify(data))
                if(data.SystemCode == 1) { // token没过期
                  userInfo.token = data.token;
                  storeSimple.update("userInfo",userInfo).then(() => {
                    Data.validateHaveChildren((res) => {
                      console.log('===是否存在孩子entry===' + JSON.stringify(res)); //0不存在 大于0存在
                      if(res.SystemCode == 1) {
                        // plus.storage.setItem('isHaveChild', res.childrenNumbers + '');
                        store.dispatch(loginCreators.setIsHaveChild(res.childrenNumbers + '')) 
                      } else {
                        // plus.storage.setItem('isHaveChild', '0');
                        store.dispatch(loginCreators.setIsHaveChild('0'));
                      }
                    }, ( error) => {
                      console.log('===查询孩子信息失败===' + JSON.stringify(error));
                      store.dispatch(loginCreators.setIsHaveChild('0'));
                    })
                    // NavigationUtil.reset(this.props.navigation,'Login')
                    NavigationUtil.reset(this.props.navigation,'Home')
                  }); 

                } else {
                  NavigationUtil.reset(this.props.navigation, 'Login');
                }
              },(err) => {
                console.log(err+'');
                if(err=="Error: 599"){
                  Toast.show({
                    text: '身份验证过期，请重新登录'
                  })
                  NavigationUtil.reset(this.props.navigation, 'Login');
                }else{
                  NavigationUtil.reset(this.props.navigation, 'Login');
                }
              })
              
            }
          })
          
        }
      });
    }, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={{width:"100%",height:"100%"}}>
      
        <Image
          style={{ 
            width: null,
            height: null,
            // transform: [{ scale: this.state.bounceValue }]
          }}
          source={splashImg}
        />
      </View>
      
    );
  }
}

export default Splash;
