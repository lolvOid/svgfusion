// Converted from Vitest to Jest
import { formatComponentName, svgToComponentName } from '../src/utils/name';

describe('formatComponentName', () => {
  it('should format basic names to PascalCase', () => {
    expect(formatComponentName('icon')).toBe('Icon');
    expect(formatComponentName('star')).toBe('Star');
    expect(formatComponentName('user-profile')).toBe('UserProfile');
  });

  it('should handle names with hyphens', () => {
    expect(formatComponentName('user-profile-avatar')).toBe(
      'UserProfileAvatar'
    );
    expect(formatComponentName('icon-star')).toBe('IconStar');
  });

  it('should handle names with underscores', () => {
    expect(formatComponentName('user_profile_avatar')).toBe(
      'UserProfileAvatar'
    );
    expect(formatComponentName('icon_star')).toBe('IconStar');
  });

  it('should handle names with spaces', () => {
    expect(formatComponentName('user profile avatar')).toBe(
      'UserProfileAvatar'
    );
    expect(formatComponentName('icon star')).toBe('IconStar');
  });

  it('should handle mixed separators', () => {
    expect(formatComponentName('user-profile_avatar icon')).toBe(
      'UserProfileAvatarIcon'
    );
  });

  it('should handle names with numbers', () => {
    expect(formatComponentName('icon-24')).toBe('Icon24');
    expect(formatComponentName('button-2xl')).toBe('Button2xl');
  });

  it('should handle empty strings', () => {
    expect(formatComponentName('')).toBe('');
  });

  it('should handle single character', () => {
    expect(formatComponentName('a')).toBe('A');
  });

  it('should handle already PascalCase names', () => {
    expect(formatComponentName('IconStar')).toBe('Iconstar');
    expect(formatComponentName('UserProfile')).toBe('Userprofile');
  });
});

describe('svgToComponentName', () => {
  it('should convert basic SVG filenames', () => {
    expect(svgToComponentName('icon.svg')).toBe('Icon');
    expect(svgToComponentName('star.svg')).toBe('Star');
  });

  it('should handle complex filenames', () => {
    expect(svgToComponentName('user-profile-avatar.svg')).toBe(
      'UserProfileAvatar'
    );
    expect(svgToComponentName('icon_star.svg')).toBe('IconStar');
  });

  it('should handle design system metadata', () => {
    expect(svgToComponentName('MP3, Type=Solid.svg')).toBe('Mp3Solid');
    expect(svgToComponentName('Size=xl, Color=Brand, Type=Glass.svg')).toBe(
      'GlassBrandXl'
    );
  });

  it('should handle filenames without extension', () => {
    expect(svgToComponentName('icon-star')).toBe('IconStar');
    expect(svgToComponentName('user-profile')).toBe('UserProfile');
  });

  it('should handle paths', () => {
    expect(svgToComponentName('/path/to/icon.svg')).toBe('PathToIcon');
    expect(svgToComponentName('icons/star.svg')).toBe('IconsStar');
  });

  it('should handle uppercase extensions', () => {
    expect(svgToComponentName('icon.SVG')).toBe('Icon');
    expect(svgToComponentName('star.Svg')).toBe('Star');
  });

  it('should handle special characters', () => {
    expect(svgToComponentName('icon@2x.svg')).toBe('Icon2x');
    expect(svgToComponentName('user+profile.svg')).toBe('UserProfile');
  });

  it('should handle empty strings', () => {
    expect(svgToComponentName('')).toBe('');
  });
});
