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
  TouchableOpacity,
  Modal
} from 'react-native';

import * as Data from "../../utils/Data";
import NavigationUtil from '../../utils/NavigationUtil';
import ListUpAndDown,{RefreshState} from '../../components/ListUpAndDown';
import ERROR_CONFIG from '../../constants/Error'; 
import {  Card, CardItem, Text,  Left, Body, Right,Toast,Title,Thumbnail } from 'native-base';
import * as urls from '../../constants/Urls';
import NoData from '../../components/NoData';
import {timeFromnow} from '../../utils/FormatUtil';

import ImageViewer from 'react-native-image-zoom-viewer';
import Video from 'react-native-video';
 
//引用插件
import Swiper from 'react-native-swiper';
// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');
const playImg = require('../../img/space/play.png');

class Circle extends React.Component {
    static navigationOptions = {
        title: '活动圈', 
        header:null,
        tabBarIcon: ({ focused, tintColor }) => {
            if(focused){
            home=require(`../../img/main/nav-class-active.png`)
            }else{ 
            home=require(`../../img/main/nav-class.png`) 
            } 
            return <Image source={home} style={{"width":20}} resizeMode="contain"></Image>
        }
    };
  constructor(props) {
    super(props);
    this.state = {
      dataList:[],
      refreshState: RefreshState.Idle,
      newsNextUrl:'',
      classId:'',
      modalVisible:false,
      modalVisibleVideo:false,
      index:0,
      images:[],
      videoUrl:''
    };
  }

  componentDidMount() {
    
    InteractionManager.runAfterInteractions(() => {
    });
  }

  componentWillMount() {
    this.onHeaderRefresh(); 
  }

  keyExtractor = (item, index) => {
    return index.toString()
  }

