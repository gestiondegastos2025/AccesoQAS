import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Popconfirm,
  Select,
  Spin,
  Table,
  message,
  Button,
  Space,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  sp_api_contextInfo_json,
  sp_api_get_json,
  sp_api_update_json,
} from "../../api/sp_api_json";
import { useNavigate } from "react-router-dom";
import "../AdminView/AdminSolicitudesTicketsList.css";
import "../Maincss/Btn.css";
import { formatearFechaAprobacion } from "../utils/utils";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import FilesDetail from "./AdminFilesSolicitudesTickets"; // Ajusta la ruta al archivo correcta
import Config from "../../configEnv"; // Importa el archivo de configuración
import dataTest from "../utils/dataTestAdmin.json";

// Conversión de cadena con formato DD/MM/AAAA a objeto Date
function convertirADate(cadena) {
  var partes = cadena.split("/");
  return new Date(partes[2], partes[1] - 1, partes[0]);
}

const estadoTicket = ["Revisión TI", "Resuelto", "Cerrado"];

const resolutores = ["Juan Pérez", "María González", "Carlos Rodríguez"];

const { Option } = Select;

const EditableCell = ({ editing, dataIndex, title, ...restProps }) => {
  let inputNode;

  if (dataIndex === "estadoTicket" && editing) {
    inputNode = (
      <Form.Item
        name={dataIndex}
        rules={[{ required: true, message: `Please Input ${title}!` }]}
        style={{
          margin: 0,
        }}
      >
        <Select style={{ width: "100%" }}>
          {estadoTicket.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  } else if (dataIndex === "resolutor" && editing) {
    inputNode = (
      <Form.Item
        name={dataIndex}
        rules={[{ required: true, message: `Please Input ${title}!` }]}
        style={{
          margin: 0,
        }}
      >
        <Select style={{ width: "100%" }}>
          {resolutores.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  } else if (dataIndex === "feedbackAlUsuario" && editing) {
    inputNode = (
      <Form.Item
        name={dataIndex}
        rules={[{ required: false, message: `Please Input ${title}!` }]}
        style={{
          margin: 0,
        }}
      >
        <Input.TextArea
          maxLength={255} // Limita a 255 caracteres
          autoSize={{ minRows: 5, maxRows: 5 }}
          style={{ resize: "none" }} // Desactiva el redimensionamiento
        />
      </Form.Item>
    );
  } else {
    inputNode = <Input />;
  }

  return <td {...restProps}>{editing ? inputNode : restProps.children}</td>;
};

function AdminSolicitudesTicketsList() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);

  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      estadoTicket: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      setUpdating(true); // Comienza el proceso de actualización

      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];

        // Comprueba si el valor de 'estadoTicket' ha cambiado
        if (
          item.estadoTicket === row.estadoTicket &&
          item.resolutor === row.resolutor &&
          item.feedbackAlUsuario === row.feedbackAlUsuario
        ) {
          setEditingKey("");
          return; // No hay cambios, no se realiza la actualización
        }

        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");

        // Paso 1: Obten el ID real de SharePoint usando la columna NumeroDeTicket
        const response = await sp_api_get_json(
          `/sites/SolicitudesTickets/_api/web/lists/getbytitle('SolicitudesTickets')/items?$filter=NumeroDeTicket eq '${item.id}'&$select=ID`
        );

        if (response.results.length === 0) {
          throw new Error("No se encontró registro con ese ID_Matriz.");
        }

        const sharePointID = response.results[0].ID;

        // Obteniendo el digest y realizando la actualización
        const digest = await sp_api_contextInfo_json(
          "/sites/MesaDeAyudaS4Hana/_api/contextinfo"
        );
        const updatedData = {
          EstadoDelTicket: row.estadoTicket,
          Resolutor: row.resolutor,
          FeedbackDelUsuario: row.feedbackAlUsuario
        };

        // Paso 2: Usa el ID real de SharePoint para actualizar el registro
        await sp_api_update_json(
          `/sites/MesaDeAyudaS4Hana/_api/web/lists/getbytitle('SolicitudesTickets')/items('${sharePointID}')`,
          digest,
          updatedData
        );

        message.success("Las modificaciones han sido efectuadas exitosamente.");
        setUpdating(false);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      message.error("Hubo un error al actualizar el registro.");
    } finally {
      setUpdating(false);
    }
  };

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

  const columns = [
    {
      title: "Modificar",
      dataIndex: "edit",
      width: 80, // Ajustar este valor según lo que se necesite
      align: "center", // Centrar horizontalmente el contenido de la columna
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Popconfirm
              title="¿Estás seguro que deseas guardar?"
              onConfirm={() => save(record.key)}
            >
              <SaveOutlined style={{ marginRight: 10, fontSize: "1.5em" }} />
            </Popconfirm>
            <CloseCircleOutlined
              style={{ fontSize: "1.5em" }}
              onClick={cancel}
            />
          </span>
        ) : (
          <EditOutlined
            style={{ fontSize: "1.5em" }}
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          />
        );
      },
      fixed: "left",
    },
    {
      ...getColumnSearchProps("id", "Buscar ID ticket"),
      title: "Número de ticket",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "descend",
      width: 180, // Ajustar este valor según lo que se necesite
      sorter: (a, b) => a.id - b.id,
      fixed: "left",
    },
    {
      ...getColumnSearchProps(
        "tituloIncidencia",
        "Buscar título de incidencia"
      ),
      title: "Título incidencia",
      dataIndex: "tituloIncidencia",
      key: "tituloIncidencia",
      fixed: "left",
    },
    {
      ...getColumnSearchProps("estadoTicket", "Buscar estado del ticket"),
      title: "Estado ticket",
      dataIndex: "estadoTicket",
      key: "estadoTicket",
      editable: true,
      width: 130, // Ajustar este valor según lo que se necesite
    },
    {
      title: "Feedback al usuario",
      dataIndex: "feedbackAlUsuario",
      key: "feedbackAlUsuario",
      width: 240, // Ajustar este valor según lo que se necesite
      editable: true,
    },
    {
      title: "Resolutor",
      dataIndex: "resolutor",
      key: "resolutor",
      editable: true,
      width: 100, // Ajustar este valor según lo que se necesite
    },
    {
      ...getColumnSearchProps(
        "descripcionDelProblema",
        "Buscar descripción del problema"
      ),
      title: "Descripción del problema",
      dataIndex: "descripcionDelProblema",
      key: "descripcionDelProblema",
    },
    {
      title: "Fecha creación",
      dataIndex: "fechaCreacion",
      key: "fechaCreacion",
      width: 200, // Ajustar este valor según lo que se necesite
      wrap: true,
    },
    {
      title: "Entidad",
      dataIndex: "entidad",
      key: "entidad",
      width: 250, // Ajustar este valor según lo que se necesite
      wrap: true,
    },
    {
      ...getColumnSearchProps("prioridad", "Buscar prioridad"),
      title: "Prioridad",
      dataIndex: "prioridad",
      key: "prioridad",
    },
    {
      title: "Módulo",
      dataIndex: "modulo",
      key: "modulo",
    },
    {
      title: "Fecha de resolución",
      dataIndex: "fechaResolucion",
      key: "fechaResolucion",
    },
    {
      title: "Archivo adjunto",
      dataIndex: "archivosAdjuntos",
      key: "archivosAdjuntos",
      render: (idSP, record) => (
        <FilesDetail
          url={`/sites/MesaDeAyudaS4Hana/_api/web/lists/getbytitle('SolicitudesTickets')/items?$filter=ID eq '${record.idSP}'&$select=AttachmentFiles,Title&$expand=AttachmentFiles`}
        />
      ),
      width: 250,
      height: 55,
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  useEffect(() => {
    async function getAdminHistory() {
      try {
        // setLoading(true);

        const jsonCurrentUser = await sp_api_get_json(Config.winLocationRefLink+"/_api/web/CurrentUser");
        // console.log(jsonCurrentUser);

        const jsonRequests = await sp_api_get_json(
          `/sites/MesaDeAyudaS4Hana/_api/web/lists/getbytitle('KU')/items?$filter=Title eq '${jsonCurrentUser.Email}'`
        );
        // console.log(jsonRequests.results);

        if (jsonRequests.results && jsonRequests.results.length > 0) {
          const jsonListItems = await sp_api_get_json(
            `/sites/MesaDeAyudaS4Hana/_api/web/lists/getbytitle('SolicitudesTickets')/items?$top=999999&orderby=Created%20desc`
          );
          // console.log(jsonListItems.results)
          const arrayAux = jsonListItems.results.map((request) => ({
            key: request.NumeroDeTicket,
            id: request.NumeroDeTicket,
            tituloIncidencia: request.TituloIncidencia,
            

            idSP: request.ID,
          }));
          setData(arrayAux);
        } else {
          // El correo del usuario actual no coincide con el correo del registro
          message.error("No tienes permiso para ver este registro.");
          navigate("/"); // Redirigir a la página principal u otra página de error
        }
      } catch (error) {
        console.log("Error", error);
        // message.error("Error al obtener los datos de la solicitud.");
        // navigate("/"); // Redirigir a la página principal u otra página de error
      } finally {
        setLoading(false);
      }
    }
    getAdminHistory();
  }, [navigate]);

  return (
    <div className="adminHistory-container">
      <div>
        <div className="imgUandes"></div>
        <h1
          style={{
            color: "#e10e17",
            marginBottom: "20px",
          }}
        >
          Gestión de Tickets
        </h1>
      </div>
      <Spin spinning={loading || updating}>
        <div style={{ maxHeight: "45vh" }}>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={dataTest}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={false} // Desactiva la paginación
              scroll={{ x: "max-content", y: "45vh" }}
              size="small"
            />
          </Form>
        </div>
      </Spin>
    </div>
  );
}

export default AdminSolicitudesTicketsList;
