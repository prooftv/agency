import { PageLock } from "../../components/PageLock/PageLock";
import { PreviewButton } from "../../components/PreviewMode/PreviewButton";
import { Seo } from "../../components/meta/Seo";
import { PageContext } from "../../context/PageContext";
import { SiteContext } from "../../context/SiteContext";
import { LanguageType } from "../../languages";
import { ConfigType } from "../../queries/config";
import { FooterType } from "../../queries/footer";
import { NavigationType } from "../../queries/navigation";
import { PageType } from "../../queries/page";
import { SitemapItemType } from "../../queries/sitemap";
import { Footer } from "../Footer/Footer";
import { Nav } from "../Nav/Nav";
import { PageBody } from "./PageBody";
import { useRouter } from "next/dist/client/router";
import { usePathname } from "next/navigation";
import React from "react";

export type PageProps = {
  isPreviewMode: boolean;
  navigation: NavigationType;
  page: PageType;
  footer: FooterType;
  config: ConfigType;
  sitemapItem?: SitemapItemType;
  locked?: boolean;
};

export const Page = ({
  isPreviewMode,
  navigation,
  page,
  footer,
  config,
  sitemapItem,
  locked,
}: PageProps) => {
  const router = useRouter();
  const pagePath = usePathname() || "";

  // set active state
  const navItems = navigation?.items?.map((item) => ({
    ...item,
    current:
      pagePath === "/"
        ? item.href === "/"
        : pagePath.startsWith(item.href || "") && item.href !== "/",
    children: item.children?.map((subitem) => ({
      ...subitem,
      current: pagePath === subitem.href,
    })),
  }));

  return (
    <SiteContext.Provider
      value={{
        config,
      }}
    >
      <PageContext.Provider
        value={{
          isPreviewMode,
          sitemapItem: sitemapItem || ({} as SitemapItemType),
          language: router.locale as LanguageType,
          breadcrumb: page?.breadcrumb,
        }}
      >
        <Seo page={page} config={config} isPreviewMode={isPreviewMode} />

        {page && navigation && !isPreviewMode && (
          <Nav
            items={page.hideNav === true ? [] : navItems}
            buttons={page.hideNav === true ? [] : navigation.buttons}
          />
        )}

        <PageBody {...page} />

        {isPreviewMode && pagePath !== "/preview" && (
          <div className="text-md fixed top-4 right-4 z-50 flex gap-1 text-white">
            <PreviewButton pagePath={pagePath} />
          </div>
        )}

        {locked && !isPreviewMode && <PageLock />}

        {page && footer && !isPreviewMode && (
          <Footer
            links={page.hideFooter === true ? [] : footer.links}
            socials={page.hideFooter === true ? [] : footer.socials}
            copyright={footer.copyright}
            legal={footer.legal}
            legalLinks={footer.legalLinks}
          />
        )}
      </PageContext.Provider>
    </SiteContext.Provider>
  );
};
