import { Form, Input, Select } from "antd";
import React, { useState, useEffect } from "react";
 
const { TextArea } = Input;
const { Option } = Select;
 
const SAP_S4_MODULOS = [
  "Abastecimiento",
  "Contabilidad",
  "Tesorería",
  "Control de Gestión",
  "Cuenta Corriente Estudiante",
  "Cuentas por Pagar",
  "Ventas"
];
 
const SAP_SUCCESS_FACTORS_MODULOS = [
  "Recursos Humanos",
];
 
 
const SAP_ARIBA_MODULOS = [
  "Datos Maestros Proveedores",
  "Solicitud de Cotizacion",
  "Contratos"
];
function Step2_DetalleGasto(props) {
  const {
    modulo,
    handleChangeModulo,
    nivelPrioridad,
    handleChangeNivelPrioridad,
    tipoSolicitud,
    handleChangeTipoSolicitud,
    tituloIncidencia,
    onChangeTituloIncidencia,
    sistemaAdministrativo,
    handleChangeSistemaAdministrativo,
    informacionAdicional,
    onChangeInformacionAdicional,
 
  } = props;
 
  const [modulos, setModulos] = useState([]);
 
  useEffect(() => {
    if (sistemaAdministrativo === "SAP S/4 HANA") {
      setModulos([]);
     
      setModulos(SAP_S4_MODULOS);
    } else if (sistemaAdministrativo === "SAP Success Factors (Personas)") {
      setModulos([]);
     
      setModulos(SAP_SUCCESS_FACTORS_MODULOS);
  } else if (sistemaAdministrativo === "SAP ARIBA") {
  setModulos([]);
 
      setModulos(SAP_ARIBA_MODULOS);
    } else {
      setModulos([]);
    }
  }, [sistemaAdministrativo]);
 
  return (
    <>
      <p style={{ fontWeight: "bold", marginBottom: "20px" }}>
        Detalle el problema o incidencia que se presenta
      </p>
 
      {/* ... Contenido del segundo paso */}
 
      <Form.Item
        label="Título incidencia"
        name="tituloIncidencia"
        rules={[
          {
            required: true,
            message: "Por favor ingrese el título de la incidencia",
          },
        ]}
      >
        <Input
          placeholder="Ingrese el título de la incidencia."
          showCount
          maxLength={50}
          value={tituloIncidencia}
          onChange={onChangeTituloIncidencia}
        />
      </Form.Item>
 
      <Form.Item
        label="Sistema administrativo"
        name="sistemaAdministrativo"
        rules={[
          {
            required: true,
            message: "Por favor seleccione el sistema administrativo",
          },
        ]}
      >
        <Select
          placeholder="Seleccione el sistema administrativo"
          onChange={handleChangeSistemaAdministrativo}
          value={sistemaAdministrativo}
        >
          <Option value="SAP S/4 HANA">SAP S/4 HANA</Option>
          <Option value="SAP Success Factors (Personas)">SAP Success Factors (Personas)</Option>
    <Option value="SAP ARIBA">SAP ARIBA</Option>
        </Select>
      </Form.Item>
 
      <Form.Item
        label="Módulo"
        name="modulo"
        rules={[
          {
            required: true,
            message: "Por favor seleccione la unidad a la que pertenece",
          },
        ]}
      >
        <Select
          placeholder="Seleccione la unidad a la que pertenece"
          onChange={handleChangeModulo}
          value={modulo}
        >
          {modulos.map((modulo) => (
            <Option key={modulo} value={modulo}>{modulo}</Option>
          ))}
        </Select>
      </Form.Item>
 
      <Form.Item
        label="Tipo de Solicitud"
        name="tipoSolicitud"
        rules={[
          {
            required: true,
            message: "Por favor seleccione el tipo de solicitud",
          },
        ]}
      >
        <Select
          placeholder="Seleccione el tipo de solicitud"
          onChange={handleChangeTipoSolicitud}
          value={tipoSolicitud}
        >
          <Option value="Consulta">Consulta</Option>
          <Option value="Error">Error</Option>
          <Option value="Autorizaciones-Accesos">Autorizaciones-Accesos</Option>
          <Option value="Pedido Especial">Pedido Especial</Option>
          <Option value="Evolutivo">Evolutivo</Option>
          <Option value="Proceso Repetitivo">Proceso Repetitivo</Option>
          <Option value="Apoyo en Gestión de Procesos">Apoyo en Gestión de Procesos</Option>
          <Option value="Correctivo">Correctivo</Option>
          <Option value="Proyecto">Proyecto</Option>
          <Option value="Normativo">Normativo</Option>
          <Option value="Nuevo desarrollo">Nuevo desarrollo</Option>
        </Select>
      </Form.Item>
 
      <Form.Item
        label="Prioridad"
        name="prioridad"
        rules={[
          {
            required: true,
            message: "Por favor seleccione el nivel de prioridad.",
          },
        ]}
      >
        <Select
          placeholder="Seleccione el nivel de prioridad"
          onChange={handleChangeNivelPrioridad}
          value={nivelPrioridad}
        >
          <Option value="Alta">Alta</Option>
          <Option value="Media">Media</Option>
          <Option value="Baja">Baja</Option>
        </Select>
      </Form.Item>
 
      <Form.Item
        label="Información adicional"
        name="informacionAdicional"
        rules={[
          {
            required: true,
            message: "Por favor ingrese la descripción del problema.",
          },
        ]}
      >
        <TextArea
          showCount
          maxLength={255}
          style={{
            height: 120,
            resize: "none",
          }}
          onChange={onChangeInformacionAdicional}
          placeholder="Explique brevemente en qué consistió el gasto realizado."
          value={informacionAdicional}
        />
      </Form.Item>
 
    </>
  );
}
 
