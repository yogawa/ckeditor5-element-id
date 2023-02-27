import Command from "@ckeditor/ckeditor5-core/src/command";
import findAttributeRange from "@ckeditor/ckeditor5-typing/src/utils/findattributerange";
import getRangeText from "./utils.js";
import { toMap } from "@ckeditor/ckeditor5-utils";

export default class ElementIdCommand extends Command {
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const firstRange = selection.getFirstRange();
    const parent = selection.anchor.parent;

    console.log('selection', selection);

    if (firstRange.isCollapsed) {
      console.log('if #1');
      if (parent.hasAttribute("customId")) {
        console.log('if #2');
        const attributeValue = parent.getAttribute("customId");

        const abbreviationRange = findAttributeRange(
          selection.getFirstPosition(),
          "customId",
          attributeValue,
          model
        );

        this.value = {
          abbr: getRangeText(abbreviationRange),
          title: attributeValue,
          range: abbreviationRange,
        };
      } else {
        console.log('else #2')
        const attributeValue = selection.getSelectedElement();
        console.log(attributeValue);

        const abbreviationRange = findAttributeRange(
          selection.getFirstPosition(),
          "customId",
          attributeValue,
          model
        );

        console.log('abbreviationRange', abbreviationRange.start.parent._attrs.get('htmlAttributes'));
        const htmlAttributes = abbreviationRange.start.parent._attrs.get('htmlAttributes');
        if (htmlAttributes){
          if (htmlAttributes.attributes.hasOwnProperty('id')){
            console.log('has property id', htmlAttributes.attributes);
            this.value = {
              title: htmlAttributes.attributes.id,
            };
          } else {
            this.value = {
              title: null,
            };
          }
        }

      }
    } else {
      console.log('else #1');
      if (parent.hasAttribute("customId")) {
        console.log('if #2');
        const attributeValue = parent.getAttribute("customId");

        const abbreviationRange = findAttributeRange(
          selection.getFirstPosition(),
          "customId",
          attributeValue,
          model
        );

        if (abbreviationRange.containsRange(firstRange, true)) {
          console.log('if #3');
          this.value = {
            abbr: getRangeText(firstRange),
            title: attributeValue,
            range: firstRange,
          };
        } else {
          console.log('else #3');
          this.value = {
            title: attributeValue,
          };
        }
      } else {
        console.log('else #2');
        this.value = null;
      }
    }

    this.isEnabled = model.schema.checkAttributeInSelection(
      selection,
      "customId"
    );
  }

  execute({ abbr, title }) {
    const model = this.editor.model;
    const selection = model.document.selection;

    const parent = selection.anchor.parent;

    model.change((writer) => {
      writer.setAttribute("customId", title, parent);

      if (selection.isCollapsed) {
        console.log('if #1');
        if (this.value) {
          console.log('if #2');
          const { end: positionAfter } = model.insertContent(
            writer.createText(abbr, { abbreviation: title }),
            this.value.range
          );
          writer.setSelection(positionAfter);
        }
        else if (abbr !== "") {
          console.log('else if #2');
          const firstPosition = selection.getFirstPosition();

          const attributes = toMap(selection.getAttributes());

          attributes.set("abbreviation", title);

          const { end: positionAfter } = model.insertContent(
            writer.createText(abbr, attributes),
            firstPosition
          );

          writer.setSelection(positionAfter);
        }

        writer.removeSelectionAttribute("abbreviation");
      } else {
        console.log('else #1');
        const ranges = model.schema.getValidRanges(
          selection.getRanges(),
          "abbreviation"
        );

        for (const range of ranges) {
          writer.setAttribute("abbreviation", title, range);
        }
      }
    });
  }
}
