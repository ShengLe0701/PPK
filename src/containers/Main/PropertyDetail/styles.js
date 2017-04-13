import { Platform, StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  mainBody: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width:Metrics.screenWidth,
    height:Metrics.screenHeight-Metrics.navBarHeight-Metrics.tabHeight,
  },

  textInputStyle: {
    ...Fonts.style.textInput,
    width: Metrics.buttonWidth - 20,
    height: Metrics.buttonHeight,
    alignSelf: 'center',
    textAlign: 'left',
    color: Colors.textPrimary,
  },
  
});