export default Step2_DetalleGasto;


// import { Form, Input, Select } from "antd";
// import React, { useState, useEffect } from "react";

// const { TextArea } = Input;
// const { Option } = Select;

// const SAP_S4_MODULOS = [
//   "Abastecimiento",
//   "Contabilidad",
//   "Tesorería",
//   "Control de Gestión",
//   "Cuenta Corriente Estudiante",
//   "Cuentas por Pagar",
//   "Ventas"
// ];

// const SAP_SUCCESS_FACTORS_MODULOS = [
//   "Recursos Humanos",
// ];

// function Step2_DetalleGasto(props) {
//   const {
//     modulo,
//     handleChangeModulo,
//     nivelPrioridad,
//     handleChangeNivelPrioridad,
//     tipoSolicitud,
//     handleChangeTipoSolicitud,
//     tituloIncidencia,
//     onChangeTituloIncidencia,
//     sistemaAdministrativo,
//     handleChangeSistemaAdministrativo,
//     informacionAdicional,
//     onChangeInformacionAdicional,

//   } = props;

//   const [modulos, setModulos] = useState([]);

//   useEffect(() => {
//     if (sistemaAdministrativo === "SAP S/4 HANA") {
//       setModulos([]);
//       setModulos(SAP_S4_MODULOS);
//     } else if (sistemaAdministrativo === "SAP Success Factors (Personas)") {
//       setModulos([]);
//       setModulos(SAP_SUCCESS_FACTORS_MODULOS);
//     } else {
//       setModulos([]);
//     }
//   }, [sistemaAdministrativo]);

//   return (
//     <>
//       <p style={{ fontWeight: "bold", marginBottom: "20px" }}>
//         Detalle el problema o incidencia que se presenta
//       </p>

//       {/* ... Contenido del segundo paso */}

