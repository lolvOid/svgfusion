import * as React from 'react';
import { Ref, forwardRef, memo } from 'react';

interface GradientIconProps {
  title?: string;
  titleId?: string;
  desc?: string;
  descId?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
}

const GradientIcon = ({ title, titleId, desc, descId, className, style, width, height }: GradientIconProps, ref: Ref<SVGSVGElement>) => (
  <svg
    className={className}
    style={style}
    width={width}
    height={height}
    ref={ref} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.999 511.999" space="preserve" role="img" aria-labelledby={titleId} {descId} />
    {title ? <title id={titleId}>{title}</title> : null}
    {desc ? <desc id={descId}>{desc}</desc> : null}
  </svg>
);

const ForwardRef = forwardRef(GradientIcon);
const Memo = memo(ForwardRef);
export default Memo;