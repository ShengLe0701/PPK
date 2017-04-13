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

const CachedImage = require('react-native-cached-image');
const {
    ImageCacheProvider
} = CachedImage;

import Swiper from '@components/Swiper';
import GestureRecognizer, {swipeDirections} from '@components/GestureRecognizer';


const styles = StyleSheet.create({
    listItemContainer: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight / 3,
    },

    cachedImage: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight / 3,
    },
    
    pageMark: {
        ...Styles.center, 
        width: 70,
        height: 20,
        backgroundColor: '#0009',
        position: 'absolute',
        right: 20,
        top: 10, 
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
    featureMark: {
        ...Styles.center, 
        width: Metrics.screenWidth / 4,
        height: 30,
        backgroundColor: Colors.brandThird,
        position: 'absolute',
        left: 5,
        top: 5, 
    },
    listItemBottomArea: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        width: Metrics.screenWidth,
        height: Metrics.screenHeight / 8,
        backgroundColor: '#555A',
    },
    bottomInfoFactorsArea: {
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRightWidth: 1,
        borderColor: '#FFF',
    },
    bottomInfoFactorNumber: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    bottomInfoFactorDesc: {
        color: '#FFF',
        fontSize: 14 
    },
    bottomInfoDetailsDesc: {
        color: '#FFF',
        width: Metrics.screenWidth * 0.55,
    },  
});

export default class PropertyPreviewItem extends React.Component {
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

  componentDidMount() {
    this.setImageLoadingByCache();
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

  onSwipeUp(gestureState) {
    this.props.onClickProperty();
  }

  renderImages(imageIndex, index) {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };      
    console.log("renderImages");    
    
    return (
      <GestureRecognizer
        key ={index}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        config={config}>
      
        <CachedImage
            source={this.getImageURL(imageIndex)}
            defaultSource={Images.imgPreviewLogo}
            style={[styles.cachedImage, ]}>
        </CachedImage>
      </GestureRecognizer>
        
    );    
  }

  renderEmptyImage(index) {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };      
    console.log("renderEmptyImage");    

    return (
      <GestureRecognizer
        key ={index}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        config={config}>
      
        <Image
            source={Images.imgPreviewLogo}
            style={[styles.cachedImage, ]}>
        </Image>
      </GestureRecognizer>
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

    let isDetailShow = true;
    if( this.props.isDetailShow == false )
      isDetailShow = false;

    if( isDetailShow ){
      return (
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

            {item.featured === true ?
            <View style={styles.featureMark}>
              <Text style={{ color: '#FFF' }}>FEATURED</Text>
            </View> : null}
            <View style={styles.listItemBottomArea}>
              <View style={{ flex: 3 }}>
                <View style={{ flex: 3, paddingLeft: 10 }}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 18 }}>
                    {priceShort(item.price)}
                  </Text>
                </View>
                <View style={{ flex: 5, flexDirection: 'row' }}>
                  <View style={{ flex: 4, justifyContent: 'space-between', paddingLeft: 10 }}>
                    <Text
                      style={[styles.bottomInfoDetailsDesc, { fontSize: 14 }]}
                      numberOfLines={1}>
                      {item.heading || item.beds + " Beds / " + item.baths_full + " Baths" }
                    </Text>
                    <Text
                      style={[styles.bottomInfoDetailsDesc, { fontSize: 15 }]}
                      numberOfLines={1}>
                      {item.address}
                    </Text>
                  </View>
                  <View style={{ flex: 3, flexDirection: 'row', paddingRight: 10 }}>
                    <View style={[styles.bottomInfoFactorsArea, { flex: 4 }]}>
                      <Text style={styles.bottomInfoFactorNumber}>
                        {item.beds}
                      </Text>
                      <Text style={styles.bottomInfoFactorDesc}>
                        Beds
                      </Text>
                    </View>
                    <View style={[styles.bottomInfoFactorsArea, { flex: 4 }]}>
                      <Text style={styles.bottomInfoFactorNumber}>
                        {item.baths_full}
                      </Text>
                      <Text style={styles.bottomInfoFactorDesc}>
                        Baths
                      </Text>
                    </View>
                    <View style={[styles.bottomInfoFactorsArea, { flex: 5 }]}>
                      <Text style={styles.bottomInfoFactorNumber}>
                        {item.sqft}
                      </Text>
                      <Text style={styles.bottomInfoFactorDesc}>
                        Sq.Ft.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
                backgroundColor: '#6A6A6A',  paddingHorizontal: 10}}>
                <Text style={{ color: '#CCC', fontSize: 12 }}>
                    {item.city + " * " + ( item.community ? item.community : "" ) }
                </Text>
                <Text style={{ color: '#FFF', fontSize: 12 }}>
                  {timeAgo(item.date.listed.sec)}
                </Text>
              </View>
            </View>
          </View>          
      );
    } else {
      return (
          <View style={styles.cachedImage}>
            <Swiper style={styles.wrapper} 
                index={this.state.imageIndex}
                updateIndex={this.updateIndex.bind(this)}
                showsButtons={false}>
                { isEmpty == false ?
                  imageIndexs.map( this.renderImages.bind(this) ) :
                  this.renderEmptyImage(index)}
            </Swiper>        
          </View>
      );
    }
  }
}