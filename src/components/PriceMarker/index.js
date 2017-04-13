import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

const propTypes = {
  amount: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
  data: PropTypes.object,
  IsSelect: PropTypes.bool,
};

const defaultProps = {
  fontSize: 13,
};


class PriceMarker extends React.Component {

  onClick() {
    console.log("PriceMarker");
    // this.props.selected(this.props.data);
  }

  render() {
    const { fontSize, amount, selected, data, IsSelect } = this.props;
// console.log("PriceMarker")    
// console.log(amount)    
    return (
          <View style={styles.container}>
            <View style={IsSelect ? styles.bubbleSelected : styles.bubble}>
              <Text style={[styles.amount, { fontSize }]}>{amount}</Text>
            </View>
            <View style={IsSelect ? styles.arrowBorderSelected : styles.arrowBorder} />
            <View style={IsSelect ? styles.arrowSelected : styles.arrow} />
          </View>
    );
  }
}

PriceMarker.propTypes = propTypes;
PriceMarker.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  dollar: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  arrowSelected: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorderSelected: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5,
  },
  bubbleSelected: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#D23F44',
    padding: 2,
    borderRadius: 3,
    borderColor: '#D23F44',
    borderWidth: 0.5,
  },

  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#609060',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#609060',
    alignSelf: 'center',
    marginTop: -0.5,
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#609060',
    padding: 2,
    borderRadius: 3,
    borderColor: '#609060',
    borderWidth: 0.5,
  },
  
});

module.exports = PriceMarker;
