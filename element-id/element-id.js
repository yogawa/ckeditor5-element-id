import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ElementIdEditing from "./element-id.editing";
import ElementIdUi from "./element-id.ui";

export default class ElementId extends Plugin {
  static get requires() {
    return [ElementIdEditing, ElementIdUi];
  }
}
