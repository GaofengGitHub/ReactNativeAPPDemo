/* eslint no-constant-condition: ["error", { "checkLoops": false }] */
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
import { cancel, take, call, fork,takeLatest,actionChannel } from 'redux-saga/effects';

import * as types from '../constants/ActionTypes';
import storeSimple from 'react-native-simple-store';
import * as Data from '../utils/Data';
import {  Toast } from 'native-base';

// function putTokenExchange(){
  
// }
let TokenExchangetimer;
function setTokenExchangeTimer(){
  TokenExchangetimer=setInterval(() => {
    Data.tokenExchange((data) => {
      console.log('===以旧换新token===' + JSON.stringify(data))
      if(data.SystemCode == 1) { // token没过期
        storeSimple.get('userInfo').then((userInfo) => {
          userInfo.token = data.token;
          storeSimple.update("userInfo",userInfo)
        })
      } else {
        
      }
    },(err) => {
      console.log("定时器err"+err);
      if(err=="Error: 599"){
        Toast.show({
          text: '身份验证过期，请退出重新登录'
        })
      }
    })
  },10000)
  // 82800000
}

function * setTokenExchangeTimerAndWatch(){
  clearInterval(TokenExchangetimer);
  let tokenExchangeThread=yield fork(setTokenExchangeTimer);
  const refreshChan= yield actionChannel(types.REFRESH_TOKEN_TIMER);
  while(true){
    const action=yield take(refreshChan);
    if(action.type=='REFRESH_TOKEN_TIMER'){
      clearInterval(TokenExchangetimer);
      yield cancel(tokenExchangeThread);
      tokenExchangeThread=yield fork(setTokenExchangeTimer);
    }
  }
  
}

export function* wathStartToken() {
  yield takeLatest(types.START_TOKEN_THREAD,setTokenExchangeTimerAndWatch);
}


