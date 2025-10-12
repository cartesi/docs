import React from "react";
import Link from "@docusaurus/Link";
import ArrowIcon from "./icons/arrow2.svg";
import Build from "./icons/build.svg";

export function DocListItem({ to, children }) {
return (
    <li className="flex gap-2 px-3">
        <div>
            <ArrowIcon className="icon" width={10} height={10} />
        </div>
        <div className="">
            <Link to={to} style={{ color: "#1c1b1f" }}>{children}</Link>
        </div>
    </li>
);
}

export function DocListHeader({ icon, Text }) {
  return (
    <div className="card__header flex gap-2">
        <div className="col col--2 flex justify-center items-center">
            <div className="">
                {React.createElement(icon, { className: "icon", width: 34, height: 34 })}
            </div>
        </div>
        <div className="col col--10  p-2">
            <div className="font-bold">
                <h3>{Text}</h3>
            </div>
        </div>
    </div>
  );
}

