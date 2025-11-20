import React, { useEffect, useState } from "react";
import { Input, Form, Select } from "antd";
import { sp_api_get_json } from "../../api/sp_api_json";

const { Option } = Select;

function Step1({
  currentUserName,
  currentUserEmail,
  entidad,
  handleChangeEntidad,
  unidad,
  onChangeUnidad,
  onChangeNombreUsuarioCompleto,
  tipoSolicitud,
  unidadSolicitante,
  handleChangeTipoSolicitud,
  handleChangeUnidadSolicitante,
}) {
  // const [unidadesMatrices, setUnidadesMatrices] = useState([]);
  // useEffect(() => {
  //   async function getCurrentUser() {
  //     try {
  //       const jsonCurrentUser = await sp_api_get_json("/_api/web/CurrentUser");
  //       console.log(
  //         "jsonCurrentUserEmail:",
  //         jsonCurrentUser.Email
  //       );
  //       const uri = `/sites/QAS-GestindeGastos/_api/web/lists/getbytitle('Matriz%20de%20Aprobación')/items?$filter=CorreoSolicitante eq '${jsonCurrentUser.Email}' and Estado_Matriz eq 'Aprobada%20Analista' &$orderby=Created desc`;

  //     // Realiza la solicitud y actualiza el estado con los datos de la lista
  //     sp_api_get_json(uri)
  //       .then((data) => {
  //         if (data && data.results) {
  //           const unidades = data.results.map((item) => item.Unidad_Matriz);
  //           setUnidadesMatrices(unidades);
  //         }
  //       })
  //     } catch (error) {
  //       console.log("Error", error);
  //     }
  //   }
  //   getCurrentUser();
  // }, []);

  return (
    <>
      <p style={{ fontWeight: "bold", marginBottom: "20px" }}>
        Complete sus datos.
      </p>

      <Form.Item
        label="Nombre completo"
        name="nombreUsuarioCompleto"
        rules={[
          {
            // required: true,
            message: "Por favor ingrese nombre completo",
          },
        ]}
      >
        <Input
          placeholder={currentUserName}
          defaultValue={currentUserName}
          value={currentUserName}
          disabled={true}
        />
      </Form.Item>

      <Form.Item
        label="Correo electrónico"
        name="correoElectronicoUsuario"
        rules={[
          {
            // required: true,
            message: "Por favor ingrese su correo electrónico",
          },
        ]}
      >
        <Input
          placeholder={currentUserEmail}
          defaultValue={currentUserEmail}
          value={currentUserEmail}
          disabled={true}
        />
      </Form.Item>

      <Form.Item
        label="Entidad"
        name="entidad"
        rules={[
          {
            required: true,
            message: "Por favor seleccione la entidad a la que pertenece",
          },
        ]}
      >
        <Select
          placeholder="Seleccione la entidad a la que pertenece"
          onChange={handleChangeEntidad}
          value={entidad}
        >
          <Option value="UNIVERSIDAD">UNIVERSIDAD</Option>
          <Option value="ESE">ESE</Option>
          <Option value="CESA">CESA</Option>
          <Option value="CLÍNICA">CLÍNICA</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Unidad"
        name="unidad"
        rules={[
          {
            required: true,
            message: "Por favor ingrese la unidad a la que pertenece",
          },
        ]}
      >
        <Input
          placeholder="Ingrese su Unidad."
          showCount
          maxLength={50}
          onChange={onChangeUnidad}
          value={unidad}
        />
      </Form.Item>
    </>
  );
}

export default Step1;
