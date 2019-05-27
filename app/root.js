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
import {StatusBar} from 'react-native';
import { Provider } from 'react-redux'; 
import configureStore from './store/configure-store';
import rootSaga from './sagas/index';
import App from './containers/app';
// import TestProjec from './root-demo'; 

const store = configureStore();  

// run root saga
store.runSaga(rootSaga);

const Root = () => (
    <Provider store={store}>
        {/* <StatusBar  
         animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden  
         hidden={false}  //是否隐藏状态栏。  
         backgroundColor={'#eb3a3a'} //状态栏的背景色  
         translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。  
         barStyle={'light-content'} // enum('default', 'light-content', 'dark-content') 
         networkActivityIndicatorVisible ={true}//仅作用于ios。是否显示正在使用网络。 
         showHideTransition={'fade'}//仅作用于ios。显示或隐藏状态栏时所使用的动画效果（’fade’, ‘slide’）。 
        >   
        </StatusBar> */}
        <App />
    </Provider>
);

export  {Root,store}; 
