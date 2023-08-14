import { WrapperProps } from "../../components/block/Wrapper";
import { BlockThemeType } from "../../components/block/block.options";
import { BreadcrumbProps } from "../../components/breadcrumb/Breadcrumb";
import Link from "../../components/buttons/Link";
import { DateDisplayProps } from "../../components/date/DateDisplay";
import { DecorationProps } from "../../components/decorations/Decoration";
import { ResponsiveImageProps } from "../../components/images/ResponsiveImage";
import { PortableTextProps } from "../../components/portabletext/PortableText";
import { SocialShareProps } from "../../components/social/SocialShare";
import { TagProps } from "../../components/tags/Tag";
import { joinList } from "../../helpers/utils/string";
import { useTranslation } from "../../hooks/useTranslation";
import { ImageType } from "../../types";
import cx from "classnames";
import React, { ComponentType, lazy } from "react";

const ResponsiveImage = lazy<ComponentType<ResponsiveImageProps>>(
  () =>
    import(
      /* webpackChunkName: "ResponsiveImage" */ "../../components/images/ResponsiveImage"
    ),
);

const Wrapper = lazy<ComponentType<WrapperProps>>(
  () =>
    import(/* webpackChunkName: "Wrapper" */ "../../components/block/Wrapper"),
);

const Tag = lazy<ComponentType<TagProps>>(
  () => import(/* webpackChunkName: "Tag" */ "../../components/tags/Tag"),
);

const PortableText = lazy<ComponentType<PortableTextProps>>(
  () =>
    import(
      /* webpackChunkName: "PortableText" */ "../../components/portabletext/PortableText"
    ),
);

const Breadcrumb = lazy<ComponentType<BreadcrumbProps>>(
  () =>
    import(
      /* webpackChunkName: "Breadcrumb" */ "../../components/breadcrumb/Breadcrumb"
    ),
);

const DateDisplay = lazy<ComponentType<DateDisplayProps>>(
  () =>
    import(
      /* webpackChunkName: "DateDisplay" */ "../../components/date/DateDisplay"
    ),
);

const SocialShare = lazy<ComponentType<SocialShareProps>>(
  () =>
    import(
      /* webpackChunkName: "SocialShare" */ "../../components/social/SocialShare"
    ),
);

export type Block14Props = {
  theme?: {
    block?: Omit<BlockThemeType, "align">;
  };
  decorations?: DecorationProps[];
  title?: string;
  body?: React.ReactNode;
  tags?: { title?: string; href?: string }[];
  authors?: { name: string; image?: ImageType }[];
  date?: string;
  startDate?: string;
  endDate?: string;
  relatedArticles?: {
    href: string;
    title?: string;
    image?: ImageType;
    startDate?: string;
    endDate?: string;
  }[];
};
export const Block14 = ({
  theme,
  decorations,
  title,
  body,
  tags,
  authors,
  date,
  relatedArticles,
  startDate,
  endDate,
}: Block14Props) => {
  return (
    <Wrapper
      theme={{
        ...theme?.block,
      }}
      decorations={decorations}
    >
      <main className="py-8 lg:py-16">
        <div className="grid grid-cols-12 px-4 mx-auto max-w-full gap-12">
          <aside
            className="hidden relative ml-auto lg:block col-span-1"
            aria-labelledby="sidebar-label"
          >
            <div className="sticky top-6 bg-black/[2%] p-2 rounded-lg border border-black/[8%]">
              <SocialShare title={title} direction="vertical" />
            </div>
          </aside>

          <article className="col-span-12 lg:col-span-11 xl:col-span-8">
            <header className="mb-4 lg:mb-6 not-format">
              <nav className="flex" aria-label="Breadcrumb">
                <Breadcrumb wrap />
              </nav>
              <div className="flex items-center my-4 md:my-6">
                <div className="flex gap-1 flex-wrap">
                  {Boolean(tags?.length) &&
                    tags?.map((tag) => (
                      <Tag key={tag.title} label={tag.title} href={tag.href} />
                    ))}
                </div>
              </div>

              <div className="py-4 border-t border-b border-black/10 text-sm text-black/90">
                <address className="flex not-italic">
                  {authors && Boolean(authors?.length) && (
                    <div className="mr-3 inline-flex">
                      {authors.map(
                        ({ image }) =>
                          image && (
                            <span
                              className={cx(
                                "w-10 aspect-square relative rounded-full overflow-hidden border -mr-1",
                              )}
                              key={image.src}
                            >
                              <ResponsiveImage {...image} fill />
                            </span>
                          ),
                      )}
                    </div>
                  )}

                  <div>
                    {authors && Boolean(authors?.length) && (
                      <span className="block font-semibold">
                        {joinList(authors.map((a) => a.name))}
                      </span>
                    )}
                    {date && (
                      <DateDisplay
                        datetime={date}
                        from={startDate}
                        to={endDate}
                      />
                    )}
                  </div>
                </address>
              </div>
            </header>

            {body && (
              <div className="format format-sm sm:format-base lg:format-lg">
                <PortableText content={body as any} />
              </div>
            )}

            <div className="lg:hidden mt-10">
              <SocialShare title={title} direction="horizontal" />
            </div>
          </article>

          <aside className="hidden xl:block col-span-3 relative">
            <div className="sticky top-6">
              {relatedArticles && Boolean(relatedArticles?.length) && (
                <div className="p-5 mb-6 font-medium rounded-lg border border-black/[5%] divide-y divide-gray-black/[5%] shadow text-black/90">
                  <h4 className="mb-4 text-sm font-bold uppercase">
                    {useTranslation("related_resources", "Related resources")}
                  </h4>

                  {relatedArticles.map(
                    ({ image, title, href, startDate, endDate }) => (
                      <Link href={href} className="flex py-4 group" key={title}>
                        {image && (
                          <div className="relative overflow-hidden shrink-0 mr-4 w-12 max-w-full h-12 rounded-lg">
                            <ResponsiveImage {...image} fill />
                          </div>
                        )}
                        <div>
                          <h5 className="font-semibold leading-tight group-hover:underline">
                            {title}
                          </h5>

                          {(startDate || endDate) && (
                            <DateDisplay
                              from={startDate}
                              to={endDate}
                              className="text-xs font-normal"
                            />
                          )}
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </Wrapper>
  );
};

export default React.memo(Block14);
