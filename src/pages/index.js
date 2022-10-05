import React from "react";
import Layout from "@theme/Layout";
import { Hello } from "../components/Hello";
import { Learn } from "../components/Learn";
import { Faq } from "../components/Faq";
import { CodeSamples } from "../components/CodeSamples";

function Home() {
  return (
    <Layout title="Homepage" description="Cartesi">
      <Hello />
      <Learn />
      <Faq />
      <CodeSamples />
    </Layout>
  );
}

export default Home;
