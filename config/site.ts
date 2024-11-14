export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Início",
      href: "/",
    },
    {
        label: "Questionário",
        href: "/questionario",
    },
    {
        label: "Agendar terapia",
        href: "/checkout",
    },
    {
        label: "Entrar",
        href: "/signin",
    },
  ],
  navMenuItems: [
      {
        label: "Início",
        href: "/",
      },
      {
          label: "Questionário",
          href: "/questionario",
      },
      {
          label: "Agendar terapia",
          href: "/checkout",
      },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
