import SharedTheme from './shared';

const light = {
  ...SharedTheme,
  colors: {
    ...SharedTheme.colors,
    themePrimary: '#FFFFFF',
  },
  scale: SharedTheme.scale,
};

export default light;
