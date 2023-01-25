import { languages } from "../../languages";
import { useLanguageFilter } from "../utils/language/useLanguageFilter";
import { ComponentType, useEffect } from "react";

export const PageBuilder: ComponentType<any> = (props) => {
  const { renderItem, renderDefault } = props;

  const selectedLanguages = useLanguageFilter();

  return renderDefault({
    ...props,
    renderItem: (item: any) => {
      // If no language is selected, show all items with no language set
      if (selectedLanguages.length === 0) {
        if (!item.value.language || !item.value.language?.trim().length) {
          return renderItem(item);
        }
      }

      // If all languages are selected, show all items
      if (selectedLanguages.length === languages.length) {
        return renderItem(item);
      }

      // If the item has a language and it is selected, show the item
      if (selectedLanguages.includes(item.value.language)) {
        return renderItem(item);
      }

      return null;
    },
  });
};

/**
 * Wrapper around the item that responds to opening
 * and responds to clicks from the preview iframe
 */

export const PageBuilderItem: React.ComponentType<any> = (props) => {
  /**
   * When the form is opened: scroll preview iframe to element
   */

  useEffect(() => {
    if (!open) return;
    if (!props?.value?._key) return;

    // find iframe
    const previewIframe = window.document.querySelector(
      ".previewView iframe"
    ) as HTMLIFrameElement;
    if (!previewIframe?.contentWindow) return;

    // post message to iframe to scroll to module
    previewIframe.contentWindow.postMessage(
      { type: "preview-view-scroll-to-module", moduleKey: props.value._key },
      (import.meta as any).env.SANITY_STUDIO_PROJECT_PATH
    );
  }, [props.open, props.value?._key]);

  /**
   * When preview mode is clicked, open this form
   */

  useEffect(() => {
    if (!props.value?._key) return;

    function onMessage(e: MessageEvent) {
      if (
        e.data.type == "preview-studio-open-module-dialog" &&
        e.data.moduleKey === props.value?._key
      ) {
        const moduleFormOpenButton = document.querySelector(
          `[data-key="${e.data.moduleKey}"] [data-type="module-preview"]`
        ) as HTMLButtonElement;

        if (moduleFormOpenButton) {
          moduleFormOpenButton.click();
        }
      }
    }

    window.addEventListener("message", onMessage, false);
    () => window.removeEventListener("message", onMessage);
  }, [props.value?._key]);

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(0,0,0,.1)",
      }}
      data-type="module"
      data-key={props.value?._key}
    >
      {props.renderDefault(props)}
    </div>
  );
};

/**
 * Stylistic wrapper around the preview
 */

export const PageBuilderItemPreview: React.ComponentType<any> = (props) => (
  <div style={{ padding: "8px 0" }} data-type="module-preview">
    {props.renderDefault(props)}
  </div>
);