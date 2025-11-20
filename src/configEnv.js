const BASE_URLS = {
  prd: "https://universidaduandes.sharepoint.com/sites/MesaDeAyudaS4Hana",
  qa: "https://universidaduandes.sharepoint.com/sites/QA_MesaDeAyudaS4Hana",
  local: "http://localhost:8081/sites/QA_MesaDeAyudaS4Hana",
};

// Variables que son las mismas en todos los entornos
const COMMON_VARS = {
  informacionDeContactoDelUsuario: "InformacionDeContactoDelUsuario",
  entidad: "Entidad",
  unidad: "Unidad",
  tituloIncidencia: "TituloIncidencia",
  modulo: "Modulo",
  entidadModulo: "EntidadModulo",
  prioridad: "Prioridad",
  sistemaAdministrativo: "SistemaAdministrativo",
  numeroDeTicket: "NumeroDeTicket",
  feedback: "FeedbackDelUsuario",
  estado: "EstadoDelTicket",
};

const config = {
  prd: {
    // Variables específicas de PRD
    nombreDelUsuario: "NombreDelUsuario_x002f_Solicitan",
    fechaCreacion: "FechaYHoraCreacion",
    descripcion: "Descripci_x00f3_ndelproblema",
    tipoSolicitud: "TipoSolicitud",
  },
  qa: {
    // Variables específicas de QA
    nombreDelUsuario: "NombreDelSolicitante",
    fechaCreacion: "FechaCreacion",
    descripcion: "DescripcionDelProblema",
    tipoSolicitud: "TipoDeSolicitud",
  },
  local: {
    // Variables específicas de Local (pueden ser las mismas que QA si es más fácil)
    nombreDelUsuario: "NombreDelSolicitante",
    fechaCreacion: "FechaCreacion",
    descripcion: "DescripcionDelProblema",
    tipoSolicitud: "TipoDeSolicitud",
  },
};

// Define el entorno actual
const env = "qa"; // Cambia esto por 'prd', 'qa', 'local' según necesites

// Construcción del objeto de configuración final
const baseUrl = BASE_URLS[env]

const exportedConfig = {
  environment: env,
  // URLs construidas dinámicamente
  winLocationRefLink: `${baseUrl}`,
  urlContextInfo: `${baseUrl}/_api/contextinfo`,
  urlLinkSolicitudesTickets: `${baseUrl}/_api/web/lists/getbytitle('${env ==='prod'? 'SolicitudesTickets' :  'QA_SolicitudesTickets' }')/items`,
  urlKeyUsers: `${baseUrl}/_api/web/lists/getbytitle(KeyUser)/items`, // URL de KeyUsers

  // Variables POST/GET
  ...COMMON_VARS, // Incluye las variables comunes
  ...config[env], // Sobrescribe con las variables específicas del entorno
};

export default exportedConfig;