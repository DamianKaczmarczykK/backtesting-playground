import { createSignal, onMount } from "solid-js";
import "./Editor.css";
import { setStrategyCode, strategyCode } from "./EditorStore";
import { Button } from "./ui/button";

export default function Editor() {

  let editor: any;

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
  });

  return (
    <div>
      { /* FIX: fullscreen has limited lines in editor and overlap with elements underhood */}
      <div class={isFullscreen() ? "editor-container-fullscreen" : "editor-container"}>
        <div id="editor"></div>
      </div>
      <Button class="absolute bottom-8 right-8 bg-gray-100"
        variant="outline"
        onClick={() => setIsFullscreen((val) => { editor.resize(); return !val })}>Fullscreen</Button>
    </div>
  );
}
