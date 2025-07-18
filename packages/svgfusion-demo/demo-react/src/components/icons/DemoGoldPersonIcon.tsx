import React, { Ref, forwardRef, memo } from 'react';

interface DemoGoldPersonIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
  desc?: string;
  descId?: string;
  size?: string | number;
  color?: string;
  colorClass?: string;
  color2?: string;
  color2Class?: string;
  color3?: string;
  color3Class?: string;
  color4?: string;
  color4Class?: string;
  color5?: string;
  color5Class?: string;
  isFixedStrokeWidth?: boolean;
}

const DemoGoldPersonIcon = (
  {
    title,
    titleId,
    desc,
    descId,
    colorClass,
    color2Class,
    color3Class,
    color4Class,
    color5Class,
    size = '24',
    color = '#843A5F',
    color2 = '#AE9AA4',
    color3 = '#E6D8DF',
    color4 = '#FF9FB9',
    color5 = '#FFFFFF',
    isFixedStrokeWidth = true,
    ...svgProps
  }: DemoGoldPersonIconProps,
  ref: Ref<SVGSVGElement>
) => {
  const computedSize = {
    width: svgProps.width || size,
    height: svgProps.height || size,
  };

  return (
    <svg
      ref={ref}
      viewBox="0 0 1024 1024"
      class="icon"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      {...svgProps}
      {...computedSize}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {desc ? <desc id={descId}>{desc}</desc> : null}
      <path
        d="M512.7 472.2l-43.3 75.1h86.7z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M633.6 174.6H392.9l-73.8 347 194.1 215.7 193.1-214.5 1-1.2z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M512.4 656.8m-214 0a214 214 0 1 0 428 0 214 214 0 1 0-428 0Z"
        fill={color2}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color2Class}
      />
      <path
        d="M512.4 873.8c-58 0-112.5-22.6-153.5-63.6s-63.6-95.5-63.6-153.5 22.6-112.5 63.6-153.5 95.5-63.6 153.5-63.6 112.5 22.6 153.5 63.6 63.6 95.5 63.6 153.5-22.6 112.5-63.6 153.5c-41.1 41-95.6 63.6-153.5 63.6z m0-428c-116.4 0-211 94.7-211 211s94.7 211 211 211c116.4 0 211-94.7 211-211s-94.7-211-211-211z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M512.4 578l-70.5-121.9h140.9z"
        fill={color5}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color5Class}
      />
      <path
        d="M512.4 584l-75.6-131H588l-75.6 131z m-65.3-124.9l65.2 113 65.2-113H447.1zM675.2 185.4l-0.2-0.4c-5.8-18.4-14.7-35.6-26.3-51.1l-0.1-0.2c-5.5-7.3-11.7-14.3-18.4-20.7-19.6-18.8-43.7-32.8-69.7-40.4-15.6-4.6-31.8-6.9-48.2-6.9-14.3 0-28.6 1.8-42.3 5.3-1.8 0.5-3.2 0.8-4.5 1.2-26.8 7.6-51.6 21.9-71.7 41.4-26.8 25.9-44.1 59-49.9 95.6-1.4 8.8-2.1 17.9-2.1 27 0 15.1 2 30 5.9 44.4 2 7.6 4.6 15.1 7.7 22.2 26.8 63.1 88.4 103.8 157 103.8 63.5 0 121.3-34.9 150.9-91 4.3-8 7.9-16.6 10.8-25.3 5.8-17.4 8.8-35.6 8.8-54.1 0-17.3-2.6-34.4-7.7-50.8z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M364.9 294.4a149.1 176.4 0 1 0 298.2 0 149.1 176.4 0 1 0-298.2 0Z"
        fill={color3}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color3Class}
      />
      <path
        d="M514 473.8c-83.9 0-152.1-80.5-152.1-179.4S430.2 115 514 115s152.1 80.5 152.1 179.4S597.9 473.8 514 473.8z m0-352.8c-80.6 0-146.1 77.8-146.1 173.4S433.5 467.8 514 467.8c80.6 0 146.1-77.8 146.1-173.4S594.6 121 514 121z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M513.5 412.1c-23.1 0-46.5-5.6-46.5-16.3h6c0 3.5 14.3 10.3 40.5 10.3s40.5-6.8 40.5-10.3h6c0 10.7-23.4 16.3-46.5 16.3z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M750 923.1H275.5c-6.6 0-12-5.4-12-12V535.5c0-6.6 5.4-12 12-12H750c6.6 0 12 5.4 12 12v375.6c0 6.6-5.4 12-12 12z"
        fill={color5}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color5Class}
      />
      <path
        d="M750 926.1H275.5c-8.3 0-15-6.7-15-15V535.5c0-8.3 6.7-15 15-15H750c8.3 0 15 6.7 15 15v375.6c0 8.3-6.7 15-15 15zM275.5 526.5c-5 0-9 4-9 9v375.6c0 5 4 9 9 9H750c5 0 9-4 9-9V535.5c0-5-4-9-9-9H275.5z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M287.7 749.9c-12.9 18-33.9 18-46.8 0s-12.9-47.1 0-65c12.9-18 33.9-18 46.8 0 12.9 17.9 12.9 47 0 65z"
        fill={color3}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color3Class}
      />
      <path
        d="M264.3 766.4c-9.8 0-19-5.2-25.8-14.7-13.6-18.9-13.6-49.7 0-68.6 6.8-9.5 16-14.7 25.8-14.7s19 5.2 25.8 14.7c13.6 18.9 13.6 49.7 0 68.6-6.8 9.4-16 14.7-25.8 14.7z m0-92c-7.8 0-15.3 4.3-21 12.2-12.2 17-12.2 44.6 0 61.5 5.7 7.9 13.1 12.2 21 12.2s15.3-4.3 21-12.2c12.2-17 12.2-44.6 0-61.5-5.8-7.9-13.2-12.2-21-12.2z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M785.8 749.9c-12.9 18-33.9 18-46.8 0s-12.9-47.1 0-65c12.9-18 33.9-18 46.8 0 12.9 17.9 12.9 47 0 65z"
        fill={color3}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color3Class}
      />
      <path
        d="M762.4 766.4c-9.8 0-19-5.2-25.8-14.7-13.6-18.9-13.6-49.7 0-68.6 6.8-9.5 16-14.7 25.8-14.7s19 5.2 25.8 14.7c13.6 18.9 13.6 49.7 0 68.6-6.8 9.4-16 14.7-25.8 14.7z m0-92c-7.8 0-15.3 4.3-21 12.2-12.2 17-12.2 44.6 0 61.5 5.7 7.9 13.1 12.2 21 12.2s15.3-4.3 21-12.2c12.2-17 12.2-44.6 0-61.5-5.7-7.9-13.1-12.2-21-12.2z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M635.3 137.5L583 108.3l-2.7 2c-5-3.1-17.7-4.9-49.6-2.6-23.6 1.7-47.2 4.9-47.4 5l-0.4 0.1-94.4 42.2-32 20.3 4.8 126.4c-0.6 3.9-0.6 6.1-0.6 6.4v0.5l7.8 23.4-1.1-29.9c1.4-9.3 5.9-28.5 19.6-51.1 17.9-29.4 55.8-70.8 134.5-100.6 3-1.1 5.8-2.2 8.5-3.3l-1.6 1.2h9.2c43.5 0 74.8 45.5 93.5 83.7 20.5 42 30.5 84.5 30.6 85l5.7 24.7 1.2-154.2-33.3-50z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M572 320.7a29.7 16.3 0 1 0 59.4 0 29.7 16.3 0 1 0-59.4 0Z"
        fill={color4}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color4Class}
      />
      <path
        d="M578 257.3c-11.5 0-20.9 12.7-20.9 28.4S566.5 314 578 314s20.9-12.7 20.9-28.4-9.4-28.3-20.9-28.3z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M569 291.8a9 9.9 0 1 0 18 0 9 9.9 0 1 0-18 0Z"
        fill={color5}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color5Class}
      />
      <path
        d="M547 253.7c8.3-8.1 19-13.6 30.2-16.4 14.2-3.6 24.8 3.1 34.8 12.6 1.4 1.3 3.5-0.8 2.1-2.1-9.5-9.1-20.5-16.6-34.3-14.2-12.9 2.3-25.6 8.8-35 17.9-1.3 1.4 0.8 3.5 2.2 2.2z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M396.7 320.7a29.7 16.3 0 1 0 59.4 0 29.7 16.3 0 1 0-59.4 0Z"
        fill={color4}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color4Class}
      />
      <path
        d="M450.1 257.3c-11.5 0-20.9 12.7-20.9 28.4s9.4 28.4 20.9 28.4 20.9-12.7 20.9-28.4-9.4-28.4-20.9-28.4z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M441.1 291.8a9 9.9 0 1 0 18 0 9 9.9 0 1 0-18 0Z"
        fill={color5}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color5Class}
      />
      <path
        d="M483.2 251.5c-9.3-9.1-22.1-15.6-35-17.9-13.8-2.4-24.7 5-34.3 14.2-1.4 1.3 0.7 3.5 2.1 2.1 9.9-9.5 20.6-16.2 34.8-12.6 11.2 2.8 21.9 8.3 30.2 16.4 1.5 1.3 3.6-0.8 2.2-2.2z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M632 893.6H392.1c-6.6 0-12-5.4-12-12V565.5c0-6.6 5.4-12 12-12H632c6.6 0 12 5.4 12 12v316.2c0 6.5-5.4 11.9-12 11.9z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M632 896.6H392.1c-8.3 0-15-6.7-15-15V565.5c0-8.3 6.7-15 15-15H632c8.3 0 15 6.7 15 15v316.2c0 8.2-6.8 14.9-15 14.9zM392.1 556.5c-5 0-9 4-9 9v316.2c0 5 4 9 9 9H632c5 0 9-4 9-9V565.5c0-5-4-9-9-9H392.1z"
        fill={color}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={colorClass}
      />
      <path
        d="M436.1 706h-8.9v-2h27.1v2h-7.6c0 6.7-2.1 11.5-6.4 14.4-4.3 2.9-8.8 4.4-13.5 4.4-6.8 0-12.6-2.7-17.1-8.2-4.6-5.5-6.8-11.9-6.8-19.2 0-7.4 2.3-13.8 7-19.3 4.7-5.4 10.5-8.1 17.4-8.1 3.6 0 7 1 10.3 3.1 1 0.6 1.7 0.9 2.1 0.9 0.8 0 1.7-0.7 2.5-2.2h1.8l0.5 14.2h-2c-2.2-9.4-7.3-14.1-15.4-14.1-4.2 0-7.3 0.9-9.2 2.8-1.9 1.9-3.1 4.3-3.5 7.1-0.4 2.9-0.6 7-0.6 12.3 0 9.6 0.3 16 1 19.1 0.6 3.1 1.9 5.5 3.9 7.1 2 1.6 4.4 2.4 7.3 2.4 2.3 0 4.3-0.5 6.1-1.4 1.8-0.9 2.9-2.3 3.4-4.2 0.5-1.9 0.7-4.6 0.7-8.3V706zM484.1 724.8c-6.8 0-12.5-2.8-17.2-8.5-4.7-5.7-7.1-11.7-7.1-18.2 0-7.8 2.5-14.4 7.4-19.9 5-5.5 10.7-8.2 17.3-8.2 6.2 0 11.7 2.8 16.6 8.4 4.9 5.6 7.3 11.9 7.3 19 0 7.3-2.5 13.7-7.4 19.2-4.8 5.4-10.5 8.2-16.9 8.2z m0.2-52.8c-2.9 0-5.4 0.7-7.7 2s-3.8 3.6-4.6 6.9c-0.8 3.3-1.2 8.9-1.2 17 0 5.6 0.2 10.1 0.7 13.4 0.5 3.3 1.7 6.1 3.6 8.3s4.9 3.3 9 3.3c2.5 0 5-0.7 7.5-2s4.2-3.9 4.9-7.8c0.8-3.9 1.2-9.9 1.2-17.9 0-7.3-0.5-12.4-1.4-15.2-1-2.8-2.5-4.8-4.6-6-2.2-1.4-4.7-2-7.4-2zM533.9 673.2v48.4h11.8c2.3 0 4-0.2 5.4-0.5 1.3-0.3 2.6-1.2 3.8-2.5 1.3-1.3 2.2-2.9 2.9-4.6 0.7-1.8 1.4-4.3 2.2-7.5h1.8l-1.4 17.1h-44v-2h8.2v-48.4h-8.2v-2h26.3v2h-8.8zM575.9 721.6v-48.4h-8.2v-2h24.7c5.5 0 10.1 0.8 14 2.3 3.9 1.5 7.1 4.6 9.7 9.1 2.6 4.5 3.9 9.4 3.9 14.7 0 5.6-1.4 10.6-4.3 15s-6.2 7.4-9.9 8.9-8.3 2.3-13.7 2.3h-24.6v-2h8.4z m9.3-48.4v48.4h6.8c3.6 0 6.5-0.3 8.7-1 2.3-0.7 4.1-2.1 5.6-4.3 1.5-2.2 2.5-5 3-8.3 0.5-3.4 0.8-7.7 0.8-13.2 0-6.5-0.8-11.4-2.5-14.6-1.7-3.2-3.7-5.2-6.1-6-2.4-0.8-5.5-1.2-9.4-1.2h-6.9z"
        fill={color5}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color5Class}
      />
      <path
        d="M454.6 800.7l4.1-0.4c0.3 1.9 1 3.3 2 4.1s2.2 1.3 3.7 1.3c1.3 0 2.4-0.3 3.4-0.9s1.8-1.4 2.4-2.4 1.1-2.3 1.6-4 0.6-3.4 0.6-5.2v-0.8c-0.8 1.3-2 2.4-3.5 3.3-1.5 0.9-3.1 1.3-4.9 1.3-2.5 0-5-1-6.8-2.8-2.2-2.1-3.2-4.9-3.2-8.4s1-6.3 3.1-8.4 4.6-3.2 7.7-3.2c2.2 0 4.3 0.6 6.1 1.8s3.3 2.9 4.2 5.1 1.4 5.4 1.4 9.7c0 4.4-0.5 7.9-1.4 10.5s-2.4 4.6-4.3 5.9-4.1 2-6.6 2c-2.7 0-4.9-0.7-6.6-2.2s-2.7-3.6-3-6.3z m17.3-15.2c0-2.4-0.6-4.3-1.9-5.8s-2.8-2.1-4.7-2.1c-1.9 0-3.5 0.8-4.9 2.3s-2.1 3.5-2.1 6c0 2.2 0.7 4 2 5.3s2.9 2.1 4.9 2.1c2 0 3.6-0.7 4.8-2.1s1.9-3.3 1.9-5.7zM481.3 800.7l4.1-0.4c0.3 1.9 1 3.3 2 4.1s2.2 1.3 3.7 1.3c1.3 0 2.4-0.3 3.4-0.9s1.8-1.4 2.4-2.4 1.1-2.3 1.6-4 0.6-3.4 0.6-5.2v-0.8c-0.8 1.3-2 2.4-3.5 3.3-1.5 0.9-3.1 1.3-4.9 1.3-2.5 0-5-1-6.8-2.8-2.2-2.1-3.2-4.9-3.2-8.4s1-6.3 3.1-8.4 4.6-3.2 7.7-3.2c2.2 0 4.3 0.6 6.1 1.8s3.3 2.9 4.2 5.1 1.4 5.4 1.4 9.7c0 4.4-0.5 7.9-1.4 10.5s-2.4 4.6-4.3 5.9-4.1 2-6.6 2c-2.7 0-4.9-0.7-6.6-2.2s-2.7-3.6-3-6.3z m17.3-15.2c0-2.4-0.6-4.3-1.9-5.8s-2.8-2.1-4.7-2.1c-1.9 0-3.5 0.8-4.9 2.3s-2.1 3.5-2.1 6c0 2.2 0.7 4 2 5.3s2.9 2.1 4.9 2.1c2 0 3.6-0.7 4.8-2.1s1.9-3.3 1.9-5.7zM508 800.7l4.1-0.4c0.3 1.9 1 3.3 2 4.1s2.2 1.3 3.7 1.3c1.3 0 2.4-0.3 3.4-0.9s1.8-1.4 2.4-2.4 1.1-2.3 1.6-4 0.6-3.4 0.6-5.2v-0.8c-0.8 1.3-2 2.4-3.5 3.3-1.5 0.9-3.1 1.3-4.9 1.3-2.5 0-5-1-6.8-2.8-2.2-2.1-3.2-4.9-3.2-8.4s1-6.3 3.1-8.4c2.1-2.1 4.6-3.2 7.7-3.2 2.2 0 4.3 0.6 6.1 1.8s3.3 2.9 4.2 5.1 1.4 5.4 1.4 9.7c0 4.4-0.5 7.9-1.4 10.5s-2.4 4.6-4.3 5.9-4.1 2-6.6 2c-2.7 0-4.9-0.7-6.6-2.2-1.6-1.5-2.7-3.6-3-6.3z m17.3-15.2c0-2.4-0.6-4.3-1.9-5.8s-2.8-2.1-4.7-2.1c-1.9 0-3.5 0.8-4.9 2.3s-2.1 3.5-2.1 6c0 2.2 0.7 4 2 5.3s2.9 2.1 4.9 2.1c2 0 3.6-0.7 4.8-2.1s1.9-3.3 1.9-5.7zM536.4 808.6v-4.8h4.8v4.8h-4.8zM548 800.7l4.1-0.4c0.3 1.9 1 3.3 2 4.1s2.2 1.3 3.7 1.3c1.3 0 2.4-0.3 3.4-0.9s1.8-1.4 2.4-2.4 1.1-2.3 1.6-4 0.6-3.4 0.6-5.2v-0.8c-0.8 1.3-2 2.4-3.5 3.3-1.5 0.9-3.1 1.3-4.9 1.3-2.5 0-5-1-6.8-2.8-2.2-2.1-3.2-4.9-3.2-8.4s1-6.3 3.1-8.4 4.6-3.2 7.7-3.2c2.2 0 4.3 0.6 6.1 1.8s3.3 2.9 4.2 5.1 1.4 5.4 1.4 9.7c0 4.4-0.5 7.9-1.4 10.5s-2.4 4.6-4.3 5.9-4.1 2-6.6 2c-2.7 0-4.9-0.7-6.6-2.2s-2.6-3.6-3-6.3z m17.3-15.2c0-2.4-0.6-4.3-1.9-5.8s-2.8-2.1-4.7-2.1c-1.9 0-3.5 0.8-4.9 2.3s-2.1 3.5-2.1 6c0 2.2 0.7 4 2 5.3s2.9 2.1 4.9 2.1c2 0 3.6-0.7 4.8-2.1s1.9-3.3 1.9-5.7z"
        fill={color5}
        stroke="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={color5Class}
      />
    </svg>
  );
};

const ForwardRef = forwardRef(DemoGoldPersonIcon);
const Memo = memo(ForwardRef);
export default Memo;
