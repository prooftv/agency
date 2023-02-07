import { Link } from "../../components/buttons/Link";
import { IconLoaderProps } from "../../components/images/IconLoader";
import { PageContext } from "../../context/PageContext";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { NavigationProps } from "./Navigation";
import * as RadixNavigationMenu from "@radix-ui/react-navigation-menu";
import cx from "classnames";
import React, { ComponentType, lazy, useContext, useRef } from "react";

const IconLoader = lazy<ComponentType<IconLoaderProps>>(
  () =>
    import(
      /* webpackChunkName: "IconLoader" */ "../../components/images/IconLoader"
    ),
);

export type TopNavProps = {
  showNav?: boolean;
  onHamburgerClick?: () => void;
  navHeight?: number;
} & NavigationProps;

export const TopNav = React.forwardRef<HTMLDivElement, TopNavProps>(
  ({ items, buttons, showNav = true, onHamburgerClick, navHeight }, navRef) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { language } = useContext(PageContext);

    return (
      <div ref={wrapperRef} tabIndex={-1}>
        <div
          className={cx(
            "fixed z-50 top-0 left-0 right-0",
            "w-full",
            "transform transition-transform duration-500",
            "bg-white/90 backdrop-blur-[25px]",
            {
              ["-translate-y-full ease-in-out-cubic"]: !showNav,
            },
          )}
          ref={navRef}
        >
          <RadixNavigationMenu.Root
            className={cx(
              "radix-topnav flex gap-6 items-center",
              "py-2 md:py-3 lg:py-4",
              "max-w-outer mx-auto",
              "px-5 sm:px-8 lg:px-8 xl:px-8",
              "border-b border-b-neutral-200",
            )}
            role="navigation"
          >
            {/* logo */}
            <div className="flex-1 flex items-center">
              <Link
                href={`/${language}`}
                className="inline-block"
                aria-label="Homepage"
              >
                <Logo />
              </Link>
            </div>

            <div className="flex-1">
              {/* main menu */}
              {Boolean(items?.length) && (
                <RadixNavigationMenu.List className="hidden lg:flex justify-center gap-px">
                  {items?.map(
                    ({ label, href, children, current, language }) => {
                      const Element = Boolean(children?.length)
                        ? RadixNavigationMenu.Trigger
                        : "div";

                      return (
                        <RadixNavigationMenu.Item
                          key={label}
                          className="relative group"
                        >
                          <Element
                            className={cx(
                              "flex items-center gap-2",
                              "text-md text-neutral-700 rounded-xs",
                              "py-[6px] px-3",
                              "whitespace-nowrap",
                              "hover:bg-neutral-100 group-hover:bg-neutral-100 group-focus-within:bg-neutral-100",
                              {
                                ["bg-neutral-100 text-neutral-900"]:
                                  current ||
                                  Boolean(
                                    children?.filter(({ current }) =>
                                      Boolean(current),
                                    ).length,
                                  ),
                              },
                            )}
                          >
                            {href && (
                              <Link
                                href={href}
                                locale={language}
                                className="hover:underline underline-offset-4"
                              >
                                {label}
                              </Link>
                            )}

                            {Boolean(children?.length) && (
                              <IconLoader
                                icon="chevron"
                                className={cx(
                                  "w-4 h-4 text-inherit text-neutral-600",
                                  "hover:text-neutral-900 transition-colors duration-75",
                                  "group-hover:rotate-180 group-focus-within:rotate-180",
                                  "group-hover:text-neutral-600 group-focus-within:text-neutral-600",
                                )}
                              />
                            )}
                          </Element>

                          {Boolean(children?.length) && (
                            <noscript>
                              <ul>
                                {children?.map(({ label, href, language }) => (
                                  <li key={label}>
                                    {href && (
                                      <Link href={href} locale={language}>
                                        {label}
                                      </Link>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </noscript>
                          )}

                          {/* submenu */}
                          {Boolean(children?.length) && (
                            <RadixNavigationMenu.Content
                              className={cx(
                                "w-[200px]",
                                "absolute bottom-0 left-1/2",
                                "translate-y-full -translate-x-1/2",
                              )}
                            >
                              <RadixNavigationMenu.List
                                className={cx(
                                  "translate-y-2 p-1",
                                  "shadow-md",
                                  "bg-white border border-neutral-300 rounded-xs",
                                )}
                              >
                                {children?.map(
                                  ({ label, current, href, language }) => (
                                    <RadixNavigationMenu.Item key={label}>
                                      {href && (
                                        <Link
                                          href={href}
                                          locale={language}
                                          className={cx(
                                            "bg-white hover:bg-neutral-100 flex transition-colors",
                                            "text-neutral-500",
                                            "text-md",
                                            "p-3 rounded-2xs",
                                            {
                                              ["font-bold bg-neutral-100 hover:bg-neutral-100 text-neutral-600"]:
                                                current,
                                            },
                                          )}
                                        >
                                          {label}
                                        </Link>
                                      )}
                                    </RadixNavigationMenu.Item>
                                  ),
                                )}
                              </RadixNavigationMenu.List>
                            </RadixNavigationMenu.Content>
                          )}
                        </RadixNavigationMenu.Item>
                      );
                    },
                  )}
                </RadixNavigationMenu.List>
              )}
            </div>

            {/* buttons */}
            <div className="flex-1">
              <RadixNavigationMenu.List className="flex gap-2 xl:gap-4 items-center justify-end">
                {/* language */}
                <LanguageSwitch align="right" />

                {/* buttons */}
                {Boolean(buttons?.length) &&
                  buttons?.map((button) => (
                    <RadixNavigationMenu.Item
                      key={button.label}
                      className="hidden md:block"
                    >
                      {button.href && (
                        <Link
                          href={button.href}
                          locale={button.language}
                          className={cx(
                            "bg-neutral-100",
                            "hover:underline underline-offset-4",
                            "flex items-center gap-2",
                            "text-neutral-800 rounded-full text-md",
                            "py-[10px] pl-4 pr-3",
                            "whitespace-nowrap",
                          )}
                        >
                          <span>{button.label}</span>
                          <IconLoader
                            icon={button.icon}
                            className="inline text-current transform -translate-y-px w-4 h-4"
                          />
                        </Link>
                      )}
                    </RadixNavigationMenu.Item>
                  ))}

                {/* hamburger */}
                <RadixNavigationMenu.Item
                  className={cx("lg:hidden ml-2 sm:-mr-3", {
                    ["hidden"]:
                      !Boolean(items?.length) && !Boolean(buttons?.length),
                  })}
                >
                  <button
                    type="button"
                    aria-label="Open navigation"
                    onClick={onHamburgerClick}
                    className="flex"
                  >
                    <span className="w-6 h-6 block relative">
                      <IconLoader icon="menu" className="text-neutral-600" />
                      <span className="absolute -inset-2 bg-white opacity-0" />
                    </span>
                  </button>
                </RadixNavigationMenu.Item>
              </RadixNavigationMenu.List>
            </div>
          </RadixNavigationMenu.Root>
        </div>
      </div>
    );
  },
);
