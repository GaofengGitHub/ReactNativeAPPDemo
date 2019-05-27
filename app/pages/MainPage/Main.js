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
  ImageBackground,
  TouchableOpacity
} from 'react-native';

import * as Data from "../../utils/Data";
import NavigationUtil from '../../utils/NavigationUtil';
import ListUpAndDown,{RefreshState} from '../../components/ListUpAndDown';
import ERROR_CONFIG from '../../constants/Error'; 
import {  Toast,Card, CardItem, Text,  Left, Body, Right } from 'native-base';
import * as urls from '../../constants/Urls';
import NoData from '../../components/NoData'; 

//引用插件
import Swiper from 'react-native-swiper';
// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');
const AnnouncementBtnBg = require('../../img/main/index_btn_1.png');
const AcitivityBtnBg = require('../../img/main/index_btn_2.png');
const SignBtnBg = require('../../img/main/index_btn_san.png');
const HomeworkBtnBg = require('../../img/main/index_btn_si.png');
let bannerArr;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList:[],
      refreshState: RefreshState.Idle,
      swiperShow: false,
      newsNextUrl:''
    };
  }

  componentDidMount() {
    
    InteractionManager.runAfterInteractions(() => {
    });
  }

  componentWillMount() {
    this.onHeaderRefresh();
  }

  // 轮播图
  renderBanner() {
    if (this.state.swiperShow) {
      let bannerList=bannerArr.map((bannerItem) =>(
        <TouchableOpacity onPress={this._onPressBanner.bind(this,bannerItem.id)} key={bannerItem.id}>
          <Image source={{uri:bannerItem.poster}} style={styles.bannerImg} resizeMode="cover" />
        </TouchableOpacity>
      )
      )
      return (
      <Swiper
        style={styles.wrapper}
        height={width * 9 / 20}
        showsButtons={false}
        showsPagination={true}
        removeClippedSubviews={false} //这个很主要啊，解决白屏问题
        autoplay={true}
        horizontal ={true}
        paginationStyle={styles.paginationStyle}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
      >
        {bannerList}

      </Swiper>

    );

    } else {
      return (
        <View style={styles.wrapper}>
            <Image source={require('../../img/application/app_banner_1.png')} style={styles.bannerImg} resizeMode="cover"/>
        </View>
      );
    }
  }
  _onPressBanner = (id) => {
    console.log("press banner id: "+id);
  }

  keyExtractor = (item, index) => {
    return index.toString()
  }

  renderCell = ({item}) => { 
    return (
      <TouchableOpacity onPress={this._onPressCardItem.bind(this,item.id)} key={item.id}>
        <Card style={{flex: 0,marginLeft:8}}>
          <CardItem style={{paddingBottom:6,paddingLeft:8,paddingRight:8}}>
            <Body>
              <Text style={{lineHeight:18,marginBottom:4}}>{item.title}</Text>
              <Text note>{item.summary}</Text>
            </Body>
          </CardItem>
          <CardItem style={{paddingTop:0,paddingBottom:4}}>
            <Left>
                <Text note style={{fontSize:10}}>{item.authorId}</Text>
            </Left>
            <Right>
              <Text note style={{fontSize:10}}>
                {item.updateDate}
              </Text>
            </Right>
          </CardItem>
          {item.poster ? (<CardItem cardBody style={{paddingBottom:6,paddingLeft:8,paddingRight:8}}>
                <Image source={{uri: item.poster}} style={{height: 200, width: null, flex: 1}}/>
          </CardItem>):(<React.Fragment></React.Fragment>)}
        </Card>
      </TouchableOpacity>
    )
  }
  _onPressCardItem = (id) =>{
    console.log("press card id: "+id);
  }

  onHeaderRefresh = () => {
    this.setState({ refreshState: RefreshState.HeaderRefreshing })

    Data.getNewsList('',(data) => {
      console.log('===新闻下拉111===' + JSON.stringify(data));
      if(data.SystemCode == 1) {
        this.setState({ newsNextUrl: data.nextUrl })//下一页
        if(data.varList) {
          bannerArr = [];
          for(var i = 0; i < data.varList.length; i++) {
            if(data.varList[i].poster && bannerArr.length < 4) {
              bannerArr.push(data.varList[i]);
            }
          }
          if(bannerArr.length>0){
            this.setState({ swiperShow: true });
          }

          //获取测试数据
          let dataList = data.varList;
          this.setState({
            dataList: dataList,
            refreshState: RefreshState.Idle
          })
        } else {
          this.setState({
            refreshState: RefreshState.EmptyData
          })
        }

      } else {
        this.setState({
          refreshState: RefreshState.Idle
        })
        Toast.show({
          text: ERROR_CONFIG[data.SystemCode]
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
        this.setState({
          refreshState: RefreshState.Failure
        })
      }
    })
  }

  onFooterRefresh = () => {
    this.setState({ refreshState: RefreshState.FooterRefreshing })
    if(this.state.newsNextUrl==''){
      this.setState({
        refreshState: RefreshState.NoMoreData
      })
    }else{
      Data.getNewsList(urls.HOST_CONFIG+this.state.newsNextUrl,(data) => {
        console.log('===新闻加载111===' + JSON.stringify(data));
        if(data.SystemCode == 1) {
          this.setState({ newsNextUrl: data.nextUrl })//下一页
          //获取测试数据
          let dataList = data.varList;
          this.setState((prevState)=>({
            dataList: prevState.dataList.concat(dataList), 
            refreshState: RefreshState.Idle
          }))
  
        } else {
          this.setState({
            refreshState: RefreshState.Idle
          })
          Toast.show({
            text: ERROR_CONFIG[data.SystemCode]
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
          this.setState({ refreshState: RefreshState.Failure })
        }
      })
    }
  }

  _onPressDirectBtn=(destination)=>{
    console.log("press direct destination: "+destination);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.swiperContainer}>
        {this.renderBanner()}
        </View>
        <View style={styles.directButtonBox}>
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'annuncement')} style={{width:"23.5%"}}>
            <ImageBackground source={AnnouncementBtnBg} style={styles.directButton} imageStyle={{borderRadius:5}} resizeMode="cover">
                <Text style={styles.directButtonZH}>公告</Text> 
                <Text style={styles.directButtonEN}>Announcement</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'activity')} style={{width:"23.5%"}}>
            <ImageBackground source={AcitivityBtnBg} style={styles.directButton} imageStyle={{borderRadius:5}} resizeMode="cover">
              <Text style={styles.directButtonZH}>活动报名</Text>
              <Text style={styles.directButtonEN}>Acitivity</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'sign')} style={{width:"23.5%"}}>
            <ImageBackground source={SignBtnBg} style={styles.directButton} imageStyle={{borderRadius:5}} resizeMode="cover">
              <Text style={styles.directButtonZH}>签到</Text>
              <Text style={styles.directButtonEN}>Sign</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDirectBtn.bind(this,'homework')} style={{width:"23.5%"}}>
            <ImageBackground source={HomeworkBtnBg} style={styles.directButton} imageStyle={{borderRadius:5}} resizeMode="cover">
              <Text style={styles.directButtonZH}>提交作业</Text>
              <Text style={styles.directButtonEN}>Homework</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <ListUpAndDown
            data={this.state.dataList}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderCell}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            onFooterRefresh={this.onFooterRefresh}
            footerEmptyDataComponent={<NoData></NoData>}
            style={styles.cardList}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent:"flex-start"
  },
  swiperContainer: {
    height:width * 9 / 20,
  },
  wrpaper: {
    width: width,
    height:width * 9 / 20,
  },
  bannerImg:{ 
    width:width,
    height:width * 9 / 20,
  },
  paginationStyle: {
    bottom: 6,
  },
  dotStyle: {
    width: 5,
    height: 5,
    backgroundColor: '#fff',
    opacity: 0.4,
    borderRadius: 50,
  },
  activeDotStyle: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 50,
  },

  directButton:{
    // width:"23.5%",
    paddingTop:4,
    paddingBottom:4
  },
  directButtonBox: {
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:8,
    paddingLeft:8,
    paddingRight:8
  },
  directButtonZH:{
    textAlign:"center",
    color:"white"
  },
  directButtonEN:{
    textAlign:"center",
    color:"white",
    fontSize:10
  },

  cardList:{
    paddingTop:8,
    paddingLeft:8
  }
});


export default Main;
