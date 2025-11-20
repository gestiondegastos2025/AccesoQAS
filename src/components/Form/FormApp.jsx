import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Steps } from "antd";
import "./FormApp.css";
import "../Maincss/Btn.css";
import Config from "../../configEnv"; // Importa el archivo de configuración

import Step1 from "../Steps(FormApp)/Step1_InformacionDelUsuario";
import Step2 from "../Steps(FormApp)/Step2_DetallesDelProblema";
import Step3 from "../Steps(FormApp)/Step3_InformacionAdicional";

import {
  sp_api_contextInfo_json,
  sp_api_post_json,
  sp_api_post_json_file,
  sp_api_get_json,
  sp_api_update_json,
} from "../../api/sp_api_json";

const { Step } = Steps;

function FormApp() {
  //CONSTANT
  const [form] = Form.useForm(); // Instancia del formulario
  const [currentStep, setCurrentStep] = useState(0); // steps para las vistas del formulario

  // campos formulario: Step1
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [unidad, setUnidad] = useState(""); //2
  const [entidad, setEntidad] = useState("");
  // campos formulario: Step2
  const [tituloIncidencia, setTituloIncidencia] = useState(""); //3
  const [sistemaAdministrativo, setSistemaAdministrativo] = useState(""); //3
  const [modulo, setModulo] = useState(""); //3
  const [tipoSolicitud, setTipoSolicitud] = useState(""); //1
  const [nivelPrioridad, setNivelPrioridad] = useState(""); //1
  const [informacionAdicional, setInformacionAdicional] = useState(""); //9
  // campos formulario: Step3

  const [fileList, setFileList] = useState([]); //19

  // modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Función para recargar la página
  const reloadPage = () => {
    window.location.reload();
  };

  // Nuevo estado para el modal de confirmación
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);

  // Función para mostrar el modal de confirmación
  const showConfirmationModal = () => {
    setIsConfirmationModalVisible(true);
  };

  // Función para ocultar el modal de confirmación
  const hideConfirmationModal = () => {
    setIsConfirmationModalVisible(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  //FUNCTION
  const onFinish = async () => {
    // Validar los campos antes de enviar
    await form
      .validateFields()
      .then(async () => {
        showConfirmationModal(); // Mostrar el modal de confirmación
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //campos formulario: Step1 handleDropdownList

  // CurrentUserName y CurrentUSerEmail van por parámetro

  const handleChangeEntidad = (value) => {
    console.log(`selected entidad: ${value}`);
    setEntidad(value);
  };
  const onChangeUnidad = (e) => {
    console.log("Change unidad:", e.target.value);
    setUnidad(e.target.value);
  };

  //campos formulario: Step2 handleDropdownList
  const onChangeTituloIncidencia = (e) => {
    console.log("Change título incidencia:", e.target.value);
    setTituloIncidencia(e.target.value);
  };
  const handleChangeSistemaAdministrativo = (value) => {
    console.log(`selected sistema administrativo: ${value}`);
    setSistemaAdministrativo(value);
    setModulo(""); // Borrar el valor del módulo al cambiar el sistema administrativo
    form.resetFields(["modulo"]); // Restablecer el campo del módulo en el formulario
  };
  const handleChangeModulo = (value) => {
    console.log(`selected módulo: ${value}`);
    setModulo(value);
  };
  const handleChangeTipoSolicitud = (value) => {
    console.log(`selected Tipo solicitud: ${value}`);
    setTipoSolicitud(value);
  };
  const handleChangeNivelPrioridad = (value) => {
    console.log(`selected prioridad: ${value}`);
    setNivelPrioridad(value);
  };

  const onChangeInformacionAdicional = (e) => {
    console.log("Change informacion adicional:", e.target.value);
    setInformacionAdicional(e.target.value);
  };

  //campos formulario: Step3 handleDropdownList

  const handleFileChange = ({ fileList }) => {
    console.log("Handle list: ", fileList);
    setFileList(fileList);
  };

  //USEEFFECT
  useEffect(() => {
    async function getCurrentUSer() {
      await sp_api_get_json(Config.winLocationRefLink+"/_api/web/CurrentUser")
        .then(async (json) => {
          console.log("jsonTestRunServer: "+ json);
          console.log("testRunServer");
          setCurrentUserEmail(json.Email);
          setCurrentUserName(json.Title);
          console.log("Current User Name:", json.Title); // Agrega esta línea
        })
        .catch((err) => {
          console.log("Error", err);
        });
    }
    getCurrentUSer();
  }, []);

  const steps = [
    {
      title: "Información del Usuario", //step1
      content: (
        <>
          {/* ... Se importa de Step1_InformacionGeneral.jsx */}
          <Step1
            currentUserName={currentUserName}
            currentUserEmail={currentUserEmail}
            entidad={entidad}
            handleChangeEntidad={handleChangeEntidad}
            unidad={unidad}
            onChangeUnidad={onChangeUnidad}
          />
        </>
      ),
    },
    {
      title: "Detalles del problema o solicitud", //step2
      content: (
        <>
          {/* ... Se importa de Step2_DetalleDelGasto.jsx */}
          <Step2
            tituloIncidencia={tituloIncidencia}
            onChangeTituloIncidencia={onChangeTituloIncidencia}
            sistemaAdministrativo={sistemaAdministrativo}
            handleChangeSistemaAdministrativo={handleChangeSistemaAdministrativo}
            modulo={modulo}
            handleChangeModulo={handleChangeModulo}
            tipoSolicidud={tipoSolicitud}
            handleChangeTipoSolicitud={handleChangeTipoSolicitud}
            nivelPrioridad={nivelPrioridad}
            handleChangeNivelPrioridad={handleChangeNivelPrioridad}
            informacionAdicional={informacionAdicional}
            onChangeInformacionAdicional={onChangeInformacionAdicional}
          />
        </>
      ),
    },
    {
      title: "Información adicional", //step3
      content: (
        <>
          {/* ... Se importa de Step3_JustificacionDocumental.jsx */}
          <Step3 fileList={fileList} handleFileChange={handleFileChange} />
        </>
      ),
    },
  ];

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Obtén la fecha y hora actual
      const currentDateTime = new Date();

      // Formatea la fecha y hora en el formato ISO8601 (formato de fecha y hora aceptado por SharePoint)
      const formattedDate = currentDateTime.toISOString();

          // Concatenar entidad y unidad
    const entidadModulo = `${entidad} ${modulo}`;

      const data = {
        Title: tituloIncidencia,//OK
        [Config.nombreDelUsuario]: currentUserName, //OK
        [Config.informacionDeContactoDelUsuario]: currentUserEmail, //OK
        [Config.fechaCreacion]: formattedDate, //OK
        [Config.entidad]: entidad, //OK
        [Config.unidad]: unidad, //OK
        [Config.tituloIncidencia]: tituloIncidencia, //OK
        [Config.modulo]: modulo, //OK
        [Config.entidadModulo]: entidadModulo,
        [Config.tipoSolicitud]: tipoSolicitud, //OK
        [Config.prioridad]: nivelPrioridad, //OK
        [Config.descripcion]: informacionAdicional, //OK
        [Config.sistemaAdministrativo]: sistemaAdministrativo,//OK
      };

      const digest = await sp_api_contextInfo_json(
        Config.urlContextInfo
      );
      const response = await sp_api_post_json(
        Config.urlLinkSolicitudesTickets,
        digest,
        data
      );

      console.log(`OK POST CON ID REGISTRO: "${response.ID}"`);

      if (response.Id !== "") {
        for (let i = 0; i < fileList.length; i++) {
          const fileName = fileList[i].originFileObj.name;
          const reader = new FileReader();

          const fileDataPromise = new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
          });

          reader.readAsArrayBuffer(fileList[i].originFileObj);
          const fileData = await fileDataPromise;

          await sp_api_post_json_file(
            `${Config.urlLinkSolicitudesTickets}('${response.Id}')/AttachmentFiles/add(FileName='${fileName}')`,
            digest,
            fileData
          );

          console.log(`OK CARGA ARCHIVO: ${i}`);
        }

        // Obtén el año actual
        const currentYear = new Date().getFullYear();

        // Construye el objeto dataId
        const dataId = {
          [Config.numeroDeTicket]: `${String(response.Id)}00${currentYear}`,
        };

        await sp_api_update_json(
          `${Config.urlLinkSolicitudesTickets}('${response.Id}')`,
          digest,
          dataId
        );

        console.log("Se realizó correctamente la actualización");
        setIsSubmitting(false); // Restablece isSubmitting a false
        hideConfirmationModal();
        setIsModalVisible(true); // Mostrar el modal
      } else {
        throw new Error("Error al crear el registro");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Error al enviar el formulario:", error);
      hideConfirmationModal();
      setIsSubmitting(false); // Habilitar el estado de envío
    }
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Form
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 10 }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          scrollToFirstError={true}
          form={form} // Asigna la instancia del formulario
        >
          {/* aqui debiese haber un salto de linea */}
          <Steps current={currentStep} className="custom-steps">
            {steps.map((step) => (
              <Step key={step.title} title={step.title} />
            ))}
          </Steps>
          {/* Agrega un margen inferior entre los pasos y el contenido del formulario */}
          <div
            className="steps-content custom-steps-content"
            style={{ marginBottom: "30px", marginTop: "40px" }}
          >
            {steps[currentStep].content}
          </div>
          <div className="steps-action">
            {currentStep > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={handlePrev}>
                Atrás
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  // Validar los campos antes de avanzar
                  form
                    .validateFields()
                    .then(() => {
                      handleNext(); // Avanzar al siguiente paso si la validación es exitosa
                    })
                    .catch((errorInfo) => {
                      console.log("Validation failed:", errorInfo);
                    });
                }}
              >
                Siguiente
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                disabled={isSubmitting} // Deshabilita el botón cuando se está enviando
                loading={isSubmitting} // Muestra un indicador de carga cuando se está enviando
              >
                {isSubmitting ? "Enviando..." : "Enviar"}{" "}
                {/* Cambia el texto del botón */}
              </Button>
            )}
          </div>
        </Form>

        {/* Modal de confirmación */}
        <Modal
          title="Confirmación"
          open={isConfirmationModalVisible}
          onCancel={hideConfirmationModal}
          footer={[
            <Button key="cancel" onClick={hideConfirmationModal}>
              Cancelar
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={() => {
                setIsSubmitting(true); // Establece isSubmitting en true antes de ejecutar handleSubmit
                handleSubmit(); // Llama a la función handleSubmit después de establecer isSubmitting en true
              }}
              loading={isSubmitting} // Añadir un indicador de carga
            >
              Confirmar
            </Button>,
          ]}
        >
          ¿Está seguro de que desea enviar el formulario?
        </Modal>

        {/* Modal de éxito */}
        <Modal
          title="Éxito"
          open={isModalVisible}
          onOk={() => {
            setIsModalVisible(false);
            form.resetFields(); // Limpiar el formulario cuando se cierre el modal
            reloadPage(); // Recargar la página después de cerrar el modal de éxito
          }}
          cancelButtonProps={{ style: { display: "none" } }} // Oculta el botón "Cancelar"
          // onCancel={() => {
          //   setIsModalVisible(false);
          //   form.resetFields(); // Limpiar el formulario cuando se cierre el modal
          // }}
        >
          ¡El formulario se envió exitosamente!
        </Modal>
      </div>
    </>
  );
}

export default FormApp;
