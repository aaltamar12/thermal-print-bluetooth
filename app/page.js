"use client";
import "./globals.css";
import { conectarDispositivo, printIos } from "../app/helpers/printHelper";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "../public/logo.png";
import { Bluetooth, Print, Save } from "@mui/icons-material";

import { Editor } from "@tinymce/tinymce-react";
import CustomDropdown from "./components/ui/Dropdown";
import { setCookieNext, getCookieNext } from "./helpers/storageHelper";
import { newDialog } from "./helpers/capacitorHelper";

export default function Index({ children }) {
  const [printer, setPrint] = useState();
  const [value, setValue] = useState();
  const [templates, setTemplates] = useState([{
    name: "Envios", value: `<h3><strong>REMITENTE</strong></h3>
  <p>Nadiuska Quintero</p>
  <p>C.C: 1047044161</p>
  <p>Cel: 3012937141</p>
  <p>&nbsp;</p>
  <h3><strong>DESTINATARIO</strong></h3>
  <p>Nombre: </p>
  <p>C.C:&nbsp; </p>
  <p>Cel:&nbsp; </p>
  <p>Direccion:&nbsp; </p>
  <p>Ciudad:&nbsp; </p>` }]);

  const connect = async () => {
    setPrint(await conectarDispositivo());
  };

  const loadTemplates = async () => {
    try {
      const loadedTemplates = await getCookieNext("templates");
      loadedTemplates && setTemplates(JSON.parse(loadedTemplates));
    } catch (error) {
      console.error("Error al cargar Templates", error);
    }
  }

  const saveText = async (text) => {
    try {
      const { value: nameTemplate } = await newDialog("Nuevo Template", "Nombre del nuevo template");
      const newTemplates = [...templates, { name: nameTemplate, value }]

      await setCookieNext("templates", await JSON.stringify(newTemplates));

      await loadTemplates();
    } catch (error) {
      console.error("Ocurrio un error al guardar el texto", error);
    }
  }

  const loadText = (text) => {
    setValue(text);
  }

  const editorRef = useRef(null);

  useEffect(() => {
    loadTemplates();
  }, []);


  return (
    <div className="flex flex-col justify-center items-center content-center h-screen bg-gray-300 text-white pt-10">

      <Image
        className="object-cover h-[100px] w-[100px]"
        width={0}
        height={0}
        alt={`App Logo`}
        src={
          Logo
        }
      />

      <div className=" flex flex-col bg-white text-black rounded-lg gap-4 w-[95%] p-5">
        <CustomDropdown
          key={1} // Asegúrate de proporcionar una clave única para cada elemento
          options={templates}
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
          className="bg-white rounded-lg h-[70px] w-full flex justify-center items-center gap-2 p-3"
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
