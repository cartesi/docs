import React, { useEffect, useMemo } from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useAnnouncementBar } from "@docusaurus/theme-common/internal";
import AnnouncementBarCloseButton from "@theme/AnnouncementBar/CloseButton";
import AnnouncementBarContent from "@theme/AnnouncementBar/Content";
import { CookiesProvider, useCookies } from "react-cookie";

import styles from "./styles.module.css";
export default function AnnouncementBar() {
  const { announcementBar } = useThemeConfig();
  const { isActive, close } = useAnnouncementBar();

  const COOKIE_EXPIRY = 1000 * 60 * 60 * 24 * 2;
  // const COOKIE_EXPIRY = 1000 * 10;
  const COOKIE_NAME = "docusaurus.announcement.dismissExpiry";

  const [cookies, setCookie] = useCookies([COOKIE_NAME]);

  const handleClose = () => {
    setCookie(COOKIE_NAME, true, {
      expires: new Date(Date.now() + COOKIE_EXPIRY),
    });
    close();
  };

  const cookieExpired = useMemo(() => {
    return !cookies[COOKIE_NAME];
  }, [cookies]);

  const showAnnouncementBar = useMemo(() => {
    return isActive ? isActive : cookieExpired;
  }, [isActive, cookieExpired]);

  useEffect(() => {
    if (!showAnnouncementBar) return;
    document.documentElement.dataset.announcementBarInitiallyDismissed = false;
  }, [showAnnouncementBar]);

  const { backgroundColor, textColor, isCloseable } = announcementBar;
  return (
    <CookiesProvider>
      {showAnnouncementBar ? (
        <div
          className={styles.announcementBar}
          style={{ backgroundColor, color: textColor }}
          role="banner"
        >
          {isCloseable && <div className={styles.announcementBarPlaceholder} />}
          <AnnouncementBarContent className={styles.announcementBarContent} />
          {isCloseable && (
            <AnnouncementBarCloseButton
              onClick={handleClose}
              className={styles.announcementBarClose}
            />
          )}
        </div>
      ) : null}
    </CookiesProvider>
  );
}
