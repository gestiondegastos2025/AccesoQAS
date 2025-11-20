import { Form, Input, DatePicker, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { sp_api_get_json } from "../../api/sp_api_json";
import Config from "../../configEnv";

const { TextArea } = Input;

function FormularioAccesoQAS() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const json = await sp_api_get_json(
          Config.winLocationRefLink + "/_api/web/CurrentUser"
        );
        setCurrentUser(json.Title || "");
        form.setFieldsValue({ usuarioSAP: json.Title || "" });
      } catch (error) {
        console.error("Error obteniendo usuario actual:", error);
      }
    }
    getCurrentUser();
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        usuarioSAP: values.usuarioSAP,
        correo: values.correo,
        motivo: values.motivo,
        fechaNueva: values.fechaNueva.format("YYYY-MM-DD"),
        ticket: values.ticket || null, // nuevo campo opcional
      };

      const response = await fetch(
        "https://uandescpidevqas.it-cpi008-rt.cfapps.br10.hana.ondemand.com/http/extenderAccesoQAS",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        message.success("✅ Solicitud enviada correctamente.");
        form.resetFields();
        form.setFieldsValue({ usuarioSAP: currentUser });
      } else {
        message.error(`⚠️ Error al enviar solicitud (código ${response.status})`);
      }
    } catch (error) {
      console.error(error);
      message.error("❌ No se pudo conectar al servidor. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qas-container">
      {/* 🔹 Título más grande */}
      <h1
        style={{
          color: "#b30000",
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Solicitud de Extensión de Acceso a SAP QAS
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "15px",
          color: "#333",
          marginBottom: 40,
        }}
      >
        Complete los siguientes datos para solicitar la extensión de validez de su acceso.
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 700, margin: "0 auto" }}
      >
        <Form.Item
          label="ID de Usuario SAP"
          name="usuarioSAP"
          rules={[
            { required: true, message: "Por favor ingrese su ID de usuario SAP" },
          ]}
        >
          <Input placeholder="Ejemplo: MMUNOZ" />
        </Form.Item>

        {/* Campo Correo */}
        <Form.Item
            label = "Correo Electrónico"
            name = "correo"
            rules = {[
                { required: true, message: "Por favor ingrese su correo electrónico"},
                { type: "email", message: "Ingrese un correo electrónico válido"},
            ]}
        >
            <Input placeholder="Ejemplo: usuario@uandes.cl" />
        </Form.Item>

        {/* 🔹 Nuevo campo Ticket */}
        <Form.Item
          label="Ticket (opcional)"
          name="ticket"
          tooltip="Ingrese el número de ticket si existe. Si no, deje este campo vacío."
        >
          <Input placeholder="Ej: Por favor ingrese N° de ticket y asunto" />
        </Form.Item>

        <Form.Item
          label="Motivo de la solicitud"
          name="motivo"
          rules={[
            { required: true, message: "Por favor ingrese el motivo de la solicitud" },
          ]}
        >
          <TextArea
            showCount
            maxLength={255}
            rows={4}
            placeholder="Ej: Necesito ampliar acceso temporal para pruebas"
          />
        </Form.Item>

        <Form.Item
          label="Nueva fecha"
          name="fechaNueva"
          rules={[
            { required: true, message: "Por favor seleccione la nueva fecha" },
          ]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item style={{ textAlign: "center", marginTop: 30 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              backgroundColor: "#c00000",
              borderColor: "#c00000",
              borderRadius: 6,
              padding: "0 40px",
            }}
          >
            Enviar Solicitud
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FormularioAccesoQAS;
