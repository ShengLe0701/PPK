import React from 'react';
import {
  Platform,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from 'react-native-i18n';
import { MKButton } from 'react-native-material-kit';

import { Metrics, Styles, Icons, Colors, Fonts, Images } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';

const CommonWidgets = {
  renderStatusBar(color) {
    return (
      <StatusBar
        backgroundColor={color}
        barStyle={'light-content'}
        translucent
      />
    );
  },
  renderNavBarHeader(headerText) {
    return (
      <View style={Styles.center}>
        <Text
          style={[Fonts.style.h4,
            { textAlign: 'center',
              width: Metrics.screenWidth * 0.7,
              color: Colors.textPrimary }]}
          numberOfLines={1}>
          {headerText}
        </Text>
      </View>
    );
  },
  renderSpacer(cnt) {
    return (
      <View style={{ height: (Metrics.screenHeight / 40) * cnt }} />
    );
  },
  renderCloseButton(onPress) {
    return (
      <TouchableOpacity
        style={{ position: 'absolute', left: 20, top: Platform.OS === 'android' ? 25 : 30 }}
        onPress={onPress}>
        <Icon name="md-close" size={30} color={Colors.textPrimary} />
      </TouchableOpacity>
    );
  },
  renderNavBarBackButton(onPress) {
    return (
      <TouchableOpacity
        style={{ paddingBottom: Platform.OS === 'android' ? 5 : 3 }}
        onPress={onPress} >
        <Icon name="ios-arrow-back" size={30} color={Colors.textPrimary} />
      </TouchableOpacity>
    );
  },
  
}



export default CommonWidgets;

