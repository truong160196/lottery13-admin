import React from "react";
import EnhancedPageWrapper from "containers/EnhancedPageWrapper";
import { Input } from "antd";

import MyUploadAdapter from "./MyUploadAdapter";
import "./ckditor_style.scss";

const { TextArea } = Input;

class CkEditorEditor extends EnhancedPageWrapper {
  componentDidMount() {
    try {
      ClassicEditor.create(document.querySelector("#editor"), {
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "fontColor",
            "fontSize",
            "fontFamily",
            "fontBackgroundColor",
            "highlight",
            "link",
            "alignment",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
            "|",
            "imageUpload",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "codeBlock",
            "htmlEmbed",
            "pageBreak",
            "specialCharacters",
            "restrictedEditingException",
            "code",
            "|",
            "undo",
            "redo",
          ],
          shouldNotGroupWhenFull: true,
        },
        language: "vi",
        image: {
          styles: ["alignLeft", "alignCenter", "alignRight"],
          resizeOptions: [
            {
              name: "resizeImage:original",
              label: "Original",
              value: null,
            },
            {
              name: "resizeImage:50",
              label: "50%",
              value: "50",
            },
            {
              name: "resizeImage:75",
              label: "75%",
              value: "75",
            },
          ],
          toolbar: [
            "imageTextAlternative",
            "|",
            "imageStyle:alignLeft",
            "imageStyle:alignCenter",
            "imageStyle:alignRight",
            "linkImage",
            "|",
            "resizeImage",
          ],
        },
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
        mediaEmbed: {
          previewsInData: true,
        },
        licenseKey: "",
      })
        .then((editor) => {
          const EditorState = editor;
          EditorState.plugins.get("FileRepository").createUploadAdapter = (
            loader
          ) => {
            return new MyUploadAdapter(loader);
          };
          window.editor = EditorState;
        })
        .catch((error) => {
          console.error("Oops, something went wrong!");
          console.error(
            "Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:"
          );
          console.warn("Build id: 5ycdtss2ynw4-x9jy416l3nk4");
          console.error(error);
        });
    } catch (err) {
      console.error(err);
    }
  }

  componentDidUpdate(props) {
    if (
      props.data &&
      window.editor &&
      typeof window.editor.getData === "function" &&
      typeof window.editor.setData === "function" &&
      !window.editor.getData()
    ) {
      window.editor.setData(props.data);
    }
  }

  componentWillUnmount() {
    if (typeof window?.editor?.setData === "function") {
      window.editor.setData("");
    }
  }

  render() {
    const { data } = this.props;
    return <textarea id="editor">{data}</textarea>;
  }
}

export default CkEditorEditor;
