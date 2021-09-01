const Index = (props) => {
  return <span
    className={`idcos-ellipsis-text ${props.noPointerEvents ? 'no-pointer-events' : ''}`}
    title={props.children}
    {...props}
  >
    {props.children}
  </span>;
};
export default Index;
