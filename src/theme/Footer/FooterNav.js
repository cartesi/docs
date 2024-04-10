import React from "react";

import IconDiscord from "/img/icon-discord.svg";
import IconGithub from "/img/icon-github.svg";
import IconTelegram from "/img/icon-telegram.svg";
import IconTwitter from "/img/icon-twitter.svg";
import IconMedium from "/img/icon-medium.svg";
import IconYoutube from "/img/icon-youtube.svg";
import IconReddit from "/img/icon-reddit.svg";
import IconLinkedin from "/img/icon-linkedin.svg";
import IconInstagram from "/img/icon-instagram.svg";

function FooterNav() {
  const routes = {
    home: "https://cartesi.io",
    about: "https://cartesi.io/about",
    blog: "https://cartesi.io/blog",
    governance: "https://cartesi.io/governance",
    docs: "https://docs.cartesi.io/",
    whitepaper: "https://cartesi.io/cartesi_whitepaper.pdf",
    foundationNotice: "https://cdn.sanity.io/files/zg5gx8g4/production/b63a469a52ba0e7db65060e4b072be7074f2822f.pdf",
    usagePolicy: "https://cdn.sanity.io/files/zg5gx8g4/production/ddd64effd0cbf8ff1b4193fe4ee85c7016e7c168.pdf",
    examples: "https://docs.cartesi.io/",
    showcase: "https://rolluplab.io/",
    bugBounty:
      "https://immunefi.com/bounty/cartesi/?_gl:1*10hyf54*_ga*MTAyODg1OTI1LjE2ODY5MDA3NjA.*_ga_HM92STPNFJ*MTY4Nzg2ODk0Ny41LjEuMTY4Nzg2OTU0OC4xOC4wLjA.",
    staking: "https://explorer.cartesi.io/stake",
    grantsProgram: "https://governance.cartesi.io/",
    cgpVoting: "https://snapshot.org/#/cartesi-community-grants-program.eth",
    discord: "https://discord.gg/cWGbyFkQ2W",
    github: "https://www.github.com/cartesi",
    telegram: "https://t.me/CartesiProject",
    twitter: "https://www.twitter.com/cartesiproject",
   
    youtube: "https://www.youtube.com/@Cartesiproject/featured",
    reddit: "https://www.reddit.com/r/cartesi/",
    linkedin: "https://www.linkedin.com/company/cartesi/",
    instagram: "https://www.instagram.com/cartesiproject/",
    startBuilding: "https://docs.cartesi.io/build-dapps/",
  };

  return (
    <div className="grid grow grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="flex flex-col gap-4">
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.about}
        >
          About
        </a>
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.blog}
        >
          Blog
        </a>
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.governance}
        >
          Governance & Grants
        </a>
      </div>
      <div className="flex flex-col gap-4">
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.whitepaper}
          target="_blank"
        >
          Whitepaper
        </a>
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.foundationNotice}
          target="_blank"
        >
          Foundation Notice
        </a>
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.usagePolicy}
          target="_blank"
        >
          Usage Policy
        </a>
      </div>
      <div className="col-span-2 flex flex-row gap-4 sm:col-span-1 sm:flex-col">
        <a
          href={routes.discord}
          target="_blank"
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconDiscord alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Discord</span>
        </a>
        <a
          href={routes.github}
          target="_blank"
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconGithub alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">GitHub</span>
        </a>
        <a
          href={routes.telegram}
          target="_blank"
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconTelegram alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Telegram</span>
        </a>
        <a
          href={routes.twitter}
          target="_blank"
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconTwitter alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Twitter</span>
        </a>
    
      </div>
      <div className="col-span-2 flex flex-row gap-4 sm:col-span-1 sm:flex-col">
        <a
          href={routes.youtube}
          target="_blank"
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconYoutube alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Youtube</span>
        </a>
        <a
          href={routes.reddit}
          target="_blank"
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconReddit alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Reddit</span>
        </a>
        <a
          href={routes.linkedin}
          target="_blank"
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconLinkedin alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">LinkedIn</span>
        </a>
        <a
          href={routes.instagram}
            target="_blank"
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconInstagram alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block text-white hover:text-white/80 no-underline hover:no-underline">
            Instagram
          </span>
        </a>
      </div>
    </div>
  );
}

export default FooterNav;
