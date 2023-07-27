import {
  defaultBlockGroups,
  defaultBlockTheme,
} from "../../components/block/block.schema";
import { defaultTextTheme } from "../../components/text/text.schema";
import { defaultTitleTheme } from "../../components/title/title.schema";
import { capitalize } from "../../helpers/utils/string";
import { defaultBlockTools } from "../../studio/schemas/objects/tools";
import { referenceFilterCurrentLanguage } from "../../studio/utils/language/reference-filter-current-language";
import { RESOURCE_SCHEMAS } from "../../types.sanity";
import { PenFilm } from "@vectopus/atlas-icons-react";
import React from "react";
import { defineField, defineType } from "sanity";

const schema = defineType({
  name: "block.block13",
  title: "Related resources",
  type: "object",
  icon: () => <PenFilm weight="thin" />,
  description:
    "Feed of 4 automatically loaded resources (like blogs or events) in a row",
  preview: {
    select: {
      title: "title",
    },
    prepare({ title = "Related resources" }: any) {
      return {
        title: title,
      };
    },
  },
  groups: defaultBlockGroups,
  fields: [
    ...defaultBlockTools,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "portabletext.simple",
      group: "content",
    }),
    defineField({
      name: "filter",
      title: "Filter",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "types",
          title: "Types",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: Object.keys(RESOURCE_SCHEMAS).map((key) => {
              return {
                title: capitalize(key.replace("page.", "")),
                value: key,
              };
            }),
          },
        }),
        defineField({
          name: "tags",
          title: "Tags",
          type: "array",
          of: [
            {
              type: "reference",
              to: [{ type: "page.tag" }],
              options: {
                filter: referenceFilterCurrentLanguage,
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "object",
      group: "theme",
      fields: [
        defaultBlockTheme,
        defaultTitleTheme,
        defaultTextTheme,
        defineField({
          name: "card",
          title: "Card",
          type: "styles",
          options: {
            fields: [
              {
                name: "title",
                type: "color",
              },
              {
                name: "text",
                type: "color",
              },
            ],
          },
        }),
      ],
    }),
  ],
});

export default schema;
