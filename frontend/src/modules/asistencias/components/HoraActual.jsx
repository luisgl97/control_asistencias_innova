import React, { useState, useEffect } from 'react';

const HoraActual = () => {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date());
    }, 1000); // actualiza cada segundo

    return () => clearInterval(intervalo); // limpia el intervalo al desmontar
  }, []);

  return (
    <div>
      <p className="text-xs sm:text-sm font-medium">
        Hora Actual
      </p>
      <p className="text-sm sm:text-base font-semibold">
        {hora.toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit', // opcional, si quieres ver los segundos también
          hour12: false, // o true si prefieres formato 12h
          timeZone: 'America/Lima'
        })}
      </p>
    </div>
  );
};

export default HoraActual;
