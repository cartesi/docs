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
    contact: "https://cartesi.io/contact",
    docs: "https://docs.cartesi.io/",
    whitepaper: "https://cartesi.io/cartesi_whitepaper.pdf",
    foundationNotice: "https://cartesi.io/foundation_notice.pdf",
    usagePolicy: "https://cartesi.io/cartesi_trademark_usage_policy.pdf",
    examples: "https://docs.cartesi.io/",
    showcase: "https://rolluplab.io/",
    bugBounty:
      "https://immunefi.com/bounty/cartesi/?_gl:1*10hyf54*_ga*MTAyODg1OTI1LjE2ODY5MDA3NjA.*_ga_HM92STPNFJ*MTY4Nzg2ODk0Ny41LjEuMTY4Nzg2OTU0OC4xOC4wLjA.",
    staking: "https://explorer.cartesi.io/stake",
    grantsProgram: "https://governance.cartesi.io/",
    cgpVoting: "https://governance.cartesi.io/",
    discord: "https://discord.gg/pfXMwXDDfW",
    github:
      "https://www.github.com/cartesi?_gl:1*li4xfw*_ga*MTAyODg1OTI1LjE2ODY5MDA3NjA.*_ga_HM92STPNFJ*MTY4Nzg0OTc2OS4zLjEuMTY4Nzg1MTAwMS41OC4wLjA.",
    telegram: "https://t.me/cartesiannouncements",
    twitter: "https://www.twitter.com/cartesiproject",
    medium: "https://medium.com/cartesi",
    youtube: "https://www.youtube.com/c/Cartesiproject/videos",
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
          Governance and grants
        </a>
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.contact}
        >
          Contact
        </a>
      </div>
      <div className="flex flex-col gap-4">
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.whitepaper}
        >
          Whitepaper
        </a>
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.foundationNotice}
        >
          Foundation Notice
        </a>
        <a
          className="text-white hover:text-white/80 no-underline hover:no-underline"
          href={routes.usagePolicy}
        >
          Usage Policy
        </a>
      </div>
      <div className="col-span-2 flex flex-row gap-4 sm:col-span-1 sm:flex-col">
        <a
          href={routes.discord}
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconDiscord alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Discord</span>
        </a>
        <a
          href={routes.github}
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconGithub alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">GitHub</span>
        </a>
        <a
          href={routes.telegram}
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconTelegram alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Telegram</span>
        </a>
        <a
          href={routes.twitter}
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconTwitter alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Twitter</span>
        </a>
        <a
          href={routes.medium}
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconMedium alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Medium</span>
        </a>
      </div>
      <div className="col-span-2 flex flex-row gap-4 sm:col-span-1 sm:flex-col">
        <a
          href={routes.youtube}
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconYoutube alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Youtube</span>
        </a>
        <a
          href={routes.reddit}
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconReddit alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">Reddit</span>
        </a>
        <a
          href={routes.linkedin}
          className="p-2 sm:p-0 text-white hover:text-white/80 no-underline hover:no-underline"
        >
          <IconLinkedin alt="" className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:block">LinkedIn</span>
        </a>
        <a
          href={routes.instagram}
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
