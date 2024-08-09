import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import styles from "./styles.module.css";

import { http, createPublicClient } from "viem";
import { mainnet } from "viem/chains";
import { formatEther } from "viem";
import { wagmiContract } from "./contracts/contracts";

const transport = http(
  "https://eth-mainnet.g.alchemy.com/v2/cBxzBgf91hVaZIV-gnC0kuc-K1WGd2xX"
);
const symbol = "CTSI";

const client = createPublicClient({
  chain: mainnet,
  transport,
});

export default function AnnouncementBarContent(props) {
  const { announcementBar } = useThemeConfig();
  const { content } = announcementBar;

  const [loaded, setLoaded] = useState(false);
  const [dynamicContent, setDynamicContent] = useState(content);
  const [balanceLoaded, setBalanceLoaded] = useState(false);

  const formatLargeNumber = (num) => {
    const absNum = Math.abs(num);
    if (absNum >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (absNum >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  };

  // Fetch data for variables in the content

  const getBalance = async () => {
    const contractRead = await client.readContract({
      address: wagmiContract.address,
      abi: wagmiContract.abi,
      functionName: "balanceOf",
      args: ["0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366"],
    });
    setBalanceLoaded(true);
    const balanceInEther = parseFloat(formatEther(contractRead));
    return formatLargeNumber(balanceInEther);
  };

  // Add all variables and fetchers here
  const fetchMap = {
    balance: getBalance(),
    symbol: symbol,
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
      setLoaded(true);
    }

    updateContent();
  }, [contentVars, balanceLoaded]);

  return (
    <div
      {...props}
      className={clsx(styles.content, props.className)}
      // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: loaded ? dynamicContent : null,
      }}
    />
  );
}
