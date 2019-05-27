/**
 *
 * Copyright 2015-present reading
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
import { Platform } from 'react-native';
import { Root } from "native-base"; 
import { StackNavigator, TabNavigator } from 'react-navigation'; 
import Splash from '../pages/Splash';
import Application from '../pages/Application/Application';
import MainContainer from '../containers/MainContainer';
import WebViewPage from '../pages/ItemDetail/WebViewPage';
import Circle from '../pages/Circle/Circle';
import Mine from '../pages/Mine/Mine';
import Serve from '../pages/Serve';
import Login from '../pages/Login/Login';
import Register from '../pages/Login/Register';
import ForgetPsw from '../pages/Login/ForgetPsw';
 
const TabContainer = TabNavigator(
  {
    Main: { screen: MainContainer },
    Application: { screen: Application },
    Circle: { screen: Circle },
    Mine: { screen: Mine }
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#eb3a3a',
      inactiveTintColor: '#8a8a8a',
      showIcon: true,
      style: {
        backgroundColor: '#fff',
        height:50 
      },
      labelStyle: {   //标签文字的样式
        fontSize: 12,
        top:Platform.OS === "ios" ? -2 : -8, 
      },
      indicatorStyle: {
        opacity: 0
      },
      tabStyle: {
        padding: 0 
      }
    }
  }
);
console.log('原首页进来。。。')
const AppNavigator = StackNavigator(
  {
    Splash: { screen: Splash },
    Serve: { screen: Serve },
    Login:{screen:Login},
    Register:{screen:Register},
    ForgetPsw:{screen:ForgetPsw},
    Application: {
      screen: Application, 
      navigationOptions: {
        // headerLeft: null,
        // headerTitleStyle:{
        //   flex:1, 
        //   alignSelf:'center',
        //   textAlign: 'center'
        // },
        // headerTitleContainerStyle:{
        //   left: TITLE_OFFSET,
        //   right: TITLE_OFFSET,
        // }
      }
    },
    Home: {
      screen: TabContainer,
      navigationOptions: {
        headerLeft: null
      }
    },
    Web: { screen: WebViewPage }
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#eb3a3a',
        height:40
      },
      headerTitleStyle: {
        color: '#fff',
        fontSize: 15 
      },
      headerTintColor: '#fff'
    }
  }
);

export default () =>
<Root>
  <AppNavigator />
</Root>;