# Engine!

An Agency Starter framework using Sanity & NextJS.

A page builder with a no code experience
The flexibility to change site structure
40 unique blocks pre-configured to look awesome responsively

Example Website:
https://sgw-template-saas-1.vercel.app/

## In CMS theming
https://github.com/Mawla/Agency-Starter-Framework/assets/1926968/6ef5fa6d-1e8c-4258-8124-92f4024d4563

:

```
> yarn dev # next.js localhost:3000
> yarn cms # sanity localhost:3333
> yarn storybook
```

Get started

- `yarn dev` runs next.js
- `yarn cms` runs sanity
- `yarn storybook` runs storybook
- `yarn test` runs tests

- `yarn create-page` runs the cli to add a page
- `yarn create-block` runs the cli to create a block

See /docs for some more information.

## App flow

```mermaid
graph TD
    SCHEMAS["Sanity schemas<br>/studio"]-->CMS
    CMS[(Sanity CMS)]-->|single catch all route|DATA{"[...slug.tsx] <br>getStaticProps"}
    PREVIEW_MODE((live preview? fa:fa-spinner))--->CMS

    DATA -->|"get sitemap<br>(all routes)"| QUERY_SITEMAP[sitemap.ts]-->CATCH_ALL_RENDER
    DATA -->|"get page content<br>(all blocks)"| QUERY_PAGE[page.ts]-->CATCH_ALL_RENDER
    DATA -->|get config| QUERY_CONFIG[config.ts]-->CATCH_ALL_RENDER
    DATA -->|get navigation| QUERY_NAV[navigation.ts] -->CATCH_ALL_RENDER
    DATA -->|get footer| QUERY_FOOTER[footer.ts] -->CATCH_ALL_RENDER

    CATCH_ALL_RENDER{"[...slug.tsx]"} -->RENDER
    CATCH_ALL_RENDER-->PREVIEW_MODE

    RENDER -->RENDER_BLOCKS

    RENDER_BLOCKS[BlockBuilder.tsx]-->BLOCK

    BLOCK[Block.tsx<br>block.schema.tsx<br>block.query.tsx<br>block.test.tsx<br>block.stories.tsx<br>block.options.ts]-->PAGE

    PAGE{"<br>BROWSER<br>…"}
```

...
