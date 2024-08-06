import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import styles from "./styles.module.css";
export default function AnnouncementBarContent(props) {
  const { announcementBar } = useThemeConfig();
  const { content } = announcementBar;

  const [dynamicContent, setDynamicContent] = useState(content);

  // Fetch data for variables in the content
  const varNameFetcher = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    const data = await response.json();
    return data.title;
  };

  const varNameFetcher2 = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/2"
    );
    const data = await response.json();
    return data.title;
  };

  // Add all variables and fetchers here
  const fetchMap = {
    varName: varNameFetcher(),
    varName2: varNameFetcher2(),
  };

  // Extract variables from the content
  const contentVars = useMemo(() => {
    return content.match(/{{(.*?)}}/g)?.map((v) => v.slice(2, -2));
  }, [content]);

  // Update the content with the fetched values
  useEffect(() => {
    if (!contentVars) {
      return;
    }

    function fetchVars() {
      return Promise.all(
        contentVars.map((contentVar) => {
          return fetchMap[contentVar];
        })
      );
    }

    async function updateContent() {
      const values = await fetchVars();
      let newContent = content;
      contentVars.forEach((v, i) => {
        newContent = newContent.replace(`{{${v}}}`, values[i]);
      });
      setDynamicContent(newContent);
    }

    updateContent();
  }, [contentVars]);

  return (
    <div
      {...props}
      className={clsx(styles.content, props.className)}
      // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: dynamicContent }}
    />
  );
}
