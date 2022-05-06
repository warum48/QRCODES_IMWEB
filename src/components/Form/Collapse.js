import React from "react";
import useCollapse from "react-collapsed";

export default function Collapse({ isActive, children }) {
  const [isExpanded, setExpanded] = React.useState(isActive);
  const { getToggleProps, getCollapseProps } = useCollapse({
    isExpanded
  });

  React.useEffect(() => {
    setExpanded(isActive);
  }, [isActive, setExpanded]);

  return <div {...getCollapseProps()}>{children}</div>;
}
