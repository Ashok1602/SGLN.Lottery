import React, {PureComponent} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import PropTypes from 'prop-types';
import {SCREEN_WIDTH} from '../../styles/StyleConstant';

class Circle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animatedHeight: new Animated.Value(0),
      animatedWidth: new Animated.Value(0),
    };
    this.setWidthHeight = this.setWidthHeight.bind(this);
  }

  static propTypes = {
    active: PropTypes.bool,
    circleStyle: PropTypes.object,
  };

  static defaultProps = {
    active: false,
    circleStyle: {
      fillColor: '#279315',
    },
  };

  setWidthHeight(event) {
    const active = this.props.active;
    const height = event.nativeEvent.layout.height;
    const width = event.nativeEvent.layout.width;
    Animated.parallel([
      Animated.timing(this.state.animatedHeight, {
        toValue: active ? height - 6 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animatedWidth, {
        toValue: active ? width - 6 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }

  render() {
    const {circleStyle} = this.props;
    return (
      <View
        key={this.props.active}
        style={[styles.circle, circleStyle]}
        onLayout={this.setWidthHeight}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: circleStyle.fillColor,
              height: this.props.active ? SCREEN_WIDTH * 0.031 : 0,
              width: this.props.active ? SCREEN_WIDTH * 0.031 : 0,
            },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderRadius: 15,
    borderColor: '#000',
    backgroundColor: 'white',
    borderWidth: 0.5,
    height: SCREEN_WIDTH * 0.043,
    justifyContent: 'center',
    marginRight: 10,
    width: SCREEN_WIDTH * 0.043,
  },
  fill: {
    borderRadius: 20,
    backgroundColor: '#279315',
  },
});

export default Circle;
