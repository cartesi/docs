import React from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import AdmonitionLayout from "@theme/Admonition/Layout";
import IconGoal from "@theme/Admonition/Icon/Goal";
const infimaClassName = "alert alert--goal";
const defaultProps = {
  icon: <IconGoal />,
  title: (
    <Translate
      id="theme.admonition.goal"
      description="The default label used for the Goal admonition (:::goal)"
    >
      goal
    </Translate>
  ),
};
export default function AdmonitionTypeGoal(props) {
  return (
    <AdmonitionLayout
      {...defaultProps}
      {...props}
      className={clsx(infimaClassName, props.className)}
    >
      {props.children}
    </AdmonitionLayout>
  );
}
