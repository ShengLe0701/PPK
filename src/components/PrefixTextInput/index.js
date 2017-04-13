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

const styles = StyleSheet.create({
    textInputStyle: {
      ...Fonts.style.textInput,
      width: Metrics.buttonWidth - 20,
      height: Metrics.buttonHeight,
      alignSelf: 'center',
      textAlign: 'left',
      color: Colors.textPrimary,
    },    
});

export default class PrefixTextInput extends React.Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    keyboardType : PropTypes.string,
    width: PropTypes.number, 
    height: PropTypes.number, 
    borderColor: PropTypes.string, 
    fontColor: PropTypes.string,
    prefixValue:PropTypes.string,
    isPrefix:PropTypes.bool,
  }

  static defaultProps = {
    onChangeText: () => {},    
    defaultValue: "",   
  }

  constructor(props) {
    super(props);

    this.state={
      value : 0,
    }
  }

  componentWillMount() {
  }

  render() {

    return (
      <View style={{flexDirection:'row',
                    width:this.props.width,           
                    height:this.props.height,
                    borderColor:this.props.borderColor,
                    borderWidth:1,
                    justifyContent: 'center'}}>
        {
          this.props.isPrefix && (
              <View style={{width:this.props.height, 
                            height:this.props.height-2,
                            justifyContent: 'center',
                            alignItems:'center',
                            backgroundColor:this.props.borderColor}}>
                  <Text style={{fontSize:this.props.height * 0.6,
                                textAlign:'center',
                                alignSelf:'center',
                                color:this.props.fontColor}}>
                    {this.props.prefixValue}  
                  </Text>
              </View>
          )
        }
        <TextInput
            style={{width:this.props.width - this.props.height - 10,
                    height:this.props.height,
                    marginHorizontal:5}}
            underlineColorAndroid={'transparent'}
            multiline={false}
            onChangeText={this.props.onChangeText}
            keyboardType={this.props.keyboardType}
            returnKeyType={'next'}
            defaultValue={this.props.defaultValue}
            value={this.props.value}
        />
        {
          !this.props.isPrefix && (
              <View style={{width:this.props.height, 
                            height:this.props.height-2,
                            justifyContent: 'center',
                            alignItems:'center',
                            backgroundColor:this.props.borderColor}}>
                  <Text style={{fontSize:this.props.height * 0.6,
                                textAlign:'center',
                                alignSelf:'center',
                                color:this.props.fontColor}}>
                    {this.props.prefixValue}  
                  </Text>
              </View>
          )
        }
      </View>
    );
  }
}