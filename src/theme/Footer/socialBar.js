import React from "react";

const IconDiscord = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M10.076 11c.6 0 1.086.45 1.075 1 0 .55-.474 1-1.075 1C9.486 13 9 12.55 9 12s.475-1 1.076-1zm3.848 0c.601 0 1.076.45 1.076 1s-.475 1-1.076 1c-.59 0-1.075-.45-1.075-1s.474-1 1.075-1zm4.967-9C20.054 2 21 2.966 21 4.163V23l-2.211-1.995-1.245-1.176-1.317-1.25.546 1.943H5.109C3.946 20.522 3 19.556 3 18.359V4.163C3 2.966 3.946 2 5.109 2H18.89zm-3.97 13.713c2.273-.073 3.148-1.596 3.148-1.596 0-3.381-1.482-6.122-1.482-6.122-1.48-1.133-2.89-1.102-2.89-1.102l-.144.168c1.749.546 2.561 1.334 2.561 1.334a8.263 8.263 0 0 0-3.096-1.008 8.527 8.527 0 0 0-2.077.02c-.062 0-.114.011-.175.021-.36.032-1.235.168-2.335.662-.38.178-.607.305-.607.305s.854-.83 2.705-1.376l-.103-.126s-1.409-.031-2.89 1.103c0 0-1.481 2.74-1.481 6.121 0 0 .864 1.522 3.137 1.596 0 0 .38-.472.69-.871-1.307-.4-1.8-1.24-1.8-1.24s.102.074.287.179c.01.01.02.021.041.031.031.022.062.032.093.053.257.147.514.262.75.357.422.168.926.336 1.513.452a7.06 7.06 0 0 0 2.664.01 6.666 6.666 0 0 0 1.491-.451c.36-.137.761-.337 1.183-.62 0 0-.514.861-1.862 1.25.309.399.68.85.68.85z" />
  </svg>
);

const IconGitHub = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" />
  </svg>
);

const IconTelegram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-3.11-8.83l.013-.007.87 2.87c.112.311.266.367.453.341.188-.025.287-.126.41-.244l1.188-1.148 2.55 1.888c.466.257.801.124.917-.432l1.657-7.822c.183-.728-.137-1.02-.702-.788l-9.733 3.76c-.664.266-.66.638-.12.803l2.497.78z" />
  </svg>
);

const socialLinksWithIcons = [
  {
    name: "Discord",
    url: "https://discord.gg/uxYE5YNv3N",
    icon: <IconDiscord className="h-8 w-8 fill-current" />,
  },
  {
    name: "Github",
    url: "https://www.github.com/cartesi",
    icon: <IconGitHub className="h-8 w-8 fill-current" />,
  },

  {
    name: "Telegram",
    url: "https://t.me/cartesiannouncements",
    icon: <IconTelegram className="h-8 w-8 fill-current" />,
  },
];

const socialLinksNoIcons = [
  {
    name: "Twitter",
    url: "https://www.twitter.com/cartesiproject",
  },

  {
    name: "Medium",
    url: "https://www.medium.com/cartesi",
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com/c/Cartesiproject/videos",
  },
  {
    name: "Reddit",
    url: "https://www.reddit.com/r/cartesi/",
  },
];

const SocialBar = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0 md:divide-x md:divide-white ">
      <div className="flex items-center gap-4 sm:gap-6 md:pr-16 md:pl-8">
        {socialLinksWithIcons.map(({ name, url, icon }) => (
          <div key={name}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 font-bold text-white hover:text-white hover:no-underline cursor-pointer"
            >
              {icon}
              {name}
            </a>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 sm:gap-6 md:pl-16 md:pr-8">
        {socialLinksNoIcons.map(({ name, url }) => (
          <div key={name}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 text-white hover:text-white hover:no-underline cursor-pointer "
            >
              {name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialBar;
