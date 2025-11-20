import React, { useState, useEffect, useRef } from "react";
import { Spin, Table, Input, Button, Space, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { sp_api_comment, sp_api_get_json, sp_api_update_json } from "../../api/sp_api_json";
import "../MisTickets/MisTickets.css";
import { formatDate } from "../utils/utils";
import Highlighter from "react-highlight-words";
import Config from "../../configEnv"; // Importa el archivo de configuración
import FilesDetail from "../MisTickets/MisTicketsFiles"; // Ajusta la ruta al archivo correcta

function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [form] = Form.useForm();
  const [accionSeleccionada, setAccionSeleccionada] = useState(null); // 'escalar' | 'cerrar' | null

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
              handleSearch(selectedKeys, confirm);
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
        const jsonKeyUsers = await sp_api_get_json(
          Config.winLocationRefLink+`/_api/web/lists/getbytitle('MatrizModulos')/items?$filter=substringof('${jsonCurrentUser.Email}',EmailKU)`
        );
        console.log("Key User:", jsonKeyUsers);
        
        // Construir filtros para todas las entidades y módulos del usuario
        const filters = jsonKeyUsers.results.map(keyUser => {
          const entidad = keyUser.Title.split(' ')[0];
          const modulo = keyUser.Title.split(' ')[1];
          return `(Entidad eq '${entidad}' and Modulo eq '${modulo}')`;
        });
        
        const filterQuery = filters.join(' or ');
        console.log("Filter Query:", filterQuery);
        
        const jsonRequests = await sp_api_get_json(
          Config.urlLinkSolicitudesTickets+`?$top=999999&$orderby=Created%20desc&$filter=${filterQuery}`
        );

        console.log(jsonRequests);
        const arrayAux = jsonRequests.results.map((request) => ({
          key: request.idSolicitud,
          id: request.idSolicitud,
          title: request.title,
          numeroTicket: request.NumeroDeTicket,
          modulo : request.Modulo,
          entidad: request.Entidad,
          tituloIncidencia: request.TituloIncidencia,
          FechaCreacion: formatDate(request[Config.fechaCreacion]),
          DescripcionDelProblema: request[Config.descripcion],
          categoriaProblema: request[Config.tipoSolicitud],
          prioridad: request.Prioridad,
          EstadoDelTicket: request[Config.estado],
          FeedbackDelUsuario: request[Config.feedback],
          creado: formatDate(request.Created),
          idSP: request.ID,
          habilitarGestionar: request[Config.estado] === "Recibido" || request[Config.estado] === "Revisión Key User" || request[Config.estado] === "Pruebas Key User",
        }));

        console.log("Registros devueltos:", arrayAux.length);

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

  const showTicketDetails = (record) => {
    setSelectedTicket(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      numeroTicket: record.numeroTicket,
      descripcion: record.DescripcionDelProblema,
      feedback: record.FeedbackDelUsuario,
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedTicket(null);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    console.log("Formulario enviado:", values);
    // Aquí puedes agregar la lógica para manejar el envío del formulario (ej. actualizar el ticket)
    setIsModalVisible(false);
    setSelectedTicket(null);
    form.resetFields();
  };

  const handleEscalarTI = () => {
    setAccionSeleccionada('escalar');
  };

  const handleResuelto = () => {
    setAccionSeleccionada('cerrar');
  };

  const handleConfirmarAccion = async () => {
    if (accionSeleccionada === 'escalar') {
      // Ejecuta la lógica de escalar a TI
      await handleEscalarTIConfirm();
    } else if (accionSeleccionada === 'cerrar') {
      // Ejecuta la lógica de cerrar ticket
      await handleResueltoConfirm();
    }
    setAccionSeleccionada(null);
  };

  const handleEscalarTIConfirm = async () => {
    const formValues = form.getFieldsValue();
    const feedbackValue = formValues.feedback;
    const selectedTicketValue = selectedTicket;

    try {
      const getTicketValue = await sp_api_get_json(
        `${Config.urlLinkSolicitudesTickets}(${selectedTicketValue.idSP})`
      );

      const data = {
        "__metadata": {
          "type": getTicketValue.__metadata.type
        },
        "EstadoDelTicket": "Revisión TI"
      };

      await sp_api_update_json(
        `${Config.urlLinkSolicitudesTickets}(${selectedTicketValue.idSP})`,
        getTicketValue.__metadata.etag,
        data
      );
    } catch (e) {
      console.error("Error en la consulta");
    }

    try {
      await sp_api_comment(selectedTicketValue.idSP, feedbackValue + "\nAcción: Escalado a TI\n");
    } catch (error) {
      console.error("Error al agregar el comentario:", error);
      return;
    }

    setIsModalVisible(false);
    setSelectedTicket(null);
    form.resetFields();
  };

  const handleResueltoConfirm = async () => {
    const formValues = form.getFieldsValue();
    const feedbackValue = formValues.feedback;
    const selectedTicketValue = selectedTicket;

    try {
      const getTicketValue = await sp_api_get_json(
        `${Config.urlLinkSolicitudesTickets}(${selectedTicketValue.idSP})`
      );

      const data = {
        "__metadata": {
          "type": getTicketValue.__metadata.type
        },
        "EstadoDelTicket": "Cerrado",
        "FeedbackDelUsuario": feedbackValue
      };

      await sp_api_update_json(
        `${Config.urlLinkSolicitudesTickets}(${selectedTicketValue.idSP})`,
        getTicketValue.__metadata.etag,
        data
      );
    } catch (e) {
      console.error("Error en la consulta");
    }

    try {
      await sp_api_comment(selectedTicketValue.idSP, feedbackValue + "\nAcción: Cerrado\n");
    } catch (error) {
      console.error("Error al agregar el comentario:", error);
      return;
    }

    setIsModalVisible(false);
    setSelectedTicket(null);
    form.resetFields();
  };

  const handleCancelar = () => {
    setIsModalVisible(false);
    setSelectedTicket(null);
    setAccionSeleccionada(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "N°",
      dataIndex: "numero",
      key: "numero",
      render: (text, record, index) => index + 1,
      fixed: 'left',
      width: 40,
    },
    {
      ...getColumnSearchProps("numeroTicket", "Buscar ticket"),
      title: "Número de ticket",
      dataIndex: "numeroTicket",
      key: "numeroTicket",
      sorter: (a, b) => a.numeroTicket - b.numeroTicket,
      sortDirections: ["ascend", "descend"],
      fixed: 'left',
      width: 200,
    },
    {
      ...getColumnSearchProps("tituloIncidencia", "Buscar título de incidencia"),
      title: "Título incidencia",
      dataIndex: "tituloIncidencia",
      key: "tituloIncidencia",
      width: 200,
      wrap: true,
    },
    {
      ...getColumnSearchProps("modulo", "Buscar módulo"),
      title: "Módulo",
      dataIndex: "modulo",
      key: "modulo",
      width: 150,
      wrap: true,
    },
    {
      ...getColumnSearchProps("entidad", "Buscar entidad"),
      title: "Entidad",
      dataIndex: "entidad",
      key: "entidad",
      width: 150,
      wrap: true,
    },
    {
      ...getColumnSearchProps("fechaHoraCreacion", "Buscar fecha y hora de creación"),
      title: "Fecha creación",
      dataIndex: "FechaCreacion",
      key: "FechaCreacion",
      width: 200,
      wrap: true,
    },
    {
      title: "Descripción del problema",
      dataIndex: "DescripcionDelProblema",
      key: "DescripcionDelProblema",
      width: 200,
      wrap: true,
    },
    {
      title: "Categoría del problema",
      dataIndex: "categoriaProblema",
      key: "categoriaProblema",
      width: 200,
      wrap: true,
    },
    {
      title: "Prioridad",
      dataIndex: "prioridad",
      key: "prioridad",
      width: 200,
      wrap: true,
    },
    {
      title: "Estado del ticket",
      dataIndex: "EstadoDelTicket",
      key: "EstadoDelTicket",
      width: 200,
      wrap: true,
    },
    {
      title: "Feedback usuario",
      dataIndex: "FeedbackDelUsuario",
      key: "FeedbackDelUsuario",
      width: 200,
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
    {
      title: "Acciones",
      key: "acciones",
      fixed: 'right',
      width: 150,
      render: (text, record) => (
        record.habilitarGestionar ? (
          <Button type="primary" onClick={() => showTicketDetails(record)}>
            Gestionar
          </Button>
        ) : null
      ),
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
          Tickets
        </h1>
      </div>

      <Spin spinning={loading}>
        <div style={{ maxHeight: "45vh" }}>
          <Table
            bordered
            dataSource={data}
            columns={columns}
            pagination={false}
            scroll={{ x: "max-content", y: "45vh" }}
            size="small"
          />
        </div>
      </Spin>

      <Modal
        title="Detalles del Ticket"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={700}
      >
        {selectedTicket && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{
              numeroTicket: selectedTicket.numeroTicket,
              descripcion: selectedTicket.DescripcionDelProblema,
              feedback: selectedTicket.FeedbackDelUsuario,
            }}
          >
            <Form.Item label="Número de Ticket" name="numeroTicket">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Descripción" name="descripcion">
              <Input.TextArea rows={4} disabled />
            </Form.Item>

            <Form.Item label="Adjunto">
              {selectedTicket.idSP && (
                <FilesDetail url={`${Config.urlLinkSolicitudesTickets}?$filter=ID eq '${selectedTicket.idSP}'&$select=AttachmentFiles,Title&$expand=AttachmentFiles`} />
              )}
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleEscalarTI} disabled={accionSeleccionada === 'escalar'}>
                  Escalar a TI
                </Button>
                <Button type="primary" onClick={handleResuelto} disabled={accionSeleccionada === 'cerrar'}>
                  Cerrado
                </Button>
                <Button onClick={handleCancelar}>
                  Cancelar
                </Button>
              </Space>
            </Form.Item>

            {accionSeleccionada && (
              <>
                <Form.Item
                  label={accionSeleccionada === 'escalar' ? "Comentario" : "Feedback"}
                  name="feedback"
                  rules={[{ required: true, message: 'Por favor ingrese un comentario.' }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={handleConfirmarAccion}>
                    Confirmar
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default History;