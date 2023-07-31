import {Dimensions} from 'react-native';

export const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height);
export const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

export const FONTS = {
  // font nameConstant key : font name in string
  Montserrat_Bold: 'Montserrat-Bold',
  Montserrat_Medium: 'Montserrat-Medium',
  Montserrat_Regular: 'Montserrat-Regular',
  Montserrat_SemiBold: 'Montserrat-SemiBold',
  Montserrat_Italic: 'Montserrat-Italic',
  OpenSans_Bold: 'OpenSans-Bold',
  OpenSans_Regular: 'OpenSans-Regular',
  OpenSans_SemiBold: 'OpenSans-SemiBold',
};
