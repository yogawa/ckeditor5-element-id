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

    if (firstRange.isCollapsed) {
      if (parent.hasAttribute("customId")) {
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
        this.value = null;
      }
    } else {
      if (parent.hasAttribute("customId")) {
        const attributeValue = parent.getAttribute("customId");

        const abbreviationRange = findAttributeRange(
          selection.getFirstPosition(),
          "customId",
          attributeValue,
          model
        );

        if (abbreviationRange.containsRange(firstRange, true)) {
          this.value = {
            abbr: getRangeText(firstRange),
            title: attributeValue,
            range: firstRange,
          };
        } else {
          this.value = {
            title: attributeValue,
          };
        }
      } else {
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
        if (this.value) {
          const { end: positionAfter } = model.insertContent(
            writer.createText(abbr, { abbreviation: title }),
            this.value.range
          );
          writer.setSelection(positionAfter);
        }
        else if (abbr !== "") {
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
