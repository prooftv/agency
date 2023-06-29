import { Block2Props } from "../../blocks/block2/Block2";
import { GenericBlockProps } from "../../types";
import { BlockSchemaName } from "../../types.sanity";
import BlockErrorBoundary from "./BlockErrorBoundary";
import { LazyLoadInView } from "./LazyLoadInView";
import React, { ComponentType } from "react";
import { Suspense, lazy } from "react";

const Block2 = lazy<ComponentType<Block2Props>>(
  () => import(/* webpackChunkName: "Block2" */ "../../blocks/block2/Block2")
);

export type BlockBuilderProps = {
  items: GenericBlockProps[];
};

// Sections that need to be loaded before network idle or inview
// It won't load if you don't add it here when for instance a block is position: fixed.
const NON_LAZY_LOAD_SECTIONS: BlockSchemaName[] = [];
const INITIAL_SECTIONS_TO_LOAD: number = 2;
const INVIEW_LOAD_ONLY_SECTIONS: BlockSchemaName[] = [];

export const BlockBuilder = ({ items }: BlockBuilderProps) => {
  return (
    <main>
      {items?.map((item, i) => (
        <Suspense fallback={``} key={item._key}>
          <BlockErrorBoundary>
            <LazyLoadInView
              // show essential sections immediately
              enabled={
                i > INITIAL_SECTIONS_TO_LOAD &&
                NON_LAZY_LOAD_SECTIONS.indexOf(item._type) === -1
              }
              // load non essential sections after network idle
              // and heavy non essential sections only when in view
              networkIdle={INVIEW_LOAD_ONLY_SECTIONS.indexOf(item._type) === -1}
              background={item.theme?.background}
              block={item._type}
              id={item._key}
            >
              {/* all blocks */}

              {item._type === "block.block2" && (
                <Block2 {...(item as Block2Props)} />
              )}
            </LazyLoadInView>
          </BlockErrorBoundary>
        </Suspense>
      ))}
    </main>
  );
};

export const BlockBuilderMemo = React.memo(BlockBuilder);
