// Validar rut
export const validateRut = (rut) => {
    const rutRegex = /^\d{7,8}-[\d|kK]$/;

    if (!rutRegex.test(rut)) {
      return false;
    }

    const [rutNumber, rutDV] = rut.split("-");
    const rutInt = parseInt(rutNumber, 10);

    // Se calcula el dígito verificador esperado
    const expectedDV = calculateExpectedDV(rutInt);

    return expectedDV === rutDV.toUpperCase();
  };

  // Calcular DV rut
  export const calculateExpectedDV = (rutInt) => {
    const rutString = rutInt.toString();
    const reversedRutArray = rutString.split("").reverse();
    let multiplier = 2;
    let sum = 0;

    for (let i = 0; i < reversedRutArray.length; i++) {
      sum += parseInt(reversedRutArray[i], 10) * multiplier;

      if (multiplier < 7) {
        multiplier += 1;
      } else {
        multiplier = 2;
      }
    }
    const result = 11 - (sum % 11);
    return result === 11 ? "0" : result === 10 ? "K" : result.toString();
  };

  // Formatear dato a Fecha de SP
  export function formatearFechaAprobacion(fechaString) {
    // Verifica si fechaString es nulo, indefinido o una cadena vacía
    if (!fechaString) {
      return ''; // Devuelve una cadena vacía si no hay datos de fecha de aprobación
    }
  
    let fecha = new Date(fechaString);
    
    let dia = String(fecha.getUTCDate()).padStart(2, "0");
    let mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    let ano = fecha.getUTCFullYear();
    let horas = String(fecha.getUTCHours()).padStart(2, "0");
    let minutos = String(fecha.getUTCMinutes()).padStart(2, "0");
    let segundos = String(fecha.getUTCSeconds()).padStart(2, "0");
  
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }

    // Función para formatear la fecha
   export function formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
  
      return new Date(dateString).toLocaleDateString("es-CL", options);
    }

    export const validateEmail = (email) => {
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!correoRegex.test(email)) {
        return false;
      }
    
      const atIndex = email.indexOf("@");
      const dotIndex = email.indexOf(".", atIndex);
    
      if (
        atIndex > 0 && // El arroba no puede estar al inicio
        atIndex === email.lastIndexOf("@") && // Solo puede haber un arroba
        dotIndex > atIndex + 1 && // Debe haber al menos un caracter entre el arroba y el punto
        dotIndex < email.length - 1 && // El punto no puede estar al final
        email.lastIndexOf(".") !== email.length - 1 // El punto no puede estar al final
      ) {
        return true; // Retorna true si el correo es válido
      } else {
        return false; // Retorna false si el correo no cumple con los criterios
      }
    };
    
    export const validateEmailUandes = (email) => {
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!correoRegex.test(email)) {
        return false;
      }
    
      const atIndex = email.indexOf("@");
      const dotIndex = email.indexOf(".", atIndex);
    
      if (
        atIndex > 0 && // El arroba no puede estar al inicio
        atIndex === email.lastIndexOf("@") && // Solo puede haber un arroba
        dotIndex > atIndex + 1 && // Debe haber al menos un caracter entre el arroba y el punto
        dotIndex < email.length - 1 && // El punto no puede estar al final
        email.lastIndexOf(".") !== email.length - 1 && // El punto no puede estar al final
        email.substr(atIndex + 1) === "uandes.cl" // Verificar que el dominio sea "uandes.cl"
      ) {
        return true; // Retorna true si el correo es válido
      } else {
        return false; // Retorna false si el correo no cumple con los criterios
      }
    };