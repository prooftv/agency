import { getClient } from "../../helpers/sanity/server";
import { withSentryOptional } from "../../helpers/sentry/with-sentry-optional";
import { getURLForPath } from "../../helpers/sitemap/getURLForPath";
import { ConfigType } from "../../queries/config.query";
import { SitemapItemType, getSitemapQuery } from "../../queries/sitemap.query";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  res.setHeader("Cache-Control", "s-maxage=3600");
  res.setHeader("Content-Type", "application/xml");

  const domain: ConfigType["general"]["domain"] =
    (await getClient(false).fetch(
      '*[_type == "config.general"] { "domain": domain.en }[0].domain',
    )) || "";

  const pages: SitemapItemType[] = await getClient(false).fetch(
    getSitemapQuery(),
  );

  const uniqueItemsDict: Record<string, string> = {};

  const items: string[] = [...pages]
    .filter(Boolean)
    .map(({ path, _updatedAt, excludeFromSitemap, language }) => {
      if (excludeFromSitemap === true) return;
      if (!path) return;

      const url = getURLForPath(domain, path, language);
      if (uniqueItemsDict[url]) return;
      if (!uniqueItemsDict[url]) uniqueItemsDict[url] = url;

      return `<url>
  <loc>${url}</loc>
  <lastmod>${new Date(_updatedAt).toISOString()}</lastmod>
</url>`;
    })
    .filter(Boolean) as string[];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${items.join("\n")}
</urlset>
`;
  res.status(200).send(sitemap);
};

export default withSentryOptional(handler);
