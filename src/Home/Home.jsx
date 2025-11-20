import React, { useState, useEffect } from "react";
import { sp_api_get_json } from "../api/sp_api_json";
import "../Home/Home.css";
import Config from "../configEnv"; // Importa el archivo de configuración

function Home() {
  const [currentUserName, setCurrentUserName] = useState(""); // Variable para el nombre de usuario

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const jsonCurrentUser = await sp_api_get_json(Config.winLocationRefLink+"/_api/web/CurrentUser");
        console.log(jsonCurrentUser);

        const userName = jsonCurrentUser.Title;
        setCurrentUserName(userName); // Establecer el nombre de usuario en el estado
      } catch (error) {
        console.log("Error", error);
      } finally {

      }
    }
    getCurrentUser();
  }, []);
  return (
    <div>
      <div>
        <div className="imgUandes"></div>
        <h1
          style={{
            color: "#e10e17",
          }}
        >
          Mesa de Ayuda SAP S/4 HANA
        </h1>
      </div>
      <br></br>
      <p>
        Bienvenido al formulario de incidencias de S/4 HANA.
      </p>
      <br></br>
      <p>
      Queremos que puedas aprovechar al máximo SAP S/4HANA. Por eso, te ofrecemos un canal directo para resolver cualquier duda o problema que tengas.
      </p>
      <br></br>
      <br></br>
      <p>
      <b>Dirección de Sistemas y Tecnologías de Información</b>
      </p>
    </div>
  );
}

export default Home;
