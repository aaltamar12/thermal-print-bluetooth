"use client";
import "./globals.css";
import { conectar, printText, conectarDispositivo, printIos } from "../app/helpers/printHelper";
import { useEffect, useRef, useState } from "react";
import { Bluetooth, Print, Save } from "@mui/icons-material";

import { Editor } from "@tinymce/tinymce-react";
import CustomDropdown from "./components/ui/Dropdown";

export default function Index({ children }) {
  const [printer, setPrint] = useState();
  const [value, setValue] = useState();

  const savedTexts = [{
    name: "Envios", value: `<h3><strong>REMITENTE</strong></h3>
  <p>Nadiuska Quintero</p>
  <p>C.C:</p>
  <p>Cel:&nbsp;</p>
  <p>&nbsp;</p>
  <h3><strong>DESTINATARIO</strong></h3>
  <p>Nombre: </p>
  <p>C.C:</p>
  <p>Cel:&nbsp;</p>
  <p>Direccion:</p>
  <p>Ciudad:</p>` }]

  const connect = async () => {
    setPrint(await conectarDispositivo());
  };

  const saveText = async (text) => {
    //Abrir modal Nombre
    //Guardar nombre y valor en local storage o alternativa app ios
  }

  const loadText = (text) => {
    setValue(text);
  }

  const editorRef = useRef(null);

  return (
    <div className="flex flex-col justify-center items-center content-center h-screen bg-gray-300 gap-5 text-white">
      <h1 className="text-4xl text-gray-600">Imprimir</h1>


      <div className=" flex flex-col bg-white text-black rounded-lg gap-4 w-full p-5">
        <CustomDropdown
          key={1} // Asegúrate de proporcionar una clave única para cada elemento
          options={savedTexts}
          labelButton="Elige una plantilla"
          ariaLabel="Saved dropdown"
          height={"h-8"}
          width={"w-52"}
          onSelectValue={(optionSelected) => {
            loadText(optionSelected)
          }
          }
        />
        <Editor
          value={value}
          apiKey="x2j749rxxjwjdlo62rhbo5st7pohazyl5ikmqe7dvuy79ukw"
          onInit={(evt, editor) => (editorRef.current = editor)}
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
            await printIos(printer, value);
          }}
          className="bg-white rounded-lg h-[70px] w-full"
        >
          <Print />
        </button>

        <button
          onClick={async () => {
            await saveText(value);
          }}
          className="bg-white rounded-lg h-[70px] w-full"
        >
          <Save />
        </button>
      </div>
    </div>
  );
}
