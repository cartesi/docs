import React from "react";
import Translate from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDateTimeFormat } from "@docusaurus/theme-common/internal";
function LastUpdatedAtDate({ lastUpdatedAt }) {
  const atDate = new Date(lastUpdatedAt);
  const dateTimeFormat = useDateTimeFormat({
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const formattedLastUpdatedAt = dateTimeFormat.format(atDate);
  return (
    <Translate
      id="theme.lastUpdated.atDate"
      description="The words used to describe on which date a page has been last updated"
      values={{
        date: (
          <time dateTime={atDate.toISOString()} itemProp="dateModified">
            {formattedLastUpdatedAt}
          </time>
        ),
      }}
    >
      {" on {date}"}
    </Translate>
  );
}
function LastUpdatedByUser({ lastUpdatedBy }) {
  return (
    <Translate
      id="theme.lastUpdated.byUser"
      description="The words used to describe by who the page has been last updated"
      values={{
        user: <b>{lastUpdatedBy}</b>,
      }}
    >
      {" by {user}"}
    </Translate>
  );
}
export default function LastUpdated({ lastUpdatedAt, lastUpdatedBy }) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 fill-current shrink-0"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 2.66a1 1 0 0 0 -.993 .883l-.007 .117v5l.009 .131a1 1 0 0 0 .197 .477l.087 .1l3 3l.094 .082a1 1 0 0 0 1.226 0l.094 -.083l.083 -.094a1 1 0 0 0 0 -1.226l-.083 -.094l-2.707 -2.708v-4.585l-.007 -.117a1 1 0 0 0 -.993 -.883z"
          strokeWidth="0"
          fill="currentColor"
        />
      </svg>
      <span className="font-normal not-italic">
        <Translate
          id="theme.lastUpdated.lastUpdatedAtBy"
          description="The sentence used to display when a page has been last updated, and by who"
          values={{
            atDate: lastUpdatedAt ? (
              <LastUpdatedAtDate lastUpdatedAt={lastUpdatedAt} />
            ) : (
              ""
            ),
            byUser: lastUpdatedBy ? (
              <LastUpdatedByUser lastUpdatedBy={lastUpdatedBy} />
            ) : (
              ""
            ),
          }}
        >
          {"Last updated{atDate}{byUser}"}
        </Translate>
      </span>
    </div>
  );
}
