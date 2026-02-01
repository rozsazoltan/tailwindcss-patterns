import plugin from 'tailwindcss/plugin';
import patterns from './patterns.js';

export default plugin(
  ({ matchUtilities, theme }) => {
    const patterns = theme('pattern', {});

    for (const [patternName, patternSvg] of Object.entries(patterns)) {
      matchUtilities(
        {
          [`pattern-${patternName}`]: (value, { modifier }) => {
            const opacityValue = modifier !== null ? modifier : '1';
            const encodedColor = value.toString().replace('#', '%23');

            let coloredPattern = patternSvg.replace('{{color}}', encodedColor);
            coloredPattern = coloredPattern.replace('{{opacity}}', opacityValue);

            return {
              backgroundImage: coloredPattern,
            };
          },
        },
        {
          values: theme('colors'),
          modifiers: theme('opacity'), 
          type: ['color', 'any'], 
        }
      );
    }
  },
  {
    theme: {
      pattern: patterns,
    },
  }
);
