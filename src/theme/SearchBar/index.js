import React from 'react';
import SearchBar from '@theme-original/SearchBar';
import AskCookbook from '@cookbookdev/docsbot/react'
import BrowserOnly from '@docusaurus/BrowserOnly';
/** It's a public API key, so it's safe to expose it here */
const COOKBOOK_PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWRkMzA5Y2RkNGUyMjU1NmM4NGM4YjIiLCJpYXQiOjE3MDg5OTQ3MTYsImV4cCI6MjAyNDU3MDcxNn0.4lOeLJGhAwOa-7S3RvmbiWJ72ITnKUmZUqrfST_fqdQ";
export default function SearchBarWrapper(props) {
  return (
    <>
      <SearchBar {...props} />
      <BrowserOnly>{() => <AskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} /> }</BrowserOnly>
    </>
  );
}