  renderCell = ({item}) => {
    let imageList = item.attachmentList.map((imgItem,index)=>{
      if(imgItem.type=='image'){
        return (
          <TouchableOpacity onPress={this._onPressImg.bind(this,item.attachmentList,index)} key={index}  style={{width:'32%',height:100,marginRight:'1%',marginBottom:5}}>
            <Image source={{uri:imgItem.attachment}} style={{width:'100%',height:100}}></Image>
          </TouchableOpacity>
        )
      }else{
        return (
          <TouchableOpacity onPress={this._onPressVideo.bind(this,imgItem.attachment)} key={index}  style={{width:'32%',height:100,marginRight:'1%',marginBottom:5}}>
            <ImageBackground source={{uri:imgItem.poster}} style={{width:'100%' , height:'100%',alignContent:'center',justifyContent:'center'}}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <Image source={playImg} style={{width:30,height:30}}></Image>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )
      }
    })
    return (
      <TouchableOpacity onPress={this._onPressCardItem.bind(this,item.id)} key={item.id}>
        <Card style={{flex: 0,marginLeft:8}}>
          <CardItem style={{paddingBottom:6,paddingLeft:8,paddingRight:8}}>
            <Left>
              {item.userPhoto =='0' ? (<Thumbnail source={{uri: 'icon_user_portrait'}}/>):(<Thumbnail source={{uri: `${urls.IMAGE_GET_CONFIG}${item.userPhote}`}} />)}
              <Body>
                <Text>{item.userName}</Text>
                <Text note>{timeFromnow(item.createDate)}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem style={{paddingTop:0,paddingBottom:4}}>
            <Body>
              <Text style={{marginBottom:2}}>
                {item.title}
              </Text>
              
                {item.tooLong ? (item.fold?(
                  <View>
                    <Text style={{color:'#666',fontSize:12}}>{item.content.slice(0,70)}...</Text>
                    <TouchableOpacity onPress={this._onPressFoldOrNot.bind(this,item.id)}>
                      <Text style={{color:'blue',fontSize:12,marginBottom:5}}>展开</Text>
                    </TouchableOpacity>
                  </View>
                ):(
                  <View>
                    <Text style={{color:'#666',fontSize:12}}>{item.content}</Text>
                    <TouchableOpacity onPress={this._onPressFoldOrNot.bind(this,item.id)}>
                      <Text style={{color:'blue',fontSize:12,marginBottom:5}}>缩回</Text>
                    </TouchableOpacity>
                  </View>
                )):(
                  <Text style={{marginBottom:5,color:'#666',fontSize:12}}>{item.content}</Text>
                  )}
              <View style={{flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap',alignContent:'flex-start',width:'100%'}}>
              {item.attachmentList?(imageList):(<React.Fragment></React.Fragment>)}
              </View>
            </Body>
          </CardItem>
        </Card>
      </TouchableOpacity>
    )
  }
  _onPressCardItem = (id) =>{
    console.log("press card id: "+id);
  }
  _onPressImg = (imgList,index) => {
    // console.log("press img imgList: "+JSON.stringify(imgList)+" index=="+index);
    this.setState({images:imgList.filter(item =>{
      if(item.type=='image'){
        return item;
      }
    }).map(item =>{
      let obj={};
      obj.url=item.attachment;
      return obj;
    }),index:index},()=>{
      // console.log("press img imgList: "+JSON.stringify(this.state.images)+" index=="+index);
      this.setState({modalVisible: true});
    })
  }
  _onPressVideo = (link) => {
    console.log("press video link: "+link);
    this.setState({videoUrl:link},()=>{
      this.setState({modalVisibleVideo:true})
    })
  }
  _onPressFoldOrNot = (id) => {
    console.log("press fold or not id: "+id);
    this.setState((prevState)=>({
      dataList: prevState.dataList.map(item =>{
        if(item.id==id){
          item.fold=!item.fold
        }
        return item;
      })
    }))
  }

  onHeaderRefresh = () => {
    this.setState({ refreshState: RefreshState.HeaderRefreshing })

    Data.getByClass('',this.state.classId,(res) => {
      console.log('===我的中队下拉111===' + JSON.stringify(res));
      if(res.SystemCode == 1) {
        this.setState({ newsNextUrl: res.data.nextUrl })//下一页
        if(res.data.varList && res.data.varList.length) {
          //有附件
          for(var i = 0; i < res.data.varList.length; i++) {
            if(res.data.varList[i].attachmentList && res.data.varList[i].attachmentList.length) {
              for(var j = 0; j < res.data.varList[i].attachmentList.length; j++) {
                if(/\w+(.flv|.mpeg|.mp4|.avi|.wmv|.mpg|.movie|.mov)$/gi.test(res.data.varList[i].attachmentList[j].attachment)) {
                  res.data.varList[i].attachmentList[j].poster = res.data.varList[i].attachmentList[j].attachment + '?x-oss-process=video/snapshot,t_0,f_png,w_200,h_150'; //视频截帧作为视频封面
                  res.data.varList[i].attachmentList[j].type = 'video';
                } else {
                  res.data.varList[i].attachmentList[j].type = 'image';
                }
              }
            }
            if(res.data.varList[i].content > 70){
              res.data.varList[i].fold=true;
              res.data.varList[i].tooLong=true;
            }else{
              res.data.varList[i].tooLong=false;
              res.data.varList[i].fold=false;
            }
          }
          console.log('处理后的数据==='+JSON.stringify(res.data.varList))

          //获取测试数据
          let dataList = res.data.varList;
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
      Data.getByClass(urls.HOST_CONFIG+this.state.newsNextUrl,this.state.classId,(res) => {
        console.log('===我的中队加载111===' + JSON.stringify(res));
        if(res.SystemCode == 1) {
          this.setState({ newsNextUrl: res.data.nextUrl })//下一页
          //获取测试数据
          //有附件
          for(var i = 0; i < res.data.varList.length; i++) {
            if(res.data.varList[i].attachmentList && res.data.varList[i].attachmentList.length) {
              for(var j = 0; j < res.data.varList[i].attachmentList.length; j++) {
                if(/\w+(.flv|.mpeg|.mp4|.avi|.wmv|.mpg|.movie|.mov)$/gi.test(res.data.varList[i].attachmentList[j].attachment)) {
                  res.data.varList[i].attachmentList[j].poster = res.data.varList[i].attachmentList[j].attachment + '?x-oss-process=video/snapshot,t_0,f_png,w_200,h_150'; //视频截帧作为视频封面
                  res.data.varList[i].attachmentList[j].type = 'video';
                } else {
                  res.data.varList[i].attachmentList[j].type = 'image';
                }
              }
            }
            if(res.data.varList[i].content > 70){
              res.data.varList[i].fold=true;
              res.data.varList[i].tooLong=true;
            }else{
              res.data.varList[i].tooLong=false;
              res.data.varList[i].fold=false;
            }
          }

          let dataList = res.data.varList;
          this.setState((prevState)=>({
            dataList: prevState.dataList.concat(dataList), 
            refreshState: RefreshState.Idle
          }))
  
        } else {
          this.setState({
            refreshState: RefreshState.Idle
          })
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
          this.setState({ refreshState: RefreshState.Failure })
        }
      })
    }
  }

  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Title style={styles.title}>我的中队</Title>
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
        <Modal
            visible={this.state.modalVisible}
            transparent={true}
            onRequestClose={() => this.setState({modalVisible: false})}>
            <ImageViewer imageUrls={this.state.images} index={this.state.index}/>
        </Modal>
        <Modal
            visible={this.state.modalVisibleVideo}
            transparent={true}
            onRequestClose={() => this.setState({modalVisibleVideo: false})}>
            <Video source={{uri: this.state.videoUrl}}   // Can be a URL or a local file.
              ref={(ref) => {
                this.player = ref
              }}                                      // Store reference
              // onBuffer={this.onBuffer}                // Callback when remote video is buffering
              // onError={this.videoError}               // Callback when video cannot be loaded
              style={styles.backgroundVideo} />
        </Modal>
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
  },
  backgroundVideo:{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});


export default Circle;
