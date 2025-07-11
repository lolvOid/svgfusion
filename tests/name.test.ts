import { formatComponentName, svgToComponentName } from '../src/utils/name';

describe('formatComponentName', () => {
  const sanitizeCases = [
    { name: 'icon', prefix: 'We-', suffix: '$2', expected: 'WeIcon2' },
    { name: 'icon', prefix: '$$', suffix: '!!!', expected: 'Icon' },
    {
      name: 'icon',
      prefix: 'My$',
      suffix: 'Widget!',
      expected: 'MyIconWidget',
    },
    { name: 'icon', prefix: '123$', suffix: '456!', expected: '123Icon456' },
    { name: 'icon', prefix: ' ', suffix: ' ', expected: 'Icon' },
    { name: 'icon', prefix: undefined, suffix: undefined, expected: 'Icon' },
  ];

  sanitizeCases.forEach(({ name, prefix, suffix, expected }) => {
    it(`should sanitize prefix='${prefix}' and suffix='${suffix}' for '${name}' and match snapshot`, () => {
      const result = formatComponentName(name, prefix, suffix);
      expect(result).toBe(expected);
      expect(result).toMatchSnapshot();
    });
  });

  const addCases = [
    { name: 'star', prefix: 'Icon', suffix: 'Svg', expected: 'IconStarSvg' },
    {
      name: 'user-profile',
      prefix: 'App',
      suffix: 'Component',
      expected: 'AppUserProfileComponent',
    },
    { name: 'icon', prefix: 'My', suffix: undefined, expected: 'MyIcon' },
    {
      name: 'icon',
      prefix: undefined,
      suffix: 'Widget',
      expected: 'IconWidget',
    },
    { name: 'icon', prefix: '', suffix: 'Widget', expected: 'IconWidget' },
    { name: 'icon', prefix: 'My', suffix: '', expected: 'MyIcon' },
    { name: 'icon', prefix: '', suffix: '', expected: 'Icon' },
  ];

  addCases.forEach(({ name, prefix, suffix, expected }) => {
    it(`should add prefix='${prefix}' and suffix='${suffix}' to '${name}' and match snapshot`, () => {
      const result = formatComponentName(name, prefix, suffix);
      expect(result).toBe(expected);
      expect(result).toMatchSnapshot();
    });
  });

  const normalCases = [
    { name: 'icon', expected: 'Icon' },
    { name: 'star', expected: 'Star' },
    { name: 'user-profile', expected: 'UserProfile' },
    { name: 'user-profile-avatar', expected: 'UserProfileAvatar' },
    { name: 'icon-star', expected: 'IconStar' },
    { name: 'user_profile_avatar', expected: 'UserProfileAvatar' },
    { name: 'icon_star', expected: 'IconStar' },
    { name: 'user profile avatar', expected: 'UserProfileAvatar' },
    { name: 'icon star', expected: 'IconStar' },
    { name: 'user-profile_avatar icon', expected: 'UserProfileAvatarIcon' },
    { name: 'icon-24', expected: 'Icon24' },
    { name: 'button-2xl', expected: 'Button2xl' },
    { name: '', expected: '' },
    { name: 'a', expected: 'A' },
    { name: 'IconStar', expected: 'IconStar' },
    { name: 'UserProfile', expected: 'UserProfile' },
  ];

  const negativeCases = [
    { name: 'icon', prefix: 'We-', suffix: '$2', expected: 'WeIcon2' },
    { name: 'icon', prefix: '$$', suffix: '!!!', expected: 'Icon' },
    {
      name: 'icon',
      prefix: 'My$',
      suffix: 'Widget!',
      expected: 'MyIconWidget',
    },
    { name: 'icon', prefix: '123$', suffix: '456!', expected: '123Icon456' },
    { name: 'icon', prefix: ' ', suffix: ' ', expected: 'Icon' },
    { name: 'icon', prefix: undefined, suffix: undefined, expected: 'Icon' },
  ];

  normalCases.forEach(({ name, expected }) => {
    it(`should convert '${name}' to '${expected}' and match snapshot`, () => {
      const result = formatComponentName(name);
      expect(result).toBe(expected);
      expect(result).toMatchSnapshot();
    });
  });

  negativeCases.forEach(({ name, prefix, suffix, expected }) => {
    it(`should sanitize prefix='${prefix}' and suffix='${suffix}' for '${name}' and match snapshot`, () => {
      const result = formatComponentName(name, prefix, suffix);
      expect(result).toBe(expected);
      expect(result).toMatchSnapshot();
    });
  });
});

describe('svgToComponentName', () => {
  const cases = [
    { name: 'icon.svg', expected: 'Icon' },
    { name: 'star.svg', expected: 'Star' },
    { name: 'user-profile-avatar.svg', expected: 'UserProfileAvatar' },
    { name: 'icon_star.svg', expected: 'IconStar' },
    { name: 'MP3, Type=Solid.svg', expected: 'Mp3TypeSolid' },
    {
      name: 'Size=xl, Color=Brand, Type=Glass.svg',
      expected: 'SizeXlColorBrandTypeGlass',
    },
    { name: 'icon-star', expected: 'IconStar' },
    { name: 'user-profile', expected: 'UserProfile' },
    { name: '/path/to/icon.svg', expected: 'PathToIcon' },
    { name: 'icons/star.svg', expected: 'IconsStar' },
    { name: 'icon.SVG', expected: 'Icon' },
    { name: 'star.Svg', expected: 'Star' },
    { name: 'icon@2x.svg', expected: 'Icon2x' },
    { name: 'user+profile.svg', expected: 'UserProfile' },
    { name: '', expected: '' },
  ];

  cases.forEach(({ name, expected }) => {
    it(`should convert '${name}' to '${expected}' and match snapshot`, () => {
      const result = svgToComponentName(name);
      expect(result).toBe(expected);
      expect(result).toMatchSnapshot();
    });
  });
});
