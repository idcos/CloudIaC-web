export default (props) => {
  const { 
    noPointerEvents = false,
    children,
    maxWidth,
    style,
    ...restProps
  } = props || {};
  return <span
    className={`idcos-ellipsis-text ${noPointerEvents ? 'no-pointer-events' : ''}`}
    title={children}
    {...restProps}
    style={{ maxWidth, width: maxWidth ? 'auto' : '100%', ...style }}
  >
    {children}
  </span>;
};
