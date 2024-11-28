export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ABRACM",
  description: "Associação Brasileira de Clínicas Multidisciplinares de Reabilitação Neurológica.",
  navItems: [
    {
      label: "Início",
      href: "/",
    },
    {
      label: "Quem somos",
      href: "/quem-somos",
    },
    {
      label: "Sou associado",
      href: "/signin",
    },
  ],
  navMenuItems: [
    {
      label: "Início",
      href: "/",
    },
    {
      label: "Quem somos",
      href: "/quem-somos",
    },
    {
      label: "Sou associado",
      href: "/signin",
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
