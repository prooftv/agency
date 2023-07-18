const PicoSanity = require("picosanity");
const fs = require("fs").promises;

const client = new PicoSanity({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "development",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
});

export type GroqThemeType = {
  colors: { name: string; value: string }[];
  fonts: { name: string; value: string }[];
  fontSizes: {
    name: string;
    size: string;
    lineHeight?: string;
    letterSpacing?: string;
    fontWeight?: string;
  }[];
  fontWeights: { name: string; value: string }[];
  stylesheets: string[];
};

export type ThemeType = {
  colors: Record<string, string>;
  fonts: Record<string, string[]>;
  fontSizes: Record<
    string,
    | [
        string,
        {
          lineHeight?: string;
          letterSpacing?: string;
          fontWeight?: string;
        },
      ]
    | string
  >;
  fontWeights: Record<string, number>;
  stylesheets: string;
  safelist: string[];
};

/**
 * Get published theme from Sanity config.theme
 */

export async function getTheme(): Promise<ThemeType> {
  const theme: GroqThemeType = await client.fetch(`*[_id == "config_theme"][0] {
    colors[] { name, value },
    fonts[] { name, value },
    fontSizes[] { name, size, lineHeight, letterSpacing, fontWeight },
    fontWeights[] { name, value },
    "stylesheets": stylesheets[] { value }.value,
  }`);

  const colors = formatColors(theme.colors) || {};
  const fonts = formatFonts(theme.fonts) || {};
  const fontWeights = formatFontWeights(theme.fontWeights) || {};
  const fontSizes = formatFontSizes(theme.fontSizes) || [];
  const safelist = formatSafelist(colors, fonts, fontSizes, fontWeights) || [];
  const stylesheets = `/* This file is automatically generated. */

  ${theme.stylesheets?.join("\n\n")}
  `;

  return { colors, fonts, fontWeights, fontSizes, safelist, stylesheets };
}

/**
 * Format colours
 */

export function formatColors(colors: { name: string; value: string }[]) {
  const formattedColors = colors?.filter(Boolean).reduce((acc, color) => {
    const { name, value } = color;
    const formattedName = name.replace(/ /g, "-").toLowerCase();
    acc[formattedName] = value;
    return acc;
  }, {} as ThemeType["colors"]);
  return formattedColors;
}

/**
 * Format fonts
 */

export function formatFonts(fonts: { name: string; value: string }[]) {
  const formattedFonts = fonts?.filter(Boolean).reduce((acc, font) => {
    const { name, value } = font;
    const formattedName = name.replace(/ /g, "-").toLowerCase();
    acc[formattedName] = value
      .replace(/"/g, "")
      .replace(/'/g, "")
      .split(",")
      .map((font) => font.trim());
    return acc;
  }, {} as Record<string, string[]>);
  return formattedFonts;
}

/**
 * Format font weights
 */

export function formatFontWeights(weights: { name: string; value: string }[]) {
  const formattedFontWeights = weights
    ?.filter(Boolean)
    .reduce((acc, weight) => {
      console.log(weight);
      const { name, value } = weight;
      const formattedName = name.replace(/ /g, "-").toLowerCase();
      acc[formattedName] = +value
        .toString()
        .replace(/"/g, "")
        .replace(/'/g, "")
        .trim();
      return acc;
    }, {} as ThemeType["fontWeights"]);
  return formattedFontWeights;
}

/**
 * Format font sizes with lineheight, letter spacing and font weight
 * e.g
 *
 * ['1.5rem', {
 *  lineHeight: '2rem',
 *  letterSpacing: '-0.01em',
 *  fontWeight: '500',
 * }],
 */

export function formatFontSizes(
  fontSizes: GroqThemeType["fontSizes"],
): ThemeType["fontSizes"] {
  const formattedFontSizes = fontSizes?.reduce((acc, fontSize) => {
    const { name, size, lineHeight, letterSpacing, fontWeight } = fontSize;
    const formattedName = name.replace(/ /g, "-").toLowerCase();

    if (!lineHeight && !letterSpacing && !fontWeight) {
      return { ...acc, [formattedName]: size };
    }

    const obj: ThemeType["fontSizes"][0][1] = {};
    if (lineHeight) obj["lineHeight"] = lineHeight;
    if (letterSpacing) obj["letterSpacing"] = letterSpacing;
    if (fontWeight) obj["fontWeight"] = fontWeight;

    acc[formattedName] = [size, obj];

    return acc;
  }, {} as ThemeType["fontSizes"]);

  return formattedFontSizes;
}

/**
 * format safelist of colours and fonts
 * e.g safelist: ["bg-primary", "text-primary", "font-primary"]
 */

export function formatSafelist(
  colors: ThemeType["colors"],
  fonts: ThemeType["fonts"],
  fontSizes: ThemeType["fontSizes"],
  fontWeights: ThemeType["fontWeights"],
) {
  function clean(str: string) {
    return str.replace(/ /g, "-").toLowerCase();
  }

  const safelist = [
    ...Object.keys(colors).map((color) => `bg-${clean(color)}`),
    ...Object.keys(colors).map((color) => `text-${clean(color)}`),
    ...Object.keys(colors).map((color) => `border-${clean(color)}`),
    ...Object.keys(colors).map((color) => `divide-${clean(color)}`),
    ...Object.keys(fonts).map((font) => `font-${clean(font)}`),
    ...Object.keys(fontWeights).map((weight) => `font-${clean(weight)}`),
    ...Object.keys(fontSizes).map((size) => `text-${clean(size)}`),
  ];

  return safelist;
}

export default async function generateTheme() {
  const theme = await getTheme();

  await fs.writeFile(
    `${__dirname}/../../_theme.ts`,
    `export default ${JSON.stringify(theme, null, 2)}`,
  );

  // write stylesheets to file
  await fs.writeFile(`${__dirname}/../../public/_theme.css`, theme.stylesheets);
}

generateTheme();
