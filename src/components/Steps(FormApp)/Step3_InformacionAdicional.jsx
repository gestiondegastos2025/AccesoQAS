import React, { useState, useEffect } from "react";
import { Form, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const Step4 = ({ fileList, handleFileChange }) => {
  const [fileSizeMessage, setFileSizeMessage] = useState(""); // Estado para mostrar el tamaño de los archivos

  useEffect(() => {
    // Función para actualizar el mensaje de tamaño de archivo al cambiar la lista de archivos
    const updateFileSizeMessage = () => {
      if (fileList && fileList.length > 0) {
        // Verifica si fileList está definido y tiene elementos
        const totalSize = fileList.reduce((acc, file) => acc + file.size, 0);
        const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2); // Convertir a megabytes con 2 decimales
        setFileSizeMessage(`Tamaño total de archivos: ${totalSizeInMB} MB`);
      } else {
        setFileSizeMessage(`Tamaño total de archivos: 0 MB`); // No hay archivos seleccionados
      }
    };

    updateFileSizeMessage(); // Llamar a la función inicialmente
  }, [fileList]);

  const checkFileSize = (file) => {
    const maxSizeInBytes = 200 * 1024 * 1024; // 10 MB (ajusta el límite según tus necesidades)

    if (file.size > maxSizeInBytes) {
      message.error("El archivo es demasiado grande, el límite es 200 MB");
      return false;
    }

    return true;
  };

  return (
    <>
      <p style={{ fontWeight: "bold", marginBottom: "20px" }}>
        Adjunte archivo(s) que ayuden a encontrar la solución a su problema. (Max.
          5 archivos, límite 200 MB).
      </p>
      <p>
        Se sugiere incluir documentos como: capturas de pantalla, documentos, SU53 (Accesos/roles), etc.
      </p>
      <p style={{ marginBottom: "20px" }}>
        Tipos de archivos permitidos: <b>Word, PDF, imagenes.</b>
      </p>
      {/* Contenido del cuarto paso */}
      <Form.Item
        label="Adjuntos"
        name="adjunto"
        required
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const fileList = getFieldValue('adjunto')?.fileList; // Usando el operador de opcional chaining para evitar errores si getFieldValue('adjunto') es undefined
              console.log("fileList: " + fileList);
              if (!fileList || fileList.length === 0 || !value || value.length === 0) {
                return Promise.reject('Por favor cargar archivos adjuntos');
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Upload
          multiple
          accept=".pdf,.doc,.docx,image/*,.html,.htm"
          maxCount={5}
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={(file) => {
            const isAllowedType =
              file.type === "application/pdf" ||
              file.type === "application/msword" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
              file.type.startsWith("image/") ||
              file.type === "text/html" || // Añadir tipo MIME para archivos .html
              file.type === "application/vnd.ms-outlook"; // Añadir tipo MIME para archivos .msg
            if (!isAllowedType) {
              message.error(
                "Este tipo de archivo no está permitido. Por favor seleccione los indicados."
              );
              return Upload.LIST_IGNORE; // Evita que se agregue el archivo a la lista de archivos
            }

            // Verificar el tamaño del archivo
            const isFileSizeValid = checkFileSize(file);
            if (!isFileSizeValid) {
              return Upload.LIST_IGNORE; // Evita que se agregue el archivo a la lista de archivos
            }

            // Permitir que el archivo se agregue a la lista de archivos
            return true;
          }}
          customRequest={({ onSuccess, onError, file }) => {
            if (checkFileSize(file)) {
              onSuccess(); // Marcar la carga como exitosa
            } else {
              onError(); // Marcar la carga como fallida
            }
          }}
        >
          <Button icon={<UploadOutlined />}>Subir archivos</Button>
        </Upload>
      </Form.Item>
      <p>{fileSizeMessage}</p>
    </>
  );
};

export default Step4;