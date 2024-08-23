import { onMount } from "solid-js";
import "./Editor.css";

export default function Editor(props: any) {

  const onEdit = (content: string) => props.onEdit(content);
  const defaultContent = () => props.defaultContent;

  let editor: any;

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

    editor.setFontSize(24);
    editor.resize();
    editor.setValue(defaultContent());
    editor.on("beforeEndOperation", function(e: any) {
      if (editor.curOp.docChanged) {
        onEdit(editor.getValue());
      }
    });
  });

  return (
    <div id="editor"></div>
  );
}
