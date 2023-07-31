/* eslint-disable prettier/prettier */
import Toast from 'react-native-toast-message';

export const showToast = (headingText, position, type, visibleTime) => {
  Toast.show({
    autoHide: true,
    bottomOffset: 100,
    type: type, //'success | error | info',
    position: position, //'top | bottom',
    props: {}, // any custom props passed to the Toast component
    text1: headingText,
    topOffset: 30,
    //     text2: ,
    visibilityTime: visibleTime,
  });
};
