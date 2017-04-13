import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, StyleSheet, TextInput, Slider } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import NavigationBar from 'react-native-navbar';

import { replaceRoute } from '@actions/route';
import { setSpinnerVisible } from '@actions/globals';

import { Styles, Colors, Fonts, Metrics } from '@theme/';
import CommonWidgets from '@components/CommonWidgets';
import Constants from '@src/constants';
import Common from '@src/utils/Common';
import styles from './styles';

import {itemsOfPrice, itemsOfRoom, itemsOfSqFtFrom, itemsOfSqFtTo} from '@api/algoliaAPI';
import { setMainParams, setMainProperies, setSelectedProperty, setMapRegion } from '@actions/algolia';

import PropertyViewItem from '@components/PropertyViewItem';
import PrefixTextInput from '@components/PrefixTextInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { Icons, Images } from '@theme';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Stars from 'react-native-stars';

import {priceShort, timeAgo} from '@api/algoliaAPI';

import OverlaySpinner from '@components/OverlaySpinner';
import ActionSheet from '@components/ActionSheet/';


class PropertyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMoreDetails:false,
      isShowPropertyDetailsInfo:false, 
      isShowSchoolsInfo:false, 
      isShowAboutCommunityInfo:false, 
      isShowAskQuestionInfo:false, 
      isShowNearbyInfo:false, 
      isShowNearbySimilarInfo:false, 
      isShowNearbySold:false, 
           
      selectedScheduleDate: new Date(),

      propertyDetailData: null, 

      homePricePercent:100,
      downPercent:20,

      loanIndex:0,
      loanRate:4.125,
      loan:[{key:'0', label:"30 Year Fixed", value:4.125, month:30*12}, 
            {key:'1', label:"15 Year Fixed", value:3.950, month:15*12},
            {key:'2', label:"Custom", value:4.125, month:30*12},
            {key:'3', label:"Cancel"}],

      IsUpdate: false,
    };
  }

  componentDidMount() {
      this.getPropertyDetail();
  }

  componentWillReceiveProps(nextProps){
    if( JSON.stringify(nextProps.algolia.selectedProperty) != JSON.stringify(this.props.algolia.selectedProperty) ){
      this.getPropertyDetail();
    }
  }

  getPropertyDetail() {
    let item = this.props.algolia.selectedProperty;
    let queryURL = Constants.API_URL + '/property/details/?url=' + item.url;
    // let queryURL = Global.API_URL + '/property/details/?url=' + item.url + '&fields='+['property_reviews','remarks'].join(',');
    // this.props.setSpinnerVisible(true);
    // this.props.setSpinnerVisible(false);

    fetch(queryURL, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
        // body: JSON.stringify({
        // }),
    })
    .then((response) => {
        if (!response.ok) {
          return null;
        }
        return response.json();
    })
    .then((responseData) => {
      if (responseData === null) {
        this.setState({
          propertyDetailData : null,
        });
      }
      else {
        this.setState({
          propertyDetailData : responseData
        });
      }
console.log(this.state.propertyDetailData);
      // this.props.setSpinnerVisible(false);
    }).catch((error) => {
      console.log(error);
      // this.props.setSpinnerVisible(false);
    })

  }

  onClickCancel() {
    this.props.navigator.pop();
  }

  renderPropertyView() {
    let item = this.props.algolia.selectedProperty;

    return (
      <PropertyViewItem 
        propertyItem={item} 
        propertyIndex={0}
        onClickProperty={null} > 
      </PropertyViewItem>
    );
  }

  onClickShowMoreDetails() {
    this.setState({
      isShowMoreDetails: !this.state.isShowMoreDetails,
    });
  }

  onClickLike(){
  }

  onClickXOut(){
  }

  onClickShare(){
  }
  
  getStatus(item) {
    return item.status;
  }

  getPostTime(item) {
    return timeAgo(item.date.listed.sec); 
  }

  renderLike(item) {
    let isLike = true;
    if( isLike ){
      return (
          <Icon name="md-heart" 
                size={25} 
                color='#F6B'/>
      );    
    }
    else {
      return (
          <Icon name="md-heart-outline" 
                size={25} 
                color='#000'/>
      );    
    }
  }

  renderPropertyInfo() {
    let item = this.state.propertyDetailData;
    return (
      <View style={{ width: Metrics.screenWidth,
                    height: Metrics.screenHeight / 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:'#e8e8e8' }}>
          <View style={{ flex:2,
                        width: Metrics.screenWidth,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomColor:'#DDDDDD',
                        borderBottomWidth: 1 }}>
              <Text style={{fontSize:17, fontWeight:'bold', color:'#2c3e5a', paddingBottom:3}}>
                {item.address}
              </Text>
              <Text style={{fontSize:13, color:'#333333'}}>
                {item.community}
              </Text>
              <Text style={{fontSize:13, color:'#333333'}}>
                Status : {this.getStatus(item)} 
              </Text>
          </View>
          <View style={{ flex:3,
                        width: Metrics.screenWidth,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomColor:'#DDDDDD',
                        borderBottomWidth: 1 }}>
              <View style={{ flex:3,
                            width: Metrics.screenWidth,
                            flexDirection:'row',
                            justifyContent: 'center',
                            padding:10}}>
                  <View style={{ flex:2,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRightColor:'#DDDDDD',
                                borderRightWidth: 1 }}>
                      <Text style={{fontSize:15, fontWeight:'bold', color:'#2c3e5a', paddingBottom:3}}>
                        ${Common.number2StringByThousandComma(item.price)}
                      </Text>
                      <Text style={{fontSize:13, color:'#333333'}}>
                        Price
                      </Text>
                  </View>
                  <View style={{ flex:1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRightColor:'#DDDDDD',
                                borderRightWidth: 1 }}>
                      <Text style={{fontSize:15, fontWeight:'bold', color:'#2c3e5a', paddingBottom:3}}>
                        {item.beds}
                      </Text>
                      <Text style={{fontSize:13, color:'#333333'}}>
                        Beds
                      </Text>
                  </View>
                  <View style={{ flex:1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRightColor:'#DDDDDD',
                                borderRightWidth: 1 }}>
                      <Text style={{fontSize:15, fontWeight:'bold', color:'#2c3e5a', paddingBottom:3}}>
                        {item.baths_full}
                      </Text>
                      <Text style={{fontSize:13, color:'#333333'}}>
                        Baths
                      </Text>
                  </View>
                  <View style={{ flex:2,
                                justifyContent: 'center',
                                alignItems: 'center'}}>
                      <Text style={{fontSize:15, fontWeight:'bold', color:'#2c3e5a', paddingBottom:3}}>
                        {item.sqft}
                      </Text>
                      <Text style={{fontSize:13, color:'#333333'}}>
                        Sq.Ft
                      </Text>
                  </View>
              </View>
              <Text style={{flex:1, fontSize:13, color:'#333333'}}>
                Listed : {this.getPostTime(item)} 
              </Text>
          </View>
          <View style={{ flex:2,
                        flexDirection : 'row',                        
                        width: Metrics.screenWidth,
                        justifyContent: 'center',
                        borderBottomColor:'#DDDDDD',
                        borderBottomWidth: 1 }}>
              <View style={{ width: 120,
                        flexDirection : 'row',
                        justifyContent: 'center' }}>
                  <View style={{ width: 40,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                      <TouchableOpacity 
                          onPress={this.onClickLike.bind(this)}
                          style={{backgroundColor:'#FFFFFF',
                                borderColor:'#DDDDDD',
                                borderWidth:1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width:40,
                                height:30}}>
                          {this.renderLike(item)}
                      </TouchableOpacity>
                      <Text style={{fontSize:13, color:'#333333', paddingTop:1}}>
                        Like
                      </Text>
                                
                  </View>
                  <View style={{ width: 40,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                      <TouchableOpacity 
                          onPress={this.onClickXOut.bind(this)}
                          style={{backgroundColor:'#FFFFFF',
                                  borderColor:'#DDDDDD',
                                  borderWidth:1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width:40,
                                  height:30}}>
                          <Icon name="md-close" 
                                size={25} color='#000'/>
                      </TouchableOpacity>
                      <Text style={{fontSize:13, color:'#333333', paddingTop:1}}>
                        X-Out
                      </Text>
                  </View>
                  <View style={{ width: 40,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                      <TouchableOpacity 
                          onPress={this.onClickShare.bind(this)}
                          style={{backgroundColor:'#FFFFFF',
                                  borderColor:'#DDDDDD',
                                  borderWidth:1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width:40,
                                  height:30}}>
                          <Icon name="md-share-alt" 
                                size={25} color='#000'/>
                      </TouchableOpacity>
                      <Text style={{fontSize:13, color:'#333333', paddingTop:1}}>
                        Share
                      </Text>
                  </View>
              </View>
                
          </View>      
      </View>      
    );
  }

  renderPropertyDesc() {
    let item = this.state.propertyDetailData;

    let styleShowMoreDetails = {height:Metrics.screenHeight / 3};
    if( this.state.isShowMoreDetails == true )
      styleShowMoreDetails = {}

    let firstRemarks = item.remarks_short;
    let secondRemarks = item.remarks.substring(item.remarks_short.length + 1, item.remarks.length)

    let otherFeatures = "";
    for (var key in item.features) {
      if( item.features[key] == true)
        otherFeatures = otherFeatures + key + ", ";
    }

    return (
      <View style={[{ width: Metrics.screenWidth,
                    padding:10,
                    justifyContent: 'flex-start',
                    alignItems: 'center' }, styleShowMoreDetails]}>
        <Text style={{color:'#333333', paddingBottom:10}}>
          {firstRemarks}
        </Text>
        <View style={{ justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:'#E0E8FF',
                      borderLeftColor:'#0BF',
                      borderLeftWidth:3 }}>
          <Text style={{color:'#333333', fontSize:17, fontWeight:'bold', padding:20}}>
            {item.beds} Bedrooms, {item.baths_full} Baths, {item.baths_full} Half Baths {otherFeatures}
          </Text>
        </View>
        <Text style={{color:'#333333', paddingTop:10}}>
          {secondRemarks}
        </Text>
        <View 
            style={{width: Metrics.screenWidth,
                    flexDirection:'row',
                    borderBottomColor:'#DDDDDD',
                    backgroundColor:'#FFF',
                    borderBottomWidth:1,
                    position:'absolute',
                    bottom:0,
                    justifyContent: 'flex-start',
                    alignItems: 'center'}}>
            <TouchableOpacity
              onPress={this.onClickShowMoreDetails.bind(this)} 
              style={{
                height:40,
                paddingLeft:10,
                flexDirection:'row',
                justifyContent: 'flex-start',
                alignItems: 'center'}}>
              <Icon name={ this.state.isShowMoreDetails ? "ios-arrow-up" : "ios-arrow-down"} 
                    size={25} color='#3a8da9'/>
              <Text style={{fontSize:17, fontWeight:'bold', color:'#3a8da9', paddingLeft:10}}>
                Show more details
              </Text>
            </TouchableOpacity>
        </View>
      </View>      
    );    
  }

  onClickScheduleItem(date){
    this.setState({
      selectedScheduleDate: date,
    });
  }

  renderShedulerItem(date, index) {
    var days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    var dayName = days[ date.getDay() ];
    var monthName = months[ date.getMonth() ];

    let selected = false;
    if( this.state.selectedScheduleDate.getDate() == date.getDate() ){
      selected = true;
    }

    return (
      <TouchableOpacity key ={index}
            onPress={this.onClickScheduleItem.bind(this, date)}
              style={{width:60, 
                    height:60, 
                    borderRadius:2,
                    marginLeft:10,
                    justifyContent: 'center',
                    alignItems: 'center',                    
                    borderColor: selected ? '#8A8A8A' : '#E7E7E7',
                    borderWidth: 2, }}>
        <View style={{flex:2, 
                      justifyContent: 'center',
                      alignItems: 'center' }}>
          <Text style={{fontSize:7, color:'#333333'}}>
              {dayName}
          </Text>
        </View>
        <View style={{flex:3, 
                      justifyContent: 'center',
                      alignItems: 'center' }}>
          <Text style={{fontSize:15, color:'#333333'}}>
              {date.getDate()}
          </Text>
        </View>
        <View style={{flex:2, 
                      justifyContent: 'center',
                      alignItems: 'center' }}>
          <Text style={{fontSize:9, color:'#333333'}}>
              {monthName}
          </Text>
        </View>
      </TouchableOpacity>
    );    
  }

  renderSchedular() {
    let item = this.props.algolia.selectedProperty;

    let todayDate = new Date();
    let scheduleTimes = [];
    scheduleTimes.push(todayDate);

    for( var i = 0 ; i < 9 ; i ++){
      let nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + i + 1);
      scheduleTimes.push(nextDate);
    }

    return (
      <View style={{width: Metrics.screenWidth,
                    height: Metrics.screenHeight / 3,
                    padding:10,
                    backgroundColor:'#FFF',
                    borderBottomColor:'#DDDDDD',
                    borderBottomWidth:1,
                    justifyContent: 'center',
                    alignItems: 'center' }}>
        <Text style={{flex:1,
                      fontSize:18,
                      color:'#2c3e5a', 
                      paddingTop:20}}>
          Go Tour This Home
        </Text>
        <ScrollView 
            horizontal={true} 
            style={{ flex: 4,
                    marginLeft:10,
                    marginRight:10,
                    paddingTop:30,
                    paddingBottom:30,
                    width: Metrics.screenWidth - 10,}}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center'}}>
              {scheduleTimes.map( (date, index) => this.renderShedulerItem(date, index))}          
        </ScrollView>
        <TouchableOpacity style={{flex:1.5, 
                        width: Metrics.screenWidth - 20,
                        borderRadius: 5,
                        backgroundColor:'#CE0000',
                        justifyContent: 'center',
                        alignItems: 'center' }}>
          <Text style={{fontSize:17,
                        color:'#FFF', 
                        fontWeight:'bold'}}>
            Schedule Tour
          </Text>
        </TouchableOpacity>
        <Text style={{flex:1,
                      paddingTop:10,
                      color:'#333333'}}>
          It's free, with no obligation - cancel anytime
        </Text>

      </View>      
    );
  }

  renderAgentMap() {
    let item = this.state.propertyDetailData;

    let lat = item.locSearch[1];
    let lng = item.locSearch[0];

    let mapRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.1,//Zoom of Map = 20
      longitudeDelta: (0.1 * Metrics.screenWidth) / Metrics.screenHeight,
    };

    return(
      <View style={{
        width:Metrics.screenWidth,
        height:Metrics.screenHeight / 3,
        justifyContent: 'center',
        alignItems: 'center',        
        backgroundColor:'#FFF',  }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={[{...StyleSheet.absoluteFillObject}, {margin:10}]}
          initialRegion = {mapRegion}>
            <MapView.Marker
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}>
            </MapView.Marker>
        </MapView>
      </View>
    );
  }

  renderAgentInfo() {
    let item = this.state.propertyDetailData;
    // let name = item.agent_contact;

    let reviewClients = 41;
    let agentPhotoUrl = "https://i.palmettopark.net/agents/drewre-110x110.png";

    return(
      <View style={{
        width:Metrics.screenWidth,  
        height:Metrics.screenHeight / 2,
        padding:10,
        justifyContent: 'center',
        alignItems: 'center',        
        backgroundColor:'#FFF', }}>
          <View style={{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',        
            backgroundColor:'#FFF', }}>
            <Text style={{fontSize:15,
                          textAlign:'center',
                          color:'#333333',}}>
              Your Agent in
            </Text>
            <Text style={{fontSize:15,
                          textAlign:'center',
                          color:'#333333', 
                          fontWeight:'bold'}}>
              The Townes At Pine Grove
            </Text>
          </View>
          <View style={{
            flex:2,
            flexDirection:'row',
            justifyContent: 'center',
            backgroundColor:'#FFF', }}>
            <View style={{
              flex:2,
              justifyContent: 'center',
              alignItems: 'center' }}>
              <View style={{
                    flex:1,
                    justifyContent: 'center',
                    alignItems: 'center'}}>
                <Text style={{fontSize:15,
                              textAlign:'center',
                              color:'#0BF', 
                              fontWeight:'bold'}}>
                  Drew Nichols, Broker
                </Text>
              </View>
              <View style={{
                    flex:3,
                    justifyContent: 'center',
                    alignItems: 'center'}}>
                <Image style={{width:Metrics.screenWidth / 1.8}} 
                      resizeMode={'contain'}
                      source={Images.imgLogo1} />
              </View>
              <View style={{
                    flex:3,
                    justifyContent: 'center',
                    alignItems: 'center'}}>
                  <Stars
                        rating={5}
                        update={(val)=>{this.setState({stars: val})}}
                        spacing={5}
                        starSize={20}
                        count={5}
                        fullStar={require('@assets/images/star.png')}
                        emptyStar={require('@assets/images/star-outline.png')}/>
                  <Text style={{fontSize:13,
                        textAlign:'center',
                        color:'#0BF'}}>
                    {reviewClients} client reviews
                  </Text>
              </View>
            </View>
            <View style={{
              flex:1,
              width:Metrics.screenWidth,
              justifyContent: 'center',
              alignItems: 'center'}}>
              <Image style={{...StyleSheet.absoluteFillObject}}
                source={{uri:agentPhotoUrl}}>
              </Image>
            </View>
          </View>
          <View style={{
            flex:3,
            justifyContent: 'center',
            alignItems: 'center',        
            backgroundColor:'#FFF', }}>
            <View style={{
              flex:1,
              marginTop:10,
              justifyContent: 'center',
              alignItems: 'center'}}>
                <TouchableOpacity style={{ 
                                width: Metrics.screenWidth - 20,
                                height:35,
                                backgroundColor:'#585858',
                                justifyContent: 'center',
                                alignItems: 'center' }}>
                  <Text style={{fontSize:17,
                                color:'#FFF', 
                                fontWeight:'bold'}}>
                    Ask a Question
                  </Text>
                </TouchableOpacity>
            </View>
            <View style={{
              flex:3,
              justifyContent: 'center',
              alignItems: 'center'}}>

              <Text style={{fontSize:13,
                            textAlign:'center',
                            color:'#0BF',}}>
                Start an Offer
              </Text>
              <Text style={{fontSize:16,
                            margin:5,
                            textAlign:'center',
                            color:'#0BF', 
                            fontWeight:'bold'}}>
                <Icon name="md-call" 
                      size={20} 
                      color='#333333'/>
               {"  "}(561)232-2100
              </Text>
              <Text style={{fontSize:15,
                            margin:5,
                            textAlign:'center',
                            color:'#333333'}}>
                Questions? Call Drew's Team
              </Text>
            </View>
          </View>          
      </View>
    );    
  }

  onChangeHomePrice(text) {
    let item = this.state.propertyDetailData;
        
    let homePrice = parseInt(text, 10);
    if( homePrice > item.price || homePrice < 0 ) {
      this.setState({
        IsUpdate:!this.state.IsUpdate
      });
      return;
    }

    this.setState({
      homePricePercent:homePrice / item.price * 100
    });
  }

  onChangeDownPrice(text) {
    let item = this.state.propertyDetailData;


    let downPrice = parseInt(text, 10);
    if( downPrice > item.price || downPrice < 0 ) {
      this.setState({
        IsUpdate:!this.state.IsUpdate
      });
      return;
    }

    this.setState({
      downPercent:downPrice / item.price * 100,
    });
  }

  onChangeDownPercent(text) {
    let downPercent = parseInt(text, 10);
    if( downPercent > 100 || downPercent < 0 ) {
      this.setState({
        IsUpdate:!this.state.IsUpdate
      });
      return;
    }

    this.setState({
      downPercent:downPercent
    });
  }

  onChangeSliderHomePricePercent(value) {
    this.setState({
      homePricePercent:value
    });
  }
  onChangeSliderDownPercent(value) {
    this.setState({
      downPercent:value
    });
  }
  onChangeSliderLoanRate(value) {
    this.setState({
      loanIndex: 2,
      loanRate:value
    });
  }

  showLoanActionSheetMenu() {
console.log("showLoanActionSheetMenu")    
    this.LoanActionSheet.show();
  }
  onLoanActionSheetMenu(index) {
    switch (index) {
      case 0:
        this.setState({
          loanIndex: 0,
          loanRate:this.state.loan[index].value
        });      
        break;
      case 1:
        this.setState({
          loanIndex: 1,
          loanRate:this.state.loan[index].value
        });      
        break;
      case 2:
        this.setState({
          loanIndex: 2,
          loanRate:this.state.loan[0].value
        });      
        break;
      default:
    }
  }
  
  renderPaymentItem(itemColor, itemCaption, itemValue){

    return(
      <View style={{flex:1,
                    marginHorizontal:10,
                    borderBottomColor:'#8A8A8A',
                    borderBottomWidth:1,
                    justifyContent: 'center',
                    flexDirection:'row',}}>
          <View style={{flex:0.5,
                        justifyContent: 'center',
                        alignItems: 'center',}}>
              <View style={{width:10, 
                            height:10,
                            borderRadius:5,
                            backgroundColor:itemColor}}>
              </View>
          </View>
          <View style={{flex:5,          
                        justifyContent: 'center', 
                        alignItems: 'flex-start'}}>
              <Text style={{fontSize:13,
                            color:'#333333'}}>
                  {itemCaption}  
              </Text>
          </View>
          <View style={{flex:2,          
                        justifyContent: 'center',
                        alignItems: 'center'}}>
              <Text style={{fontSize:13,
                            color:'#333333'}}>
                  ${itemValue}  
              </Text>
          </View>
      </View>
    )    
  }

  renderPaymentCalculator() {
    item = this.state.propertyDetailData;

    let loan = this.state.loan;
    let loanIndex = this.state.loanIndex;
    let loanRate = this.state.loanRate;

    let homePricePercent = this.state.homePricePercent;
    let downPercent = this.state.downPercent;
    
    let defaultHomeAmount = item.price;
    let taxAmount = item.tax_amount;
    let hoaAmount = item.hoa_amount == null ? 0:item.hoa_amount;
    let insuranceAmount = item.insurance_cost;

    let homeAmount = defaultHomeAmount / 100 * homePricePercent;
    let downAmount = homeAmount / 100 * downPercent;
    let realAmount = homeAmount - downAmount;

    let e = loanRate / 100 / 12;
    let f = Math.pow(1 + e, loan[loanIndex].month);
    let g = realAmount * f * e / (f - 1);

    let monthAmount = 0;
    let totalAmount = 0;
    let totalInterestAmount = 0;
    if( loanRate * loan[loanIndex].month * realAmount != 0 ) {
      monthAmount = g;
      totalAmount = g * loan[loanIndex].month;
      totalInterestAmount = g * loan[loanIndex].month - realAmount;
    }

    let calculatedAmount = monthAmount + taxAmount + hoaAmount + insuranceAmount;

    return (
      <View style={{
        width:Metrics.screenWidth,
        height:Metrics.screenHeight / 1.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#FFF', }}>
        <View style={{
          width:Metrics.screenWidth - 20,
          height:Metrics.screenHeight / 1.4,
          margin:10,
          justifyContent: 'center',
          alignItems: 'center',
          borderLeftColor:'#C6C6C6',
          borderRightColor:'#D1D1D1',
          borderTopColor:'#F5F5F5',
          borderBottomColor:'#ACACAC',
          borderWidth:2, }}>
          <View style={{flex:1,          
                        justifyContent: 'center',
                        alignItems: 'center',}}>
              <Text style={{flex:2,
                            marginTop:5,
                            fontSize:20,
                            textAlign:'center',
                            color:'#2c3e5a', 
                            fontWeight:'bold'}}>
                  Payment Calculator 
              </Text>
              <Text style={{flex:1,
                            fontSize:16,
                            textAlign:'center',
                            color:'#2c3e5a', 
                            fontWeight:'bold'}}>
                  ${calculatedAmount.toFixed(2)} Per Month 
              </Text>
              <Text style={{flex:1,
                            fontSize:13,
                            textAlign:'center',
                            color:'#333333'}}>
                  {loan[loanIndex].label}, {loanRate}% 
              </Text>
          </View>          
          <View style={{flex:2,          
                        justifyContent: 'center',
                        alignItems: 'center',}}>
              <View style={{flex:1,
                            justifyContent: 'center'}}>
                  <View style={{width:Metrics.screenWidth - 40, 
                                height:10,
                                flexDirection:'row',}}>
                      <View style={{width:(Metrics.screenWidth - 40) * monthAmount / calculatedAmount, 
                                    height:10,
                                    backgroundColor:'#1BE',
                                    flexDirection:'row',}}>
                      </View>
                      <View style={{width:(Metrics.screenWidth - 40) * taxAmount / calculatedAmount, 
                                    height:10,
                                    backgroundColor:'#FB2',
                                    flexDirection:'row',}}>
                      </View>
                      <View style={{width:(Metrics.screenWidth - 40) * insuranceAmount / calculatedAmount, 
                                    height:10,
                                    backgroundColor:'#7C3',
                                    flexDirection:'row',}}>
                      </View>
                  </View>
              </View>

              {this.renderPaymentItem('#1BE', "Principle and Interest", monthAmount.toFixed(2) )}
              {this.renderPaymentItem('#FB2', "Property Taxes", taxAmount.toFixed(2) )}
              {this.renderPaymentItem('#7C3', "Homeowners' Insurance", insuranceAmount.toFixed(2) )}

          </View>          
          <View style={{flex:3,
                        width:Metrics.screenWidth - 40,           
                        justifyContent: 'center',
                        alignItems: 'center',}}>
              <View style={{flex:1.5,          
                            width:Metrics.screenWidth - 40,           
                            justifyContent: 'center',
                            alignItems: 'center',}}>
                  <View style={{flex:1,          
                                width:Metrics.screenWidth - 40,           
                                justifyContent: 'center',
                                alignItems: 'flex-start',}}>
                      <Text style={{fontSize:13,
                                    fontWeight:'bold',
                                    color:'#333333'}}>
                        Home Price  
                      </Text>
                  </View>          
                  <View style={{flex:2,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                    <PrefixTextInput keyboardType='numeric'
                                     width={Metrics.screenWidth - 40}
                                     height={30}
                                     borderColor='#D0D0D0'
                                     fontColor='#333333'
                                     defaultValue={homeAmount.toString()}
                                     value={homeAmount.toString()}
                                     isPrefix={true}
                                     prefixValue='$'
                                     onChangeText={this.onChangeHomePrice.bind(this)} />
                  </View>
                  <View style={{flex:2,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                      <Slider style={{
                                width: Metrics.screenWidth - 40,
                                justifyContent: 'center',
                                alignItems: 'center',}}
                        maximumValue={100}
                        step={5}
                        value={homePricePercent}
                        onValueChange={this.onChangeSliderHomePricePercent.bind(this)} />                                
                  </View>
              </View>          
              <View style={{flex:1.5,          
                            width:Metrics.screenWidth - 40,           
                            justifyContent: 'center',
                            alignItems: 'center',}}>
                  <View style={{flex:1,          
                                width:Metrics.screenWidth - 40,           
                                justifyContent: 'center',
                                alignItems: 'flex-start',}}>
                      <Text style={{fontSize:13,
                                    fontWeight:'bold',
                                    color:'#333333'}}>
                        Down Payment  
                      </Text>
                  </View>          
                  <View style={{flex:2,
                                flexDirection:'row',
                                justifyContent: 'center'}}>
                    <PrefixTextInput keyboardType='numeric'
                                     width={(Metrics.screenWidth - 40) * 0.7}
                                     height={30}
                                     borderColor='#D0D0D0'
                                     fontColor='#333333'
                                     defaultValue={downAmount.toString()}
                                     value={downAmount.toString()}
                                     isPrefix={true}
                                     prefixValue='$'
                                     onChangeText={this.onChangeDownPrice.bind(this)} />
                    <PrefixTextInput keyboardType='numeric'
                                     width={(Metrics.screenWidth - 40) * 0.3}
                                     height={30}
                                     borderColor='#D0D0D0'
                                     fontColor='#333333'
                                     defaultValue={downPercent.toString()}
                                     value={downPercent.toString()}
                                     isPrefix={false}
                                     prefixValue='%'
                                     onChangeText={this.onChangeDownPercent.bind(this)} />
                  </View>
                  <View style={{flex:2,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                      <Slider style={{
                                width: Metrics.screenWidth - 40,
                                justifyContent: 'center',
                                alignItems: 'center',}}
                        maximumValue={100}
                        step={5}
                        value={downPercent}
                        onValueChange={this.onChangeSliderDownPercent.bind(this)} />                                
                  </View>
              </View>          
              <View style={{flex:1,          
                            justifyContent: 'center',
                            alignItems: 'center',}}>
                <View style={{flex:2,
                              flexDirection:'row',
                              justifyContent: 'center', }}>
                  <TouchableOpacity
                    style={{ alignItems:'center',
                              justifyContent: 'center',
                              width:(Metrics.screenWidth - 40) * 0.5,
                              height:30,
                              borderColor:'#D0D0D0', 
                              borderWidth:1}}
                    onPress={() => this.showLoanActionSheetMenu()}>
                    <Text style={{fontSize:13,
                                  fontWeight:'bold',
                                  color:'#333333'}}>
                      {loan[loanIndex].label}  
                    </Text>
                  </TouchableOpacity>
                  <PrefixTextInput keyboardType='numeric'
                                    width={(Metrics.screenWidth - 40) * 0.5}
                                    height={30}
                                    borderColor='#D0D0D0'
                                    fontColor='#333333'
                                    defaultValue={loanRate.toString()}
                                    value={loanRate.toString()}
                                    isPrefix={false}
                                    prefixValue='%'
                                    onChangeText={this.onChangeSliderLoanRate.bind(this)} />
                </View>
                            
              </View>          
          </View>          
        </View>

        <ActionSheet
          ref={(as) => { this.LoanActionSheet = as; }}
          options={loan}
          cancelButtonIndex={loan.length-1}
          onPress={this.onLoanActionSheetMenu.bind(this)}
          tintColor={Colors.textSecondary} />
        
      </View>
    );    
  }

  onClickShowPropertyDetailsInfo() {
    this.setState({
      isShowPropertyDetailsInfo: !this.state.isShowPropertyDetailsInfo,
    });

  }

  renderPropertyDetailsInfo() {
    let item = this.state.propertyDetailData;

    return (
        <View style={{ width: Metrics.screenWidth,
                      paddingTop:10,
                      backgroundColor:'#FFF',
                      justifyContent: 'flex-start',
                      alignItems: 'center' }}>
          <TouchableOpacity
            onPress={this.onClickShowPropertyDetailsInfo.bind(this)} 
            style={{
              height:60,
              width:Metrics.screenWidth - 40,
              borderTopWidth:1,
              borderColor:'#ACACAC',
              flexDirection:'row',
              alignItems:'center',
              justifyContent: 'space-between'}}>
            <Text style={{fontSize:20, color:'#333333'}}>
              Property Details
            </Text>
            <Icon name={ this.state.isShowPropertyDetailsInfo == false? "ios-arrow-forward" : "ios-arrow-down"} 
                  size={25} color='#333333'/>
          </TouchableOpacity>
        </View>      
    );
  }

  onClickShowSchoolsInfo() {
    this.setState({
      isShowSchoolsInfo: !this.state.isShowSchoolsInfo,
    });

  }
  
  renderSchoolsInfo() {
    let item = this.state.propertyDetailData;

    return (
        <View style={{ width: Metrics.screenWidth,
                      backgroundColor:'#FFF',
                      justifyContent: 'flex-start',
                      alignItems: 'center' }}>
          <TouchableOpacity
            onPress={this.onClickShowSchoolsInfo.bind(this)} 
            style={{
              height:60,
              width:Metrics.screenWidth - 40,
              borderTopWidth:1,
              borderColor:'#ACACAC',
              flexDirection:'row',
              alignItems:'center',
              justifyContent: 'space-between'}}>
            <Text style={{fontSize:20, color:'#333333'}}>
              Schools
            </Text>
            <Icon name={ this.state.isShowSchoolsInfo == false? "ios-arrow-forward" : "ios-arrow-down"} 
                  size={25} color='#333333'/>
          </TouchableOpacity>
        </View>      
    );
  }

  onClickShowAboutCommunityInfo() {
    this.setState({
      isShowAboutCommunityInfo: !this.state.isShowAboutCommunityInfo,
    });

  }
  
  renderAboutCommunityInfo() {
    let item = this.state.propertyDetailData;

    return (
        <View style={{ width: Metrics.screenWidth,
                      backgroundColor:'#FFF',
                      justifyContent: 'flex-start',
                      alignItems: 'center' }}>
          <TouchableOpacity
            onPress={this.onClickShowAboutCommunityInfo.bind(this)} 
            style={{
              height:60,
              width:Metrics.screenWidth - 40,
              borderTopWidth:1,
              borderColor:'#ACACAC',
              flexDirection:'row',
              alignItems:'center',
              justifyContent: 'space-between'}}>
            <Text style={{fontSize:20, color:'#333333'}}>
              About the Community
            </Text>
            <Icon name={ this.state.isShowAboutCommunityInfo == false? "ios-arrow-forward" : "ios-arrow-down"} 
                  size={25} color='#333333'/>
          </TouchableOpacity>
        </View>      
    );
  }
  
  onClickShowAskQuestionInfo() {
    this.setState({
      isShowAskQuestionInfo: !this.state.isShowAskQuestionInfo,
    });

  }
  
  renderAskQuestionInfo() {
    let item = this.state.propertyDetailData;

    return (
        <View style={{ width: Metrics.screenWidth,
                      backgroundColor:'#FFF',
                      justifyContent: 'flex-start',
                      alignItems: 'center' }}>
          <TouchableOpacity
            onPress={this.onClickShowAskQuestionInfo.bind(this)} 
            style={{
              height:60,
              width:Metrics.screenWidth - 40,
              borderTopWidth:1,
              borderColor:'#ACACAC',
              flexDirection:'row',
              alignItems:'center',
              justifyContent: 'space-between'}}>
            <Text style={{fontSize:20, color:'#333333'}}>
              Ask a Question
            </Text>
            <Icon name={ this.state.isShowAskQuestionInfo == false? "ios-arrow-forward" : "ios-arrow-down"} 
                  size={25} color='#333333'/>
          </TouchableOpacity>
        </View>      
    );
  }

  onClickShowNearbyInfo() {
    this.setState({
      isShowNearbyInfo: !this.state.isShowNearbyInfo,
    });

  }
  
  renderNearbyInfo() {
    let item = this.state.propertyDetailData;

    return (
        <View style={{ width: Metrics.screenWidth,
                      backgroundColor:'#FFF',
                      justifyContent: 'flex-start',
                      alignItems: 'center' }}>
          <TouchableOpacity
            onPress={this.onClickShowNearbyInfo.bind(this)} 
            style={{
              height:60,
              width:Metrics.screenWidth - 40,
              borderTopWidth:1,
              borderColor:'#ACACAC',
              flexDirection:'row',
              alignItems:'center',
              justifyContent: 'space-between'}}>
            <Text style={{fontSize:20, color:'#333333'}}>
              Nearby
            </Text>
            <Icon name={ this.state.isShowNearbyInfo == false? "ios-arrow-forward" : "ios-arrow-down"} 
                  size={25} color='#333333'/>
          </TouchableOpacity>
        </View>      
    );
  }

  onClickShowNearbySimilarInfo() {
    this.setState({
      isShowNearbySimilarInfo: !this.state.isShowNearbySimilarInfo,
    });

  }
  
  renderNearbySimilarInfo() {
    let item = this.state.propertyDetailData;

    return (
        <View style={{ width: Metrics.screenWidth,
                      backgroundColor:'#FFF',
                      justifyContent: 'flex-start',
                      alignItems: 'center' }}>
          <TouchableOpacity
            onPress={this.onClickShowNearbySimilarInfo.bind(this)} 
            style={{
              height:60,
              width:Metrics.screenWidth - 40,
              borderTopWidth:1,
              borderColor:'#ACACAC',
              flexDirection:'row',
              alignItems:'center',
              justifyContent: 'space-between'}}>
            <Text style={{fontSize:20, color:'#333333'}}>
              Nearby Similar
            </Text>
            <Icon name={ this.state.isShowNearbySimilarInfo == false? "ios-arrow-forward" : "ios-arrow-down"} 
                  size={25} color='#333333'/>
          </TouchableOpacity>
        </View>      
    );
  }

  onClickShowNearbySold() {
    this.setState({
      isShowNearbySold: !this.state.isShowNearbySold,
    });

  }
  
  renderNearbySold() {
    let item = this.state.propertyDetailData;

    return (
        <View style={{ width: Metrics.screenWidth,
                      backgroundColor:'#FFF',
                      justifyContent: 'flex-start',
                      alignItems: 'center' }}>
          <TouchableOpacity
            onPress={this.onClickShowNearbySold.bind(this)} 
            style={{
              height:60,
              width:Metrics.screenWidth - 40,
              borderTopWidth:1,
              borderBottomWidth:1,
              borderColor:'#ACACAC',
              flexDirection:'row',
              alignItems:'center',
              justifyContent: 'space-between'}}>
            <Text style={{fontSize:20, color:'#333333'}}>
              Nearby Sold
            </Text>
            <Icon name={ this.state.isShowNearbySold == false? "ios-arrow-forward" : "ios-arrow-down"} 
                  size={25} color='#333333'/>
          </TouchableOpacity>
        </View>      
    );
  }

  renderOtherInfo() {
    let item = this.state.propertyDetailData;

    return (
      <View style={{ width: Metrics.screenWidth,
                    padding:15,
                    backgroundColor:'#FFF',
                    justifyContent: 'flex-start',
                    alignItems: 'center' }}>
        {CommonWidgets.renderSpacer(1)}
                    
        <Text style={{color:'#333333', paddingBottom:10, fontSize:15}}>
          {item.address} listing courtesy of {item.list_agent} of {item.list_company}
        </Text>
        <Text style={{color:'#333333', paddingBottom:10}}>
          {item.disclaimer}
        </Text>
      </View>
    );
  }
  

  renderNavBarLeftButton() {
    return (
        <TouchableOpacity style={{paddingBottom: 15}}
          onPress={ this.onClickCancel.bind(this)}>
          <Text style={{color:'black'}}>Cancel</Text>
        </TouchableOpacity>
     );
  };  

  render() {
    if( this.state.propertyDetailData == null )
      return null;

    return (
      <View style={Styles.listContainer}>
        {CommonWidgets.renderStatusBar(Colors.brandPrimary)}
        <NavigationBar
          style={Styles.navBarStyle}
          title={CommonWidgets.renderNavBarHeader('Property Detail')}
          leftButton={this.renderNavBarLeftButton()}          
          tintColor={Colors.brandSecondary} />

        <View style={[Styles.listContainer, { flex: 1, }]}>
          <ScrollView style={{ flex: 1 }}>
            {this.renderPropertyView()}
            {this.renderPropertyInfo()}
            {this.renderPropertyDesc()}
            {this.renderSchedular()}
            {this.renderAgentMap()}
            {this.renderAgentInfo()}
            {this.renderPaymentCalculator()}

            {this.renderPropertyDetailsInfo()}
            {this.renderSchoolsInfo()}
            {this.renderAboutCommunityInfo()}
            {this.renderAskQuestionInfo()}
            {this.renderNearbyInfo()}
            {this.renderNearbySimilarInfo()}
            {this.renderNearbySold()}

            {this.renderOtherInfo()}

          </ScrollView>
        </View>

        <OverlaySpinner visible={this.props.globals.spinnerVisible} />
      </View>
    );
  }

}


PropertyDetail.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  replaceRoute: React.PropTypes.func.isRequired,
  setSpinnerVisible: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    replaceRoute: route => dispatch(replaceRoute(route)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}

function mapStateToProps(state) {
  const globals = state.get('globals');
  const algolia = state.get('algolia');
  return { globals, algolia };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyDetail);
