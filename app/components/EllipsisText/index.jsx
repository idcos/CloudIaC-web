export default (props) => {
  const { 
    noPointerEvents = false,
    children,
    maxWidth,
    style,
    tagName: TagName = 'span',
    ...restProps
  } = props || {};
  return <TagName
    className={`idcos-ellipsis-text ${noPointerEvents ? 'no-pointer-events' : ''}`}
    title={children}
    {...restProps}
    style={{ maxWidth, width: maxWidth ? 'auto' : '100%', ...style }}
  >
    {children}
  </TagName>;
};
