import React, { useEffect, useState } from "react";
import { List, Spin, Alert, Space, Typography } from "antd"; // Importa el componente de Spin y Alert para indicadores de carga y errores
import { sp_api_get_json_file } from "../../api/sp_api_json";
import { DownloadOutlined } from "@ant-design/icons"; // Importa el ícono de descarga

const { Text } = Typography; // Importa el componente Text de Typography

function FilesDetail({ url }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Variable para comprobar si el componente está montado

    async function getAttachments() {
      try {
        const responseData = await sp_api_get_json_file(
          url
        );

        console.log(`Esto es responseData: ${responseData}`);

        if (isMounted) {
          const attachmentsData =
            responseData.results[0].AttachmentFiles.results.map(
              (attachment) => ({
                name: attachment.FileName,
                downloadUrl: attachment.ServerRelativeUrl,
              })
            );
          console.log(`Esto es:  ${attachmentsData}`);
          setAttachments(attachmentsData);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError("Error al obtener los archivos adjuntos.");
          setLoading(false);
        }
      }
    }

    getAttachments();

    // Función de limpieza para cancelar la solicitud si el componente se desmonta
    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <div>
      {loading ? (
        <Spin tip="Cargando archivos adjuntos..." />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : attachments.length > 0 ? (
        <List
          dataSource={attachments}
          renderItem={(attachment) => (
            <List.Item style={{ border: "none", margin: 0, padding: 0 }}>
              <Space align="center">
                <DownloadOutlined /> {/* Ícono de descarga */}
                <a href={attachment.downloadUrl} download={attachment.name}>
                  {attachment.name}
                </a>
              </Space>
            </List.Item>
          )}
        />
      ) : (
        <Text>En espera del archivo...</Text>
      )}
    </div>
  );
}

export default FilesDetail;