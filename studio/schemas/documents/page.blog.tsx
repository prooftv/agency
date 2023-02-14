import { SchemaName } from "../../../types.sanity";
import { getStructurePath } from "../../utils/desk/get-structure-path";
import {
  AUTHOR_FIELD,
  DEFAULT_CONTENT_PAGE_PREVIEW,
  ORDER_PUBLISHED_DESC,
  pageBase,
  PARENT_FIELD,
  PUBLISHED_AT_FIELD,
  TAGS_FIELD,
} from "./page-fields";
import { InkPen } from "@vectopus/atlas-icons-react";
import React from "react";
import { defineType } from "sanity";

export const SCHEMA_NAME: SchemaName = "page.blog";

export default defineType({
  name: SCHEMA_NAME,
  title: "Blog",
  type: "document",
  orderings: [ORDER_PUBLISHED_DESC],
  preview: DEFAULT_CONTENT_PAGE_PREVIEW,
  icon: () => <InkPen weight="thin" size={20} />,
  initialValue: async (props: any, context: any) => {
    const client = context.getClient({ apiVersion: "vX" });
    const { language } = getStructurePath();

    const parentDocumentId = await client.fetch(
      `*[_id match "page_blogs__i18n_${language}"][0]._id`,
    );

    if (!parentDocumentId) return {};

    return {
      parent: { _type: "reference", _ref: parentDocumentId },
    };
  },
  groups: [...pageBase.groups],
  fields: [
    {
      ...PARENT_FIELD,
      to: [{ type: "page.blogs" }],
      options: {
        disableNew: true,
        filter: () => {
          const { language } = getStructurePath();
          return {
            filter: `language == $language`,
            params: { language },
          };
        },
      },
      group: ["meta"],
    },
    ...pageBase.fields.map((field) => {
      if (field.name === "hero") {
        return {
          ...field,
          options: {
            ...(field as any).options,
            filterType: /hero.resourcehero/,
          },
        };
      }
      return field;
    }),
    TAGS_FIELD,
    AUTHOR_FIELD,
    PUBLISHED_AT_FIELD,
  ],
});
