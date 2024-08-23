import { Show, createSignal, onMount } from "solid-js";
import "./Editor.css";
import { setStrategyCode, strategyCode } from "./EditorStore";
import { Button } from "./ui/button";

export default function Editor() {

  let editor: any = null;

  const [isLoading, setIsLoading] = createSignal(true);
  const [isFullscreen, setIsFullscreen] = createSignal(false);

  { /* FIX: search (Ctrl+F) throws Error in application :| */ }
  onMount(async () => {
    const ace = await import("brace");
    const modeJavascript = await import('brace/mode/javascript');
    const themeMonokai = await import('brace/theme/monokai');
    editor = ace.edit('editor');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme('ace/theme/monokai');

    const langTools = await import('brace/ext/language_tools');
    editor.setOption("enableBasicAutocompletion", true);
    editor.setOption("enableLiveAutocompletion", true);
    // editor.setOption("enableSnippets", true);

    editor.setFontSize(18);
    editor.setValue(strategyCode.value);
    editor.on("beforeEndOperation", function(e: any) {
      if (editor.curOp.docChanged) {
        setStrategyCode({ value: editor.getValue() });
      }
    });

    editor.resize();
    setIsLoading(false);
  });

  return (
    <>
      <Show when={isLoading()}>
        <div role="status" class="flex items-center w-full h-full justify-center bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
          <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </Show>

      { /* FIX: fullscreen has limited lines in editor and overlap with elements underhood */}
      <div class={isFullscreen() ? "editor-container-fullscreen" : "editor-container"}>
        <div id="editor"></div>
      </div>
      <Button class="absolute bottom-8 right-8 bg-gray-100 z-10"
        variant="outline"
        onClick={() => setIsFullscreen((val) => { editor.resize(); return !val })}>Fullscreen</Button>
    </>
  );
}
