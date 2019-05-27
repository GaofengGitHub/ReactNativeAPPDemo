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
import {Image,StyleSheet} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import Icon from 'react-native-vector-icons/Ionicons';
import Main from '../pages/MainPage/Main';
import * as mainCreators from '../actions/main';

let home;

class MainContainer extends React.Component {
  static navigationOptions = {
    title: '首页',
    header:null,
    tabBarIcon: ({ focused, tintColor }) => {
      if(focused){
        home=require(`../img/main/nav-index-active.png`)
      }else{ 
        home=require(`../img/main/nav-index.png`)
      } 
      return <Image source={home} style={{"width":20}} resizeMode="contain"></Image>
    }
  };

  componentWillMount(){
    const { mainActions } = this.props;
    mainActions.startTokenThread();
  }

  static componentDidMount() {
  }

  render() {
    return <Main {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  const mainActions = bindActionCreators(mainCreators, dispatch);
  return {
    mainActions
  };
};

const styles = StyleSheet.create({
  tabIcon:{
    width:25
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
