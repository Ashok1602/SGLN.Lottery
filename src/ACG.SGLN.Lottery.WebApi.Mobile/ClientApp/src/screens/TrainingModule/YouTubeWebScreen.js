/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {useTheme} from '@react-navigation/native';

import {SCREEN_WIDTH} from '../../styles/StyleConstant';

const YouTubeWebScreen = props => {
  console.log(props.route.params.data + 'youtube url');
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={{flex: 1}}>
      <WebView source={{uri: props.route.params.data}} />
    </View>
  );
};

export default YouTubeWebScreen;

const useStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    threeAboveSectionTouch: {
      flex: 1,
      height: SCREEN_WIDTH * 0.29,
      paddingVertical: 10,
      width: SCREEN_WIDTH * 0.29,
      marginRight: SCREEN_WIDTH * 0.02,
    },
  });
