import { formatComponentName, svgToComponentName } from '../src/utils/name';

describe('formatComponentName', () => {
  const cases = [
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

  cases.forEach(({ name, expected }) => {
    it(`should convert '${name}' to '${expected}'`, () => {
      expect(formatComponentName(name)).toBe(expected);
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

  cases.forEach(({ name }) => {
    it(`should convert '${name}' and match snapshot`, () => {
      expect(svgToComponentName(name)).toMatchSnapshot();
    });
  });

  cases.forEach(({ name, expected }) => {
    it(`should convert '${name}' to '${expected}'`, () => {
      expect(svgToComponentName(name)).toBe(expected);
    });
  });
});