//       <Form.Item
//         label="Título incidencia"
//         name="tituloIncidencia"
//         rules={[
//           {
//             required: true,
//             message: "Por favor ingrese el título de la incidencia",
//           },
//         ]}
//       >
//         <Input
//           placeholder="Ingrese el título de la incidencia."
//           showCount
//           maxLength={50}
//           value={tituloIncidencia}
//           onChange={onChangeTituloIncidencia}
//         />
//       </Form.Item>

//       <Form.Item
//         label="Sistema administrativo"
//         name="sistemaAdministrativo"
//         rules={[
//           {
//             required: true,
//             message: "Por favor seleccione el sistema administrativo",
//           },
//         ]}
//       >
//         <Select
//           placeholder="Seleccione el sistema administrativo"
//           onChange={handleChangeSistemaAdministrativo}
//           value={sistemaAdministrativo}
//         >
//           <Option value="SAP S/4 HANA">SAP S/4 HANA</Option>
//           <Option value="SAP Success Factors (Personas)">SAP Success Factors (Personas)</Option>
//         </Select>
//       </Form.Item>

//       <Form.Item
//         label="Módulo"
//         name="modulo"
//         rules={[
//           {
//             required: true,
//             message: "Por favor seleccione la unidad a la que pertenece",
//           },
//         ]}
//       >
//         <Select
//           placeholder="Seleccione la unidad a la que pertenece"
//           onChange={handleChangeModulo}
//           value={modulo}
//         >
//           {modulos.map((modulo) => (
//             <Option key={modulo} value={modulo}>{modulo}</Option>
//           ))}
//         </Select>
//       </Form.Item>

//       <Form.Item
//         label="Tipo de Solicitud"
//         name="tipoSolicitud"
//         rules={[
//           {
//             required: true,
//             message: "Por favor seleccione el tipo de solicitud",
//           },
//         ]}
//       >
//         <Select
//           placeholder="Seleccione el tipo de solicitud"
//           onChange={handleChangeTipoSolicitud}
//           value={tipoSolicitud}
//         >
//           <Option value="Consulta">Consulta</Option>
//           <Option value="Error">Error</Option>
//           <Option value="Autorizaciones-Accesos">Autorizaciones-Accesos</Option>
//           <Option value="Pedido Especial">Pedido Especial</Option>
//           <Option value="Evolutivo">Evolutivo</Option>
//           <Option value="Proceso Repetitivo">Proceso Repetitivo</Option>
//           <Option value="Apoyo en Gestión de Procesos">Apoyo en Gestión de Procesos</Option>
//           <Option value="Correctivo">Correctivo</Option>
//           <Option value="Proyecto">Proyecto</Option>
//           <Option value="Normativo">Normativo</Option>
//           <Option value="Nuevo desarrollo">Nuevo desarrollo</Option>
//         </Select>
//       </Form.Item>

//       <Form.Item
//         label="Prioridad"
//         name="prioridad"
//         rules={[
//           {
//             required: true,
//             message: "Por favor seleccione el nivel de prioridad.",
//           },
//         ]}
//       >
//         <Select
//           placeholder="Seleccione el nivel de prioridad"
//           onChange={handleChangeNivelPrioridad}
//           value={nivelPrioridad}
//         >
//           <Option value="Alta">Alta</Option>
//           <Option value="Media">Media</Option>
//           <Option value="Baja">Baja</Option>
//         </Select>
//       </Form.Item>

//       <Form.Item
//         label="Información adicional"
//         name="informacionAdicional"
//         rules={[
//           {
//             required: true,
//             message: "Por favor ingrese la descripción del problema.",
//           },
//         ]}
//       >
//         <TextArea
//           showCount
//           maxLength={255}
//           style={{
//             height: 120,
//             resize: "none",
//           }}
//           onChange={onChangeInformacionAdicional}
//           placeholder="Explique brevemente en qué consistió el gasto realizado."
//           value={informacionAdicional}
//         />
//       </Form.Item>

//     </>
//   );
// }

// export default Step2_DetalleGasto;