import React, { useState, useEffect, useRef } from "react";
import { Spin, Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { sp_api_get_json } from "../../api/sp_api_json";
import "../History/History.css";
import { formatearFechaAprobacion } from "../utils/utils";
import { formatDate } from "../utils/utils";
import Highlighter from "react-highlight-words";
import dataTest from "../utils/dataTest.json";
import Config from "../../configEnv"; // Importa el archivo de configuración
import FilesDetail from "../History/HistoryFiles"; // Ajusta la ruta al archivo correcta


// function obtenerStepInfo(estadoTicket) {
//   let currentStep;
//   let description;
//   let status;
//   let progress;

//   switch (estadoTicket) {
//     case "Solicitud Recibida":
//       currentStep = 0;
//       description =
//         "Solicitud creada correctamente, en espera de ser revisada por su aprobador";
//       status = "finish";
//       progress = 100;
//       break;
//     case "Pendiente Autorización Aprobador":
//       currentStep = 1;
//       description =
//         "Su solicitud está pendiente de autorización por su aprobador";
//       status = "process";
//       progress = 25;
//       break;
//     case "Autorizado Aprobador":
//       currentStep = 1;
//       description =
//         "Su aprobador ha aceptado su solicitud, a espera de ser revisada por contabilidad";
//       status = "process";
//       progress = 50;
//       break;
//     case "Rechazado Aprobador":
//       currentStep = 1;
//       description = "Aprobador ha rechazado solicitud";
//       status = "error";
//       break;
//     case "Sin Relación Solicitante/Aprobador":
//       currentStep = 1;
//       description =
//         "Su solicitud no ha podido ser procesada porque la unidad indicada no se encuentra en la matriz de aprobación";
//       status = "error";
//       break;
//     case "Autorizado Analista":
//       currentStep = 1;
//       description = "Su solicitud ha sido aprobada por contabilidad";
//       status = "finish";
//       progress = 85;
//       break;
//     case "Rechazado Analista":
//       currentStep = 1;
//       description = "Su solicitud ha sido rechazada por contabilidad";
//       status = "error";
//       break;
//     case "Exportado":
//       currentStep = 2;
//       description = "Su solicitud está en proceso de pago";
//       status = "process";
//       progress = 50;
//       break;
//     case "Pagado":
//       currentStep = 2;
//       description = "El reembolso ha sido PAGADO";
//       status = "finish";
//       progress = 100;
//       break;
//     case "Rechazado Contador General":
//       currentStep = 1;
//       description = "Su solicitud ha sido rechazada por contador general";
//       status = "error";
//       break;
//     default:
//       currentStep = -1;
//       description = "Estado desconocido";
//       status = "unknown";
//   }

//   return {
//     current: currentStep,
//     description: description,
//     status: status,
//     progress: progress,
//   };
// }

function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);

  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput.current = node;
          }}
          placeholder={placeholder}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => {
              handleReset(clearFilters);
              handleSearch(selectedKeys, confirm); // Llama a la búsqueda con un valor vacío para reiniciar la tabla
              handleReset(clearFilters);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchText ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    async function getDataList() {
      try {
        const jsonCurrentUser = await sp_api_get_json(Config.winLocationRefLink+"/_api/web/CurrentUser");

        const jsonRequests = await sp_api_get_json(
          `${Config.urlLinkSolicitudesTickets}?$filter=InformacionDeContactoDelUsuario eq '${jsonCurrentUser.Email}'&$orderby=Created desc&$top=999999`
        );

        const arrayAux = jsonRequests.results.map((request) => ({
          key: request.idSolicitud,
          id: request.idSolicitud,
          title: request.title,
          numeroTicket: request.NumeroDeTicket,
          tituloIncidencia: request.TituloIncidencia,
          FechaCreacion: formatDate(request[Config.fechaCreacion]),
          // nombreUsuarioSolicitante: request.NombreDelUsuario_x002f_Solicitan,
          // informacionContactoUsuario: request.InformacionDeContactoDelUsuario,
          // entidad: request.Entidad,
          // unidad: request.Unidad,
          // descripcionProblema: request.Descripci_x00f3_ndelproblema,
          //descripcionProblema: request[Config.descripcion],     antiguo
          DescripcionDelProblema: request[Config.descripcion], 
          //categoriaProblema: request.TipoSolicitud,
          categoriaProblema: request[Config.tipoSolicitud],
          prioridad: request.Prioridad,
          //estadoTicket: request.EstadoDelTicket,
          EstadoDelTicket: request[Config.estado],
          // asignadoA: request.Asignado,
          FeedbackDelUsuario: request[Config.feedback],
          creado: formatDate(request.Created),
          idSP: request.ID,
        }));

        console.log("Registros devueltos:", arrayAux.length); // Agregar este console.log

        setData(arrayAux);
        setLoading(false);
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    }

    getDataList();
  }, []);

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "N°",
      dataIndex: "numero", // Nuevo dataIndex para la columna autogenerada
      key: "numero",
      render: (text, record, index) => index + 1, // Genera el número de fila
      // sorter: (a, b) => a.numero - b.numero,
      // sortDirections: ["descend", "ascend"],
      fixed: 'left',
      width: 30,
    },
    {
      ...getColumnSearchProps("numeroTicket", "Buscar ticket"),
      title: "Número de ticket",
      dataIndex: "numeroTicket",
      key: "numeroTicket",
      sorter: (a, b) => a.numeroTicket - b.numeroTicket,
      sortDirections: ["ascend", "descend"],
      fixed: 'left',
      width: 200, // Ajustar este valor según lo que se necesite
    },
    {
      ...getColumnSearchProps("tituloIncidencia", "Buscar título de incidencia"),
      title: "Título incidencia",
      dataIndex: "tituloIncidencia",
      key: "tituloIncidencia",
      width: 200, // Ajustar este valor según lo que se necesite
      wrap: true,
    },
    {
      ...getColumnSearchProps("fechaHoraCreacion", "Buscar fecha y hora de creación"),
      title: "Fecha creación",
      dataIndex: "FechaCreacion",
      key: "FechaCreacion",
      width: 200, // Ajustar este valor según lo que se necesite
      wrap: true,
    },
    {
      title: "Descripción del problema",
      dataIndex: "DescripcionDelProblema",
      key: "DescripcionDelProblema",
      width: 200, // Ajustar este valor según lo que se necesite
      wrap: true,
    },
    {
      title: "Categoría del problema",
      dataIndex: "categoriaProblema",
      key: "categoriaProblema",
      width: 200, // Ajustar este valor según lo que se necesite
      wrap: true,
    },
    {
      title: "Prioridad",
      dataIndex: "prioridad",
      key: "prioridad",
      width: 200, // Ajustar este valor según lo que se necesite
      wrap: true,
    },
    {
      title: "Estado del ticket",
      dataIndex: "EstadoDelTicket",
      key: "EstadoDelTicket",
      width: 200, // Ajustar este valor según lo que se necesite
      wrap: true,
    },
    // {
    //   title: "Asignado a",
    //   dataIndex: "asignadoA",
    //   key: "asignadoA",
    //   width: 200, // Ajustar este valor según lo que se necesite
    //   wrap: true,
    // },
    {
      title: "Feedback usuario",
      dataIndex: "FeedbackDelUsuario",
      key: "FeedbackDelUsuario",
      width: 200, // Ajustar este valor según lo que se necesite
      wrap: true,
    },
    {
      title: "Archivos adjuntos",
      dataIndex: "archivosAdjuntos",
      key: "archivosAdjuntos",
      render: (idSP, record) => <FilesDetail url={`${Config.urlLinkSolicitudesTickets}?$filter=ID eq '${record.idSP}'&$select=AttachmentFiles,Title&$expand=AttachmentFiles`} />,
      width: 250,
      height: 55,
    },
  ];

  return (
    <div>
      <div>
        <div className="imgUandes"></div>
        <h1
          style={{
            color: "#e10e17",
          }}
        >
          Historial de mis Tickets
        </h1>
      </div>

      <Spin spinning={loading}>
        <div style={{ maxHeight: "45vh"}}>
          <Table
              bordered
              dataSource={data}
              columns={columns}
              pagination={false} // Desactiva la paginación
              scroll={{ x: "max-content", y: "45vh" }}
              size="small"
          />
        </div>
      </Spin>
    </div>
  );
}

export default History;
