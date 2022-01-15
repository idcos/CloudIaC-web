import Lottie from "lottie-react";
import loadingAnimation from './cfg/loading.json';

export const LoadingIcon = ({ size, style, ...props }) => (
  <Lottie style={{ width: size, heigth: size, style }} animationData={loadingAnimation} {...props} />
);