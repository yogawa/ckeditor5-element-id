import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import List from "@ckeditor/ckeditor5-list/src/list";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import CKEditorInspector from "@ckeditor/ckeditor5-inspector";
import Link from "@ckeditor/ckeditor5-link/src/link";
import AutoLink from "@ckeditor/ckeditor5-link/src/autolink";
import ElementId from "./element-id/element-id";
import { Notification } from "@ckeditor/ckeditor5-ui";
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing";
import GeneralHtmlSupport from "@ckeditor/ckeditor5-html-support/src/generalhtmlsupport";
import DecoupledEditor from "@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor";
// import Markdown from "@ckeditor/ckeditor5-markdown-gfm/src/markdown";
import GFMDataProcessor from "@ckeditor/ckeditor5-markdown-gfm/src/gfmdataprocessor";
// import * as showdown from './showdown';

function Markdown(editor) {
  editor.data.processor = new GFMDataProcessor(editor.editing.view.document);
  editor.data.processor.keepHtml("h2");
  editor.data.processor.keepHtml("p");
}

var theEditor;
ClassicEditor.create(document.querySelector("#editor"), {
  plugins: [
    Essentials,
    Bold,
    Italic,
    Heading,
    List,
    Paragraph,
    Link,
    AutoLink,
    ElementId,
    Notification,
    SourceEditing,
    GeneralHtmlSupport
  ],
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "numberedList",
    "bulletedList",
    "link",
    "|",
    "elementId",
    "sourceEditing",
  ],
  htmlSupport: {
    allow: [
      {
        name: /.*/,
        attributes: true,
        classes: true,
      },
    ],
  },
})
  .then((editor) => {
    // const toolbarContainer = document.querySelector("#toolbar-container");
    // toolbarContainer.appendChild(editor.ui.view.toolbar.element);

    console.log("Editor was initialized", editor);
    CKEditorInspector.attach(editor);

    // editor.on("change:isReadOnly", (evt, name, value, oldValue) => {
    //   if (value == true) {
    //     return (editor.data.processor = new MarkdownDataProcessor()); // editor.getData() in Markdown.
    //   }

    //   editor.data.processor = new HtmlDataProcessor(); // editor.getData() in HTML.
    // });

    editor.setData('<h1 id="coba">Test</h1>');
    theEditor = editor;
  })
  .catch((error) => {
    console.error(error.stack);
  });

document.querySelector("#check-btn").addEventListener("click", () => {
  console.log(theEditor.getData());
});
