import { SPACE_OPTIONS } from "../../components/block/spacing.options";
import {
  TITLE_FONT_OPTIONS,
  TITLE_WEIGHT_OPTIONS,
} from "../../components/block/title.options";
import { optionsToList } from "../../studio/utils/fields/optionsToList";
import { HEADING_LEVELS } from "../../types";
import {
  BACKGROUND_COLOR_OPTIONS,
  TITLE_COLOR_OPTIONS,
  TITLE_SIZE_OPTIONS,
  INTRO_COLOR_OPTIONS,
  INTRO_SIZE_OPTIONS,
  ALIGN_OPTIONS,
} from "./block4.options";
import { EllipsisVerticalIcon } from "@sanity/icons";
import { AlignCenter } from "@vectopus/atlas-icons-react";
import React from "react";
import { defineField, defineType } from "sanity";

const schema = defineType({
  name: "block.block4",
  title: "Default content",
  type: "object",
  icon: () => <AlignCenter weight="thin" />,
  description: "Basic title, intro, buttons and image block",
  preview: {
    select: {
      title: "title",
      image: "image",
    },
    prepare({ title = "Block 4", image }: any) {
      return {
        title: title,
        media: image || <AlignCenter weight="thin" />,
      };
    },
  },
  groups: [
    {
      name: "content",
      title: "Content",
      default: true,
    },
    {
      name: "theme",
      title: "Theme",
    },
    {
      name: "tools",
      title: " ",
      icon: EllipsisVerticalIcon,
    },
  ],
  fields: [
    defineField({
      name: "preset",
      title: "Preset",
      type: "preset",
      group: "tools",
    }),
    defineField({
      name: "copyPaste",
      title: "Copy Paste",
      type: "copyPaste",
      group: "tools",
    }),

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
      name: "image",
      title: "Image",
      type: "image",
      group: "content",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "buttons",
      title: "Buttons",
      type: "buttongroup",
      group: "content",
    }),

    defineField({
      name: "theme",
      title: "Theme",
      type: "object",
      group: "theme",
      fields: [
        defineField({
          name: "block",
          title: "Block",
          type: "styles",
          options: {
            fields: [
              {
                name: "space",
                title: "Space",
                type: "space",
                options: {
                  list: optionsToList(SPACE_OPTIONS),
                },
              },
              {
                name: "background",
                type: "color",
                options: {
                  colors: BACKGROUND_COLOR_OPTIONS,
                },
              },
              {
                name: "align",
                type: "select",
                options: {
                  list: optionsToList(ALIGN_OPTIONS),
                },
              },
            ],
          },
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "styles",
          options: {
            fields: [
              {
                name: "size",
                type: "select",
                options: {
                  list: optionsToList(TITLE_SIZE_OPTIONS),
                },
              },
              {
                name: "weight",
                type: "select",
                options: {
                  list: optionsToList(TITLE_WEIGHT_OPTIONS),
                },
              },
              {
                name: "font",
                type: "select",
                options: {
                  list: optionsToList(TITLE_FONT_OPTIONS),
                },
              },
              {
                name: "level",
                type: "select",
                options: {
                  list: optionsToList(HEADING_LEVELS),
                },
              },
              {
                name: "color",
                type: "color",
                options: {
                  colors: TITLE_COLOR_OPTIONS,
                },
              },
            ],
          },
        }),

        defineField({
          name: "intro",
          title: "Intro",
          type: "styles",
          options: {
            fields: [
              {
                name: "color",
                type: "color",
                options: {
                  colors: INTRO_COLOR_OPTIONS,
                },
              },
              {
                name: "size",
                type: "select",
                options: {
                  list: optionsToList(INTRO_SIZE_OPTIONS),
                },
              },
            ],
          },
        }),
      ],
    }),
  ],
});

export default schema;
