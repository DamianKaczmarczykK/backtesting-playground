import { onMount } from "solid-js";
import "./Editor.css";

export default function Editor(props) {

  const onEdit = (content: string) => props.onEdit(content);

  let editor: any;

  onMount(async () => {
    const ace = await import("brace");
    const modeJavascript = await import('brace/mode/javascript');
    const themeMonokai = await import('brace/theme/monokai');
    editor = ace.edit('editor');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme('ace/theme/monokai');

    // const langTools = await import('brace/ext/language_tools');
    // console.log(langTools);

    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });

    editor.setFontSize(24);
    editor.resize();
    editor.setValue("window['strategy'] = (index, data) => {\n\
    const currentCandle = data[index];\n\
    if (currentCandle.close < 30000.0) {\n\
    return 0.1;\n\
    } else if (currentCandle.close > 60000.0) {\n\
    return -0.1;\n\
    }\n\
    return 0.0;\n\
};");
    editor.on("beforeEndOperation", function(e: any) {
      if (editor.curOp.docChanged && editor.curOp.command.name == "insertstring") {
        onEdit(editor.getValue());
      }
    });
  });

  return (
    <div id="editor"></div>
  );
}
