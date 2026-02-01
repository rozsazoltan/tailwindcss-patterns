import plugin from 'tailwindcss/plugin';
import heroPatterns from './patterns.js';

export default plugin(
  ({ addUtilities, theme }) => {
    const allowedShades = theme('heroPatternsShades', []);
    const allowedColors = theme('heroPatternsColors', []);
    const allowedOpacities = theme('heroPatternsOpacities', ['10', '50', '90']);

    const patterns = theme('heroPatterns', {});
    const colors = theme('colors', {});
    const opacity = Object.fromEntries(
      Object.entries(theme('opacity', {})).filter(
        ([key]) => !allowedOpacities.length || allowedOpacities.includes(key)
      )
    );

    // Flatten colors
    const flattenColors = {};
    for (const [name, color] of Object.entries(colors)) {
      if (typeof color === 'object') {
        for (const [shade, value] of Object.entries(color)) {
          if (allowedShades.length && !allowedShades.includes(shade)) continue;
          if (allowedColors.length && !allowedColors.includes(name)) continue;

          const suffix = shade === 'default' ? '' : `-${shade}`;
          flattenColors[`${name}${suffix}`] = value;
        }
      } else {
        flattenColors[name] = color;
      }
    }

    const newUtilities = {};
    for (const [patternName, pattern] of Object.entries(patterns)) {
      for (const [colorName, color] of Object.entries(flattenColors)) {
        const encodedColor = color.toString().replace('#', '%23');
        const coloredPattern = pattern.replace('{{color}}', encodedColor);

        newUtilities[`.heropattern-${patternName}-${colorName}`] = {
          backgroundImage: coloredPattern.replace('{{opacity}}', 1),
        };

        for (const [opacityName, opacityValue] of Object.entries(opacity)) {
          newUtilities[
            `.heropattern-${patternName}-${colorName}\\/${opacityName}`
          ] = {
            backgroundImage: coloredPattern.replace(
              '{{opacity}}',
              opacityValue
            ),
          };
        }
      }
    }

    addUtilities(newUtilities);
  },
  {
    theme: {
      heroPatterns,
    },
  }
);
