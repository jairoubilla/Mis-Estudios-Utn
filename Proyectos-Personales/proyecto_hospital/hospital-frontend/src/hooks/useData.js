import { useCallback, useEffect, useState } from 'react';
import API_ENDPOINTS from '../config/api.config';
import apiClient from '../lib/apiClient';

export const useData = () => {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const obtenerDatos = useCallback(async () => {
    try {
      const [resP, resM, resT] = await Promise.all([
        apiClient.get(API_ENDPOINTS.PACIENTES),
        apiClient.get(API_ENDPOINTS.MEDICOS),
        apiClient.get(API_ENDPOINTS.TURNOS)
      ]);
      setPacientes(resP.data);
      setMedicos(resM.data);
      setTurnos(resT.data);
      return {
        pacientes: resP.data,
        medicos: resM.data,
        turnos: resT.data,
      };
    } catch (err) {
      console.error("Error al cargar datos", err);
      return null;
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { obtenerDatos() }, [obtenerDatos]);

  return { pacientes, medicos, turnos, obtenerDatos };
};
