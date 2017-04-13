import React, { PropTypes } from 'react';
import {
  TextInput,
  StyleSheet,
  Platform,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Styles, Fonts, Colors, Metrics, Images } from '@theme/';
import {priceShort, timeAgo} from '@api/algoliaAPI';

import Swiper from '@components/Swiper';

const CachedImage = require('react-native-cached-image');
const {
    ImageCacheProvider
} = CachedImage;


const styles = StyleSheet.create({
    listItemContainer: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight / 3,
    },

    wrapper: {
    },
    slide: {
      width: Metrics.screenWidth,
      height: Metrics.screenHeight / 3 - 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB',
    },

    cachedImage: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight / 3 - 40,
    },
    
    controlContainer: {
        width: Metrics.screenWidth,
        position: 'absolute',
        height: 40,
        left: 0,
        bottom: 0, 
        backgroundColor: '#000B',
    },
    
    pageMark: {
        ...Styles.center, 
        width: 70,
        height: 20,
        backgroundColor: '#0009',
        position: 'absolute',
        right: 20,
        bottom: 10, 
    },

    pageLeftMark: {
        ...Styles.center, 
        width: 30,
        height: 30,
        backgroundColor: '#0009',
        position: 'absolute',
        left: 20,
        top: (Metrics.screenHeight / 3 - 70) /2
    },

    pageRightMark: {
        ...Styles.center, 
        width: 30,
        height: 30,
        backgroundColor: '#0009',
        position: 'absolute',
        right: 20,
        top: (Metrics.screenHeight / 3 - 70) /2
    },
    
});

export default class PropertyViewItem extends React.Component {
  static propTypes = {
    onClickProperty: PropTypes.func,
    propertyItem: PropTypes.object,
    propertyIndex: PropTypes.number,   
  }

  static defaultProps = {
    onClickProperty: () => {},    
    propertyItem: null,
    propertyIndex: 0,   
  }

  constructor(props) {
    super(props);

    this.state={
      imageIndex : 0,
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.setImageLoadingByCache();
    this.setState({
      imageIndex : 2,
    })
  }

  componentWillUnmount() {
    this.removeImageLoadedByCache();
  }

  componentWillReceiveProps(nextProps){
    if( JSON.stringify(nextProps.propertyItem) != JSON.stringify(this.props.propertyItem) ){
      this.setImageLoadingByCache();
      this.setState({
        imageIndex : 0});
    }
  }

  setImageLoadingByCache()
  {
      let item = this.props.propertyItem;
      let mlsid = item.mlsid;
      let resolution = "420x210";

      if( item.piccount < 1 ) {
        return null;
      }

      let imgURLs = [];
      for( let i = 0 ; i < item.piccount ; i ++ ){
          let iterator = i + 1;
          let imgURL="https://i.palmettopark.net/" + mlsid + "-" + iterator + "-" + resolution + ".jpg";
          imgURLs.push(imgURL);
      }
      ImageCacheProvider.cacheMultipleImages(imgURLs);
  }

  removeImageLoadedByCache(){
      let item = this.props.propertyItem;
      let mlsid = item.mlsid;
      let resolution = "420x210";

      if( item.piccount < 1 ) {
        return null;
      }

      let imgURLs = [];
      for( let i = 0 ; i < item.piccount ; i ++ ){
          let iterator = i + 1;
          let imgURL="https://i.palmettopark.net/" + mlsid + "-" + iterator + "-" + resolution + ".jpg";
          imgURLs.push(imgURL);
      }
      ImageCacheProvider.deleteMultipleCachedImages(imgURLs);
  }

  getImageURL(index) {
    let item = this.props.propertyItem;
    let mlsid = item.mlsid;
    let resolution = "420x210";
    if( item.piccount > 0 && index < item.piccount ){
      let iterator = index + 1;
      let imgURL="https://i.palmettopark.net/" + mlsid + "-" + iterator + "-" + resolution + ".jpg";
      return { uri: imgURL};
    }
    else {
      return require('@assets/images/darkbg.png');
    }
  }

  onClickViewModeByImages() {
  }
  onClickViewModeByStreet() {
  }

  onClickLeftImage() {
    let item = this.props.propertyItem;
    let index = 0;

    if( item.piccount < 1 )
      return;
    else if( this.state.imageIndex <= 0 )
      index = item.piccount - 1;
    else 
      index = this.state.imageIndex - 1;

    this.setState({
      imageIndex: index
    });
  }
  onClickRightImage() {
    let item = this.props.propertyItem;
    let index = 0;

    if( item.piccount < 1 )
      return;
    else if( this.state.imageIndex >= item.piccount - 1 )
      index = 0;
    else 
      index = this.state.imageIndex + 1;

    this.setState({
      imageIndex: index
    });    
  }

  updateIndex(index) {
    this.setState({
      imageIndex: index
    });
  }

  renderImages(imageIndex, index) {
    return (
        <View style={[styles.slide,]}
              key ={index}>
          <CachedImage
              source={this.getImageURL(imageIndex)}
              defaultSource={Images.imgPreviewLogo}
              style={[styles.cachedImage, ]}>
          </CachedImage>
        </View>
    );    
  }

  renderEmptyImage(index) {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };      
    console.log("renderEmptyImage");    

    return (
        <Image
            source={Images.imgPreviewLogo}
            style={[styles.cachedImage, ]}>
        </Image>
    );    
  }
  

