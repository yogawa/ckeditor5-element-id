import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ElementIdCommand from "./element-id.command";

export default class ElementIdEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add(
      "addElementId",
      new ElementIdCommand(this.editor)
    );
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    // Extend the text node's schema to accept the abbreviation attribute.
    schema.extend("$text", {
      allowAttributes: ["customId"],
    });
  }
  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.attributeToAttribute({ model: "customId", view: "id" });
  }
}
