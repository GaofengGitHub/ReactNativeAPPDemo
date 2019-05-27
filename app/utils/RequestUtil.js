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

import getUrl from './UrlUtil';

const request = (url, method,contentType, body,token) => {
  let isOk;
  console.log(method+" request："+url)
  switch(contentType){
    case "json" :
    contentType = "application/json;charset=utf-8";
    if(body){
      body=JSON.stringify(body);
    }
    break;
    case "form" :
    contentType = "application/x-www-form-urlencoded;charset=utf-8";
    if (body) {
      body=Object.keys(body).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);
      }).join('&');
    }
    break;
    case "formData":
    contentType = "multipart/form-data";
    let formData = new FormData();
    if (body) { 
      Object.keys(body).forEach(key => formData.append(key, body[key]));
    }
    body=formData; 
    break;
  }
  if(typeof(body)!="string"){
    console.log("body: "+JSON.stringify(body));
  }else{
    console.log("body: "+body);
  }
  
  const headers = token ? Object.assign({},{
    'Content-Type': contentType
  },{'token':encodeURIComponent(token)}) : Object.assign({},{
    'Content-Type': contentType
  })
  console.log("headers: "+JSON.stringify(headers))
  
  return new Promise((resolve, reject) => {
    // console.log("===contenttype==="+contentType)
    fetch(getUrl(url), {
      method,
      headers, 
      body
    })
      .then(response => {
        if (response.status != 200) {
          throw new Error(response.status);
        }
        return response;
      })
      .then((response) => {
        if (response.ok) {
          isOk = true;
        } else {
          isOk = false;
        }
        return response.json();
      })
      .then((responseData) => {
        if (isOk) {
          resolve(responseData);
        } else {
          reject(responseData);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  request
};
