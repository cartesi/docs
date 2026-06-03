import React from "react";
import { Redirect } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";

function Home() {
  // return <Redirect to="/cartesi-rollups" />;
  // return <Redirect to="/cartesi-rollups/2.0/getting-started" />;
  // useBaseUrl keeps the redirect correct under any baseUrl. Production uses "/"
  // (target unchanged), but PR previews are served from a sub-path where a bare
  // "/get-started" would resolve outside the preview and 404.
  return <Redirect to={useBaseUrl("/get-started")} />;
}

export default Home;
