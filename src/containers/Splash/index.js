import { Image, ActivityIndicator } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import settings from 'react-native-simple-store';
import { setTheme } from 'react-native-material-kit';

import { replaceRoute } from '@actions/route';
import { Styles, Images, Colors } from '@theme/';
import CONFIGS from '@src/configs';

import OverlaySpinner from '@components/OverlaySpinner';
import { setSpinnerVisible } from '@actions/globals';


class Splash extends Component {
  constructor(props) {
    super(props);
    setTheme({
      checkboxStyle: {
        fillColor: Colors.brandSecondary,
        borderOnColor: Colors.brandSecondary,
        borderOffColor: Colors.brandSecondary,
        rippleColor: Colors.rippleSecondary,
      },
      radioStyle: {
        fillColor: Colors.brandSecondary,
        borderOnColor: Colors.brandSecondary,
        borderOffColor: Colors.brandSecondary,
        rippleColor: Colors.rippleSecondary,
      },
      primaryColor: Colors.brandSecondary,
      accentColor: 'transparent',
    });
  }
  componentWillMount() {
    
    setTimeout(() => {
      settings.get(CONFIGS.SECOND_RUN).then((secondRun) => {

        if (secondRun === true) {
          this.props.replaceRoute('main');
          // store.get('token').then((token) => {
          //   if (token !== null) {
          //     // this.props.loginSuccess(token);
          //   }
          //   else{
          //   }
          // }).catch((error) => {
          // });
        } else {
          this.props.replaceRoute('main');
          // settings.save(CONFIGS.SECOND_RUN, true).then(() => this.props.replaceRoute('intro'));
        }
        
      });
    }, 2000);
  }

  render() {
    return (
      <Image
        resizeMode={'cover'}
        style={[Styles.fullScreen, 
                {alignItems: 'center',
                 justifyContent: 'center'}]}
        source={Images.bkgSplash} >
        <ActivityIndicator
          style={{
            alignItems: 'center',
            justifyContent: 'center',}}
          size="large"/>
      </Image>
    );
  }
}

Splash.propTypes = {
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
  return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Splash);
