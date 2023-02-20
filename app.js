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
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';

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
    "sourceEditing"
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
    console.log("Editor was initialized", editor);
    CKEditorInspector.attach(editor);
  })
  .catch((error) => {
    console.error(error.stack);
  });