  render() {
    let item = this.props.propertyItem;
    let index = this.props.propertyIndex;

    let isEmpty = true;
    let imageIndexs = [];
    for( i = 0 ; i < item.piccount ; i ++ ) {
      isEmpty = false;      
      imageIndexs.push(i);
    }

    return (
      <View 
        style={styles.listItemContainer} 
        key={index}>

        <View style={styles.cachedImage}>
          <Swiper style={styles.wrapper} 
              index={this.state.imageIndex}
              updateIndex={this.updateIndex.bind(this)}
              showsButtons={false}>
              { isEmpty == false ?
                imageIndexs.map( this.renderImages.bind(this) ) :
                this.renderEmptyImage(index)}
          </Swiper>        

          <TouchableOpacity
            onPress={this.onClickLeftImage.bind(this)} 
            style={styles.pageLeftMark}>
            <Icon name="ios-arrow-back-outline" size={25} color='#FFFA'/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onClickRightImage.bind(this)} 
            style={styles.pageRightMark}>
            <Icon name="ios-arrow-forward-outline" size={25} color='#FFFA'/>
          </TouchableOpacity>
          <View style={styles.pageMark}>
            <Text style={{ color: '#FFF' }}>{item.piccount < 1 ? 0 : this.state.imageIndex + 1} of {item.piccount}</Text>
          </View>
        </View>

        <View style={[styles.controlContainer, {flexDirection:'row'}]}>
          <TouchableOpacity
              onPress={this.onClickViewModeByImages.bind(this)}
              style={{flexDirection:'row',
                    flex:1,
                    borderRightColor:'#FFFA',
                    borderRightWidth:1,
                    justifyContent:'center', 
                    alignItems:'center', }}>
            <View style={{flex:5, flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
              <Icon name="md-images" size={20} color='#FFFA'/>
              <Text style={{ fontWeight:'bold', color:'#FFFA', paddingLeft:5 }}> Photos </Text>
            </View>
          </TouchableOpacity>        
          <TouchableOpacity 
              onPress={this.onClickViewModeByStreet.bind(this)}
              style={{flexDirection:'row',
                      flex:1,
                      borderRightColor:'#FFFA',
                      borderRightWidth:1,
                      justifyContent:'center', 
                      alignItems:'center', }}>
            <View style={{flex:5, 
                        flexDirection:'row', 
                        justifyContent:'center',
                        alignItems:'center'}}>
              <Icon name="md-body" size={20} color='#FFFA'/>
              <Text style={{ fontWeight:'bold', color:'#FFFA', paddingLeft:5 }}> Street View </Text>
            </View>
          </TouchableOpacity>        
        </View>
        
      </View>
    );
  }
}