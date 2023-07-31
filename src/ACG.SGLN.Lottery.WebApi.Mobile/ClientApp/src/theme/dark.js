import {DarkTheme} from '@react-navigation/native';
import SharedTheme from './shared';

const dark = {
  ...DarkTheme,
  colors: {
    ...SharedTheme.colors,
    themePrimary: '#243644',
  },
  scale: SharedTheme.scale,
};

export default dark;
