import * as React from "react";

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
        return;
      }

      if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

export function mergeProps<T extends Record<string, unknown>>(...sources: Array<T | undefined>): T {
  return Object.assign({}, ...sources.filter(Boolean)) as T;
}

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...props },
  forwardedRef,
) {
  if (!React.isValidElement(children)) {
    return null;
  }

  const child = React.Children.only(children);
  const childProps = child.props as Record<string, unknown>;

  const mergedProps = mergeProps(childProps, props) as Record<string, unknown>;
  const childRef = (child as { ref?: React.Ref<HTMLElement> }).ref;

  return React.cloneElement(
    child as React.ReactElement,
    {
      ...mergedProps,
      ref: mergeRefs(forwardedRef, childRef as React.Ref<HTMLElement>),
    } as never,
  );
});
