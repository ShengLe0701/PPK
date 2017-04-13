import React, { Component } from 'react';
import { BackAndroid, Platform, StatusBar, View, Navigator, 
         NativeModules, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';

import { popRoute } from '@actions/route';

import Splash from '@containers/Splash';
import Intro from '@containers/Intro';
import Login from '@containers/Authentication/Login';
import Register from '@containers/Authentication/Register';
import ForgotPassword from '@containers/Authentication/ForgotPassword';

import Main from '@containers/Main';
import Filter from '@containers/Main/Filter';
import Search from '@containers/Main/Search';
import PropertyDetail from '@containers/Main/PropertyDetail';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { Styles, Colors, Fonts, Metrics } from '@theme/';

import { setMapRegion } from '@actions/algolia';



Navigator.prototype.replaceWithAnimation = function (route) {
  const activeLength = this.state.presentedIndex + 1;
  const activeStack = this.state.routeStack.slice(0, activeLength);
  const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
  const nextStack = activeStack.concat([route]);
  const destIndex = nextStack.length - 1;
  const nextSceneConfig = this.props.configureScene(route, nextStack);
  const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);

  const replacedStack = activeStack.slice(0, activeLength - 1).concat([route]);
  this._emitWillFocus(nextStack[destIndex]);
  this.setState({
    routeStack: nextStack,
    sceneConfigStack: nextAnimationConfigStack,
  }, () => {
    this._enableScene(destIndex);
    this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity, null, () => {
      this.immediatelyResetRouteStack(replacedStack);
    });
  });
};

export var globalNav = {};
class AppNavigator extends Component {
  componentWillMount() {
  }

  componentDidMount() {
    globalNav.navigator = this._navigator;

    BackAndroid.addEventListener('hardwareBackPress', () => {
      const routes = this._navigator.getCurrentRoutes();

      if (routes[routes.length - 1].id === 'login') {
        return false;
      }
      this.popRoute();
      return true;
    });

    this.setCurrentPosition();
  }

  setCurrentPosition() {
    if (Platform.OS === 'ios') {
      NativeModules.RNLocation.requestAlwaysAuthorization();
      NativeModules.RNLocation.startUpdatingLocation();
      NativeModules.RNLocation.setDistanceFilter(5.0);
      DeviceEventEmitter.addListener('locationUpdated', (location) => {
        const locationMe = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: (0.1 * Metrics.screenWidth) / Metrics.screenHeight,
        };

        this.props.setMapRegion(locationMe);
      });
    } else {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: '<h6>Use Location?</h6>This app wants to change your device settings.',
        ok: 'YES',
        cancel: 'NO',
      }).then((success) => {
        this.watchID = navigator.geolocation.watchPosition((position) => {
          const locationMe = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: (0.1 * Metrics.screenWidth) / Metrics.screenHeight,
          };

          this.props.setMapRegion(locationMe);
        },
        (error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }  

  popRoute() {
    this.props.popRoute();
  }

  renderScene(route, navigator) {
    switch (route.id) {
      case 'splash':
        return <Splash navigator={navigator} {...route.passProps} />;
      case 'intro':
        return <Intro navigator={navigator} {...route.passProps} />;
      case 'login':
        return <Login navigator={navigator} {...route.passProps} />;
      case 'register':
        return <Register navigator={navigator} {...route.passProps} />;
      case 'forgotpwd':
        return <ForgotPassword navigator={navigator} {...route.passProps} />;
      case 'main':
        return <Main navigator={navigator} {...route.passProps} />;
      case 'search':
        return <Search navigator={navigator} {...route.passProps} />;
      case 'filter':
        return <Filter navigator={navigator} {...route.passProps} />;
      case 'propertydetail':
        return <PropertyDetail navigator={navigator} {...route.passProps} />;
      default :
        return <Login navigator={navigator} {...route.passProps} />;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Navigator
          ref={(ref) => { this._navigator = ref; }}
          configureScene={(route) => {
            const id = route.id;
            if(id === 'splash' || id === 'login' || id === 'register'  || id === 'search'){
              return Navigator.SceneConfigs.FadeAndroid;
            }
            else if( id === 'filter' || id == 'propertydetail') {
              return Navigator.SceneConfigs.FloatFromBottom;              
            }
            else
              return Navigator.SceneConfigs.PushFromRight;
          }}
          initialRoute={{ id: 'splash' }}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  }
}
AppNavigator.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  popRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    setMapRegion: mapRegion => dispatch(setMapRegion(mapRegion)),
  };
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
