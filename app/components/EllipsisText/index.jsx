const EllipsisText = props => {
  const {
    noPointerEvents = false,
    children,
    maxWidth = '100%',
    style,
    tagName: TagName = 'span',
    ...restProps
  } = props || {};
  return (
    <TagName
      className={`idcos-text-ellipsis ${
        noPointerEvents ? 'no-pointer-events' : ''
      }`}
      title={children}
      {...restProps}
      style={{ display: 'inline-block', maxWidth, ...style }}
    >
      {children}
    </TagName>
  );
};

export default EllipsisText;
