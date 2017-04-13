import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import NavigationBar from 'react-native-navbar';

import { replaceRoute } from '@actions/route';
import { setSpinnerVisible } from '@actions/globals';

import { Styles, Colors, Fonts, Metrics } from '@theme/';
import CommonWidgets from '@components/CommonWidgets';
import Constants from '@src/constants';
import Utils from '@src/utils';
import styles from './styles';

import {priceShort, timeAgo} from '@api/algoliaAPI';
import { Icons, Images } from '@theme';
import PropertyPreviewItem from '@components/PropertyPreviewItem';
import { setSelectedProperty } from '@actions/algolia';

import Icon from 'react-native-vector-icons/Ionicons';

class SignUpView extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  onClickPropertyPreview(item) {

    this.props.navigator.push({
        id: 'propertydetail',
        passProps: {
      },
    });

  }

  onClickFaceBookLogin() {
  }

  onClickSignUpWithEmail() {
  }

  onClickLogin() {
  }
  
  render() {
    let index = 0;

    let item = this.props.algolia.mainProperties ? this.props.algolia.mainProperties[index] : null;

    return (
      <View style={Styles.listContainer}>
          <View 
            style={{
              height:Metrics.screenHeight/3,
              width:Metrics.screenWidth,
              flexDirection:'row',
              alignItems:'center',
              justifyContent: 'center'}}>
              <PropertyPreviewItem 
                propertyItem={item}
                isDetailShow={false} 
                propertyIndex={index} > 
              </PropertyPreviewItem>
          </View>
          <View style={{
              height:Metrics.screenHeight/3 * 1.5,
              width:Metrics.screenWidth,
              alignItems:'center',
              justifyContent: 'center'}}>

              <View style={{flex:2,
                  width:Metrics.screenWidth - 40,
                  alignItems:'center',
                  justifyContent: 'center'}}>
                <Text style={{fontSize:20, 
                              color:'#333333', textAlign:'center'}}>
                  Get personalized home recommendations in Palmetto Park
                </Text>
              </View>
              <View style={{flex:1,
                  width:Metrics.screenWidth - 40,
                  alignItems:'center',
                  justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={this.onClickFaceBookLogin.bind(this)} 
                    style={{height:40,
                          width:Metrics.screenWidth - 40,
                          borderRadius:2,
                          backgroundColor:'#6175b1',
                          flexDirection:'row',
                          alignItems:'center',
                          justifyContent: 'flex-start'}}>
                        <View style={{flex:2,
                                      alignItems:'center',
                                      justifyContent: 'center'}}>
                          <Image
                            style={{
                              width: Metrics.screenHeight / 25,
                              height: Metrics.screenHeight / 25,
                              tintColor: '#FFF' }}
                            resizeMode={'contain'}
                            source={Icons.facebook}/>
                        </View>
                        <Text style={{fontSize:15, color:'#FFF', flex:8}}>
                          Continue with FaceBook Login
                        </Text>
                  </TouchableOpacity>          
              </View>
              <View style={{flex:1,
                  width:Metrics.screenWidth - 40,
                  alignItems:'center',
                  justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={this.onClickFaceBookLogin.bind(this)} 
                    style={{height:40,
                          width:Metrics.screenWidth - 40,
                          borderRadius:2,
                          borderWidth:1,
                          borderColor:'#8A8A8A', 
                          alignItems:'center',
                          justifyContent: 'flex-start'}}>
                        <View style={{flex:1,
                                      alignItems:'center',
                                      justifyContent: 'center'}}>
                          <Text style={{fontSize:15, color:'#333333'}}>
                            Sign Up with Email
                          </Text>
                        </View>
                  </TouchableOpacity>          
              </View>
              <View style={{flex:1,
                  width:Metrics.screenWidth - 40,
                  alignItems:'center',
                  justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={this.onClickFaceBookLogin.bind(this)} 
                    style={{height:40,
                          width:Metrics.screenWidth - 40,
                          borderRadius:2,
                          borderWidth:1,
                          borderColor:'#8A8A8A', 
                          alignItems:'center',
                          justifyContent: 'flex-start'}}>
                        <View style={{flex:1,
                                      alignItems:'center',
                                      justifyContent: 'center'}}>
                          <Text style={{fontSize:15, color:'#333333'}}>
                            Login
                          </Text>
                        </View>
                  </TouchableOpacity>          
              </View>
              <View style={{flex:1,
                  width:Metrics.screenWidth - 40,
                  alignItems:'center',
                  justifyContent: 'center'}}>
              </View>
              <View style={{flex:1,
                  width:Metrics.screenWidth - 40,
                  alignItems:'center',
                  justifyContent: 'center'}}>
                <Text style={{fontSize:12, color:'#8A8A8A', textAlign:'center'}}>
                  By signup you agree to our Team of Use and Privacy Policy.
                </Text>
              </View>
              
          </View>
                
      </View>
    );
  }



}

SignUpView.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  replaceRoute: React.PropTypes.func.isRequired,
  setSpinnerVisible: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    replaceRoute: route => dispatch(replaceRoute(route)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    setSelectedProperty : selectedProperty => dispatch(setSelectedProperty(selectedProperty)),
    
  };
}

function mapStateToProps(state) {
  const globals = state.get('globals');
  const algolia = state.get('algolia');
  
  return { globals, algolia };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpView);