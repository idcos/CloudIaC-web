import Lottie from "lottie-react";
import loadingAnimation from './cfg/loading.json';

export const LoadingIcon = ({ size, style, ...props }) => (
  <Lottie style={{ width: size, height: size, lineHeight: size + 'px', ...style }} animationData={loadingAnimation} {...props} />
);