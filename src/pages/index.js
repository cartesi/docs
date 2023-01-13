import React from "react";
import Layout from "@theme/Layout";
import { Hello } from "../components/Hello";
import { Learn } from "../components/Learn";
import { Faq } from "../components/Faq";

function Home() {
  return (
    <Layout title="Homepage" description="Cartesi">
      <Hello />
      <Learn />
      <Faq />
    </Layout>
  );
}

export default Home;
