"use client";
import "./globals.css";
import { conectar, printText } from "../app/helpers/printHelper";
import { useEffect, useRef, useState } from "react";
import { Bluetooth, Print } from "@mui/icons-material";
//import ReactQuill from "react-quill";
//import "react-quill/dist/quill.snow.css";
//import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Editor } from "@tinymce/tinymce-react";

export default function Index({ children }) {
  const [printer, setPrint] = useState();
  const [value, setValue] = useState();

  const connect = async () => {
    setPrint(await conectar());
  };

  useEffect(() => {
    console.log(value);
  }, [value]);

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <div className="flex flex-col justify-center items-center content-center h-screen bg-gray-300 gap-5 text-white">
      <h1 className="text-4xl text-gray-600">Imprimir</h1>
      <div className=" bg-white text-black rounded-lg w-full p-5">
        {/* <ReactQuill
          className="h-[80%]"
          theme="snow"
          value={value}
          onChange={setValue}
        /> */}

        {/* <CKEditor
          editor={ClassicEditor}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log(data);
            setValue(data);
          }}
        /> */}

        <Editor
          apiKey="x2j749rxxjwjdlo62rhbo5st7pohazyl5ikmqe7dvuy79ukw"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={value}
          onEditorChange={setValue}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
      </div>

      <div className="flex justify-center items-center gap-4 h-32 w-full p-5 text-gray-500">
        <button
          onClick={async () => {
            await connect();
          }}
          className="bg-white rounded-lg h-[70px] w-full flex justify-center items-center gap-2"
        >
          <Bluetooth /> <h1> Conectar</h1>
        </button>

        <button
          onClick={async () => {
            await printText(printer, value);
          }}
          className="bg-white rounded-lg h-[70px] w-full"
        >
          <Print />
        </button>
      </div>
    </div>
  );
}
