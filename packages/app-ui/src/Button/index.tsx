import React from "react";

export default function Button({
  children,
  className,
}: {
  children?: any;
  className?: string;
}): JSX.Element {
  return <Button className={className}>{children}</Button>;
}
