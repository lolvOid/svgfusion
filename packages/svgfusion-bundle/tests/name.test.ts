import { formatComponentName, svgToComponentName } from 'svgfusion-utils';

describe('formatComponentName', () => {
  const sanitizeCases = [
    { name: 'icon', prefix: 'We-', suffix: '$2', expected: 'WeIcon2' },
    { name: 'icon', prefix: '$$', suffix: '!!!', expected: 'Icon' },
    { name: 'WeatherIcon', prefix: '', suffix: '', expected: 'WeatherIcon' },
    {
      name: 'icon',
      prefix: 'My$',
      suffix: 'Widget!',
      expected: 'MyIconWidget',
    },
    { name: 'icon', prefix: '123$', suffix: '456!', expected: 'Icon456' },
    { name: 'icon', prefix: ' ', suffix: ' ', expected: 'Icon' },
    { name: 'icon', prefix: undefined, suffix: undefined, expected: 'Icon' },
    {
      name: 'icon',
      prefix: 'Icon',
      suffix: 'Svg2a',
      expected: 'IconIconSvg2A',
    },
    {
      name: 'newIcon',
      prefix: 'my',
      suffix: 'Widget',
      expected: 'MyNewIconWidget',
    },
    { name: 'icon', prefix: '', suffix: 'Widget3B', expected: 'IconWidget3B' },
    { name: 'icon', prefix: 'My', suffix: '', expected: 'MyIcon' },
    { name: 'icon', prefix: '', suffix: '', expected: 'Icon' },
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
    { name: 'button-2xl', expected: 'Button2Xl' },
    { name: '', expected: '' },
    { name: 'a', expected: 'A' },
    { name: 'IconStar', expected: 'IconStar' },
    { name: 'UserProfile', expected: 'UserProfile' },

    // Additional edge cases for formatComponentName
    // Unicode handling
    { name: 'café', expected: 'Caf' },
    { name: 'naïve', expected: 'NaVe' },
    { name: 'piñata', expected: 'PiAta' },
    { name: 'Pokémon', expected: 'PokMon' },

    // Complex mixed separators
    { name: 'icon___with___underscores', expected: 'IconWithUnderscores' },
    { name: 'button---with---dashes', expected: 'ButtonWithDashes' },
    { name: 'mixed_-_separators', expected: 'MixedSeparators' },
    { name: 'dots.and.more.dots', expected: 'DotsAndMoreDots' },

    // Whitespace edge cases
    { name: '   whitespace   everywhere   ', expected: 'WhitespaceEverywhere' },
    { name: '\t\ttabs\t\tbetween\t\t', expected: 'TabsBetween' },
    { name: '\n\nnewlines\n\nbetween\n\n', expected: 'NewlinesBetween' },

    // Number sequences
    { name: '123-456-789', expected: '' },
    { name: 'version-123-456', expected: 'Version123456' },
    { name: '1a2b3c', expected: 'A2b3C' },
    { name: '42answer', expected: 'Answer' },

    // Special character combinations
    { name: 'icon!@#$%^&*()', expected: 'Icon' },
    { name: '{}[]|\\:";\'<>?', expected: '' },
    { name: 'hello~world`test', expected: 'HelloWorldTest' },
    { name: 'plus+minus-equals=', expected: 'PlusMinusEquals' },

    // Technology abbreviations (following Microsoft .NET Framework Design Guidelines)
    { name: 'XMLHttpRequest', expected: 'XmlHttpRequest' },
    { name: 'JSONParser', expected: 'JsonParser' },
    { name: 'SQLDatabase', expected: 'SqlDatabase' },
    { name: 'HTMLElement', expected: 'HtmlElement' },
    { name: 'CSSStyleSheet', expected: 'CssStyleSheet' },
    { name: 'XMLDocument', expected: 'XmlDocument' },

    // Camel and Pascal case variations (following Microsoft .NET Framework Design Guidelines)
    { name: 'getUserData', expected: 'GetUserData' },
    { name: 'fetchAPIResponse', expected: 'FetchApiResponse' },
    { name: 'parseJSONData', expected: 'ParseJsonData' },
    { name: 'validateHTMLInput', expected: 'ValidateHtmlInput' },
    { name: 'generateUUIDString', expected: 'GenerateUuidString' },

    // Business domain terms (following Microsoft .NET Framework Design Guidelines)
    { name: 'eCommerce', expected: 'ECommerce' },
    { name: 'eBusiness', expected: 'EBusiness' },
    { name: 'iPhone', expected: 'IPhone' },
    { name: 'iPad', expected: 'IPad' },
    { name: 'macOS', expected: 'MacOs' },
    { name: 'iOS', expected: 'Ios' },

    // File naming patterns
    { name: 'component.test', expected: 'ComponentTest' },
    { name: 'service.mock', expected: 'ServiceMock' },
    { name: 'utils.helper', expected: 'UtilsHelper' },
    { name: 'config.dev', expected: 'ConfigDev' },
    { name: 'build.prod', expected: 'BuildProd' },

    // Measurement and size indicators
    { name: '16x16', expected: 'X16' },
    { name: '1920x1080', expected: 'X1080' },
    { name: '300dpi', expected: 'Dpi' },
    { name: '72ppi', expected: 'Ppi' },
    { name: '4k-resolution', expected: 'KResolution' },

    // Version and date patterns
    { name: 'v1-2-3', expected: 'V123' },
    { name: 'version-2023-12-25', expected: 'Version20231225' },
    { name: 'backup-20231225', expected: 'Backup20231225' },
    { name: 'release-candidate-1', expected: 'ReleaseCandidate1' },

    // Single character edge cases
    { name: 'x', expected: 'X' },
    { name: 'X', expected: 'X' },
    { name: '9', expected: '' },
    { name: '_', expected: '' },
    { name: '-', expected: '' },
    { name: '.', expected: '' },

    // Duplicate word patterns
    { name: 'test-test-test', expected: 'TestTestTest' },
    { name: 'icon_icon_icon', expected: 'IconIconIcon' },
    { name: 'data data data', expected: 'DataDataData' },
    {
      name: 'component.component.component',
      expected: 'ComponentComponentComponent',
    },
    {
      name: 'flagUS',
      expected: 'FlagUs',
    },
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
    { name: 'icon', prefix: '123$', suffix: '456!', expected: 'Icon456' },
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
  // Test cases with prefix and suffix
  const prefixSuffixCases = [
    {
      name: 'icon.svg',
      prefix: 'My',
      suffix: 'Component',
      expected: 'MyIconComponent',
    },
    { name: 'star.svg', prefix: 'UI', suffix: 'Icon', expected: 'UIStarIcon' },
    {
      name: 'user-profile.svg',
      prefix: 'App',
      suffix: 'Widget',
      expected: 'AppUserProfileWidget',
    },
    {
      name: 'menu.svg',
      prefix: 'Header',
      suffix: undefined,
      expected: 'HeaderMenu',
    },
    {
      name: 'logo.svg',
      prefix: undefined,
      suffix: 'Brand',
      expected: 'LogoBrand',
    },
    {
      name: 'button.svg',
      prefix: 'Custom',
      suffix: 'Element',
      expected: 'CustomButtonElement',
    },

    // Edge cases with prefix/suffix sanitization
    {
      name: 'icon.svg',
      prefix: 'My$',
      suffix: 'Widget!',
      expected: 'MyIconWidget',
    },
    { name: 'star.svg', prefix: '123', suffix: 'Icon', expected: 'StarIcon' },
    {
      name: 'menu.svg',
      prefix: 'Nav-',
      suffix: '$Item',
      expected: 'NavMenuItem',
    },
    {
      name: 'logo.svg',
      prefix: '!@#',
      suffix: 'Brand456',
      expected: 'LogoBrand456',
    },

    // Complex filenames with prefix/suffix
    {
      name: 'MP3, Type=Solid.svg',
      prefix: 'Audio',
      suffix: 'Icon',
      expected: 'AudioMp3TypeSolidIcon',
    },
    {
      name: 'Size=xl, Color=Brand.svg',
      prefix: 'UI',
      suffix: 'Component',
      expected: 'UISizeXlColorBrandComponent',
    },
    {
      name: 'user-profile-avatar.svg',
      prefix: 'Person',
      suffix: 'Image',
      expected: 'PersonUserProfileAvatarImage',
    },

    // Unicode with prefix/suffix
    {
      name: 'café-icon.svg',
      prefix: 'Coffee',
      suffix: 'Symbol',
      expected: 'CoffeeCafIconSymbol',
    },
    {
      name: 'naïve-user.svg',
      prefix: 'Simple',
      suffix: 'Avatar',
      expected: 'SimpleNaVeUserAvatar',
    },
    {
      name: 'résumé-template.svg',
      prefix: 'Document',
      suffix: 'Design',
      expected: 'DocumentRSumTemplateDesign',
    },
    // Mixed separators with prefix/suffix
    {
      name: 'icon_with-mixed.separators__here.svg',
      prefix: 'Mixed',
      suffix: 'Example',
      expected: 'MixedIconWithMixedSeparatorsHereExample',
    },
    {
      name: 'complex___file---name...with.dots.svg',
      prefix: 'Complex',
      suffix: 'Demo',
      expected: 'ComplexComplexFileNameWithDotsDemo',
    },
    {
      name: 'icon-24.svg',
      prefix: 'App',
      suffix: 'Icon',
      expected: 'AppIcon24Icon',
    },
    {
      name: 'button-2xl.svg',
      prefix: 'Custom',
      suffix: 'Size',
      expected: 'CustomButton2XlSize',
    },
    // Technology names with prefix/suffix
    {
      name: 'React-component.svg',
      prefix: 'Framework',
      suffix: 'Demo',
      expected: 'FrameworkReactComponentDemo',
    },
    {
      name: 'Vue.js-template.svg',
      prefix: 'Modern',
      suffix: 'Code',
      expected: 'ModernVueJsTemplateCode',
    },
    {
      name: 'Node.js-server.svg',
      prefix: 'Backend',
      suffix: 'Service',
      expected: 'BackendNodeJsServerService',
    },

    // Empty and edge cases
    {
      name: '123.svg',
      prefix: 'Number',
      suffix: 'Icon',
      expected: 'Number123Icon',
    },
    {
      name: '456-789.svg',
      prefix: 'Code',
      suffix: 'Symbol',
      expected: 'Code456789Symbol',
    },
    { name: '.svg', prefix: 'Dot', suffix: 'File', expected: 'DotFile' },
    {
      name: '!@#.svg',
      prefix: 'Special',
      suffix: 'Char',
      expected: 'SpecialChar',
    },

    // Very long names with prefix/suffix
    {
      name: 'very-long-component-name.svg',
      prefix: 'Super',
      suffix: 'Widget',
      expected: 'SuperVeryLongComponentNameWidget',
    },

    // Path handling with prefix/suffix
    {
      name: 'src/icons/menu.svg',
      prefix: 'App',
      suffix: 'Icon',
      expected: 'AppSrcIconsMenuIcon',
    },
    {
      name: '../shared/star.svg',
      prefix: 'Common',
      suffix: 'Element',
      expected: 'CommonSharedStarElement',
    },
    {
      name: 'US',
      prefix: 'Flag',
      suffix: '',
      expected: 'FlagUs',
    },
    {
      name: 'CSV, Type=Solid.svg',
      prefix: 'mnkt-file-type-document',
      suffix: '',
      expected: 'MnktFileTypeDocumentCsvTypeSolid',
    },
  ];

  prefixSuffixCases.forEach(({ name, prefix, suffix, expected }) => {
    it(`should convert '${name}' with prefix '${prefix}' and suffix '${suffix}' to '${expected}' and match snapshot`, () => {
      const result = svgToComponentName(name, prefix, suffix);
      expect(result).toBe(expected);
      expect(result).toMatchSnapshot();
    });
  });

  // Test cases without prefix/suffix (existing functionality)
  const cases = [
    { name: 'icon.svg', expected: 'Icon' },
    { name: 'star.svg', expected: 'Star' },
    { name: 'user-profile-avatar.svg', expected: 'UserProfileAvatar' },
    { name: 'icon_star.svg', expected: 'IconStar' },
    { name: 'MP3, Type=Solid.svg', expected: 'Mp3TypeSolid' },
    { name: '3icon.svg', expected: 'Icon' },
    { name: 'flagUS.svg', expected: 'FlagUs' },
    {
      name: 'Magic,Type=filled,Color=secondary.svg',
      expected: 'MagicTypeFilledColorSecondary',
    },
    {
      name: 'PreIcon',
      expected: 'PreIcon',
    },
    {
      name: 'Magic,Type=filled,Color=secondary.svg',
      expected: 'MagicTypeFilledColorSecondary',
    },
    {
      name: 'Size=xl, Color=Brand, Type=Glass.svg',
      expected: 'SizeXlColorBrandTypeGlass',
    },
    { name: 'icon-24.svg', expected: 'Icon24' },
    { name: 'button-2xl.svg', expected: 'Button2Xl' },
    { name: 'WeatherIcon.svg', expected: 'WeatherIcon' },
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
    { name: 'icon@2x.svg', expected: 'Icon2X' },
    { name: 'user+profile.svg', expected: 'UserProfile' },
    { name: '', expected: '' },

    // Additional edge cases
    // Unicode and international characters
    { name: 'café-icon.svg', expected: 'CafIcon' },
    { name: 'naïve-user.svg', expected: 'NaVeUser' },
    { name: 'résumé-template.svg', expected: 'RSumTemplate' },

    // Very long filenames
    {
      name: 'very-very-very-long-component-name-that-exceeds-normal-limits-and-continues-even-further.svg',
      expected:
        'VeryVeryVeryLongComponentNameThatExceedsNormalLimitsAndContinuesEvenFurther',
    },

    // Mixed separators
    {
      name: 'icon_with-mixed.separators__here.svg',
      expected: 'IconWithMixedSeparatorsHere',
    },
    {
      name: 'complex___file---name...with.dots.svg',
      expected: 'ComplexFileNameWithDots',
    },

    // Numbers in different positions
    { name: '123-456-789.svg', expected: '' },
    { name: 'icon123star456.svg', expected: 'Icon123Star456' },
    { name: 'v2-icon-v3.svg', expected: 'V2IconV3' },
    { name: '2FA-icon.svg', expected: 'FAIcon' },
    { name: 'icon-v2.0.1.svg', expected: 'IconV201' },

    // Special symbols and characters
    { name: 'icon!@#$%^&*()[]{}|\\:";\'<>,.?/~`+=.svg', expected: 'Icon' },
    { name: '♠♣♥♦-cards.svg', expected: 'Cards' },
    { name: '★★★-rating.svg', expected: 'Rating' },
    { name: '🎉-celebration.svg', expected: 'Celebration' },

    // Whitespace variations
    { name: '   icon   .svg', expected: 'Icon' },
    { name: '\t\ticon\t\t.svg', expected: 'Icon' },
    { name: '\n\nicon\n\n.svg', expected: 'Icon' },
    { name: '   spaced   out   icon   .svg', expected: 'SpacedOutIcon' },

    // CamelCase and PascalCase preservation
    { name: 'XMLHttpRequest.svg', expected: 'XmlHttpRequest' },
    { name: 'iOS-icon.svg', expected: 'IOsIcon' },
    { name: 'API-endpoint.svg', expected: 'ApiEndpoint' },
    { name: 'SQL-database.svg', expected: 'SqlDatabase' },
    { name: 'iPhone-mockup.svg', expected: 'IPhoneMockup' },
    { name: 'macOS-window.svg', expected: 'MacOsWindow' },

    // Abbreviations and acronyms
    { name: 'PDF-viewer.svg', expected: 'PdfViewer' },
    { name: 'HTML-parser.svg', expected: 'HtmlParser' },
    { name: 'CSS-loader.svg', expected: 'CssLoader' },
    { name: 'JSON-formatter.svg', expected: 'JsonFormatter' },
    { name: 'HTTP-client.svg', expected: 'HttpClient' },

    // Mixed case scenarios
    { name: 'myVariableNameHere.svg', expected: 'MyVariableNameHere' },
    { name: 'someAPIEndpoint.svg', expected: 'SomeApiEndpoint' },
    { name: 'getUserIDFromDB.svg', expected: 'GetUserIdFromDb' },

    // Path separators and nested structures
    {
      name: 'src/components/icons/user.svg',
      expected: 'SrcComponentsIconsUser',
    },
    {
      name: 'assets\\images\\icons\\star.svg',
      expected: 'AssetsImagesIconsStar',
    },
    { name: '../../../shared/icons/menu.svg', expected: 'SharedIconsMenu' },
    { name: './local/icon.svg', expected: 'LocalIcon' },

    // Version numbers and timestamps
    { name: 'icon-v1.2.3-beta.svg', expected: 'IconV123Beta' },
    { name: 'logo-2023-12-25.svg', expected: 'Logo20231225' },
    { name: 'backup-20231225-143022.svg', expected: 'Backup20231225143022' },

    // File extensions variations
    { name: 'icon.svg.backup', expected: 'IconSvgBackup' },
    { name: 'icon.SVG.ORIG', expected: 'IconSvgOrig' },
    { name: 'icon.svg.tmp', expected: 'IconSvgTmp' },

    // Edge cases with single characters
    { name: 'a.svg', expected: 'A' },
    { name: 'z.svg', expected: 'Z' },
    { name: '1.svg', expected: '' },
    { name: '_.svg', expected: '' },
    { name: '-.svg', expected: '' },

    // Duplicate patterns
    { name: 'icon-icon-icon.svg', expected: 'IconIconIcon' },
    { name: 'star_star_star.svg', expected: 'StarStarStar' },
    { name: 'user user user.svg', expected: 'UserUserUser' },

    // Business/domain specific patterns
    { name: 'e-commerce-cart.svg', expected: 'ECommerceCart' },
    { name: 'B2B-dashboard.svg', expected: 'B2bDashboard' },
    { name: 'CRM-contact.svg', expected: 'CrmContact' },
    { name: 'SaaS-pricing.svg', expected: 'SaaSPricing' },

    // Technology specific
    { name: 'React-component.svg', expected: 'ReactComponent' },
    { name: 'Vue.js-template.svg', expected: 'VueJsTemplate' },
    { name: 'Next.js-page.svg', expected: 'NextJsPage' },
    { name: 'Node.js-server.svg', expected: 'NodeJsServer' },

    // Size and measurement indicators
    { name: 'icon-16x16.svg', expected: 'Icon16X16' },
    { name: 'logo-1920x1080.svg', expected: 'Logo1920X1080' },
    { name: 'thumbnail-300px.svg', expected: 'Thumbnail300Px' },
    { name: 'banner-full-width.svg', expected: 'BannerFullWidth' },

    {
      name: 'US',
      expected: 'US',
    },
  ];

  cases.forEach(({ name, expected }) => {
    it(`should convert '${name}' to '${expected}' and match snapshot`, () => {
      const result = svgToComponentName(name);
      expect(result).toBe(expected);
      expect(result).toMatchSnapshot();
    });
  });
});
