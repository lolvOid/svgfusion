import React, { Ref, forwardRef, memo } from 'react';

interface DemoHeartLineIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
  desc?: string;
  descId?: string;
  size?: string;
  color?: string;
  colorClass?: string;
  strokeWidth?: string | number;
  strokeWidthClass?: string;
  isFixedStrokeWidth?: boolean;
}

const DemoHeartLineIcon = (
  {
    title,
    titleId,
    desc,
    descId,
    colorClass,
    strokeWidthClass,
    size = '20',
    color = '#000000',
    strokeWidth = '2',
    isFixedStrokeWidth = true,
    ...svgProps
  }: DemoHeartLineIconProps,
  ref: Ref<SVGSVGElement>
) => {
  const computedSize = size ? { width: size, height: size } : {};

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...computedSize}
      {...svgProps}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {desc ? <desc id={descId}>{desc}</desc> : null}
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M17 4c-3.2 0-5 2.667-5 4 0-1.333-1.8-4-5-4S3 6.667 3 8c0 7 9 12 9 12s9-5 9-12c0-1.333-.8-4-4-4z"
        fill="none"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}
        className={`${colorClass} ${strokeWidthClass}`}
      />
    </svg>
  );
};

const ForwardRef = forwardRef(DemoHeartLineIcon);
const Memo = memo(ForwardRef);
export default Memo;
