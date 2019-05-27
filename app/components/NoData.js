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
  StyleSheet,
  Dimensions,
  View,
  Image,
  Text,
  Modal,
  ActivityIndicator
} from 'react-native';

const NoDataImg = require('../img/404/no-data.png');

const NoData = () => (
    <View style={styles.container}>
        <View style={{ alignItems: 'center', justifyContent: 'center'}}>
          <Image source={NoDataImg}  style={styles.noDataImage}/>
        </View>
        <Text style={styles.noDataText}>暂时没有数据</Text>
    </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop:120, 
    justifyContent:'center',
    alignContent:'center'
  },
  noDataImage:{
    width:160,
    height:120
  },
  noDataText:{
    textAlign:'center',
    marginTop:6
  }
});

export default NoData;
