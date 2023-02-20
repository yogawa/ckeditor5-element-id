import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import {
  ContextualBalloon,
  clickOutsideHandler
} from "@ckeditor/ckeditor5-ui";
import ElementIdView from "./element-id.view";
import "../styles.css";
import { first } from "@ckeditor/ckeditor5-utils";

export default class ElementIdUi extends Plugin {
  static get requires() {
    return [ContextualBalloon, Notification];
  }

  init() {
    const editor = this.editor;

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add("elementId", () => {
      const button = new ButtonView();

      button.label = "Element ID";
      button.tooltip = true;
      button.withText = true;

      // Show the UI on button click.
      this.listenTo(button, "execute", () => {
        this._showUI();
      });

      return button;
    });

    editor.commands.get("enter").on("afterExecute", () => {
      const block = first(editor.model.document.selection.getSelectedBlocks());
      editor.model.change((writer) => {
        writer.removeAttribute("customId", block);
      });
    });
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new ElementIdView(editor.locale);

    // Execute the command after clicking the "Save" button.
    this.listenTo(formView, "submit", () => {
      const re = new RegExp("^[a-zA-Z0-9-_]+$", "gi");
      const notification = editor.plugins.get("Notification");

      if (
        !formView.titleInputView.fieldView.element.value ||
        formView.titleInputView.fieldView.element.value.trim().length == 0
      ) {
        notification.showWarning("Element id cannot be blank");
        return;
      }

      if (!re.test(formView.titleInputView.fieldView.element.value)) {
        notification.showWarning("Invalid element id");
        return;
      }

      // Grab values from the abbreviation and title input fields.
      const value = {
        // abbr: formView.abbrInputView.fieldView.element.value,
        title: formView.titleInputView.fieldView.element.value,
      };
      editor.execute("addElementId", value);

      // Hide the form view after submit.
      this._hideUI();
    });

    // Hide the form view after clicking the "Cancel" button.
    this.listenTo(formView, "cancel", () => {
      this._hideUI();
    });

    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI(),
    });

    return formView;
  }

  _showUI() {
    // Check the value of the command.
    const commandValue = this.editor.commands.get("addElementId").value;
    console.log("commandValue", commandValue);

    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData(),
    });

    // Fill the form using the state (value) of the command.
    if (commandValue) {
      this.formView.titleInputView.fieldView.value = commandValue.title;
    } else {
      this.formView.titleInputView.fieldView.value = "";
    }

    this.formView.focus();
  }

  _hideUI() {
    // Clear the input field values and reset the form.
    this.formView.titleInputView.fieldView.value = "";
    this.formView.element.reset();

    this._balloon.remove(this.formView);

    // Focus the editing view after inserting the abbreviation so the user can start typing the content
    // right away and keep the editor focused.
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM
    target = () =>
      view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

    return {
      target,
    };
  }
}
