import React from "react";
import Translate from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
function LastUpdatedAtDate({ lastUpdatedAt, formattedLastUpdatedAt }) {
  return (
    <Translate
      id="theme.lastUpdated.atDate"
      description="The words used to describe on which date a page has been last updated"
      values={{
        date: (
          <time dateTime={new Date(lastUpdatedAt * 1000).toISOString()}>
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
export default function LastUpdated({
  lastUpdatedAt,
  formattedLastUpdatedAt,
  lastUpdatedBy,
}) {
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
      <span className={ThemeClassNames.common.lastUpdated}>
        <Translate
          id="theme.lastUpdated.lastUpdatedAtBy"
          description="The sentence used to display when a page has been last updated, and by who"
          values={{
            atDate:
              lastUpdatedAt && formattedLastUpdatedAt ? (
                <LastUpdatedAtDate
                  lastUpdatedAt={lastUpdatedAt}
                  formattedLastUpdatedAt={formattedLastUpdatedAt}
                />
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
        {process.env.NODE_ENV === "development" && (
          <div>
            {/* eslint-disable-next-line @docusaurus/no-untranslated-text */}
            <small> (Simulated during dev for better perf)</small>
          </div>
        )}
      </span>
    </div>
  );
}
