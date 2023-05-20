'use strict';

/**
 * Expresiones regulares
 */
const REGEX = {
  NICKNAME: /^(?=.*[a-z])([a-z0-9._-]+)$/,
  USERNAME: /^(?=.*[a-zñA-ZÑ])(?!.* )(?!.*[\-._]{2})[A-ZÑa-zñ\d][A-ZÑa-zñ\d\-._]{5,39}$/,
  PASSWORD: /^(?!.*(\d|\D)\1{3})(?!.* )(?=.*[A-ZÑ])(?=.*\d)(?=.*[a-zñ])(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~])[A-ZÑa-zñ\d!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]{8,20}$/,
  ONLY_NUMBER: /^[0-9]*$/,
  NATURAL_NUMBERS: /^[1-9]+[0-9]*$/,
  REAL_NUMBERS: /(^[0-9]*[1-9]+[0-9]*\.[0-9]*$)|(^[0-9]*\.[0-9]*[1-9]+[0-9]*$)|(^[0-9]*[1-9]+[0-9]*$)/,
  ETH_ADDRESS: /^0x([A-Fa-f0-9]{40})$/,
};

/**
 * Formatos por defecto
 */
const FORMAT = {
  DATE: 'DD/MM/YYYY',
  TIMESTAMP: 'DD/MM/YYYY, h:mm:ss a',
  HOUR12: 'h:mm:ss a',
  HOUR24: 'h:mm:ss',
};

/**
 * Mensajes estáticos
 */
const MESSAGES = {
  API_TEXT_DEF: 'Los servicios no estan disponibles actualmente, intente nuevamente en unos minutos' /* MENSAJE ESTATICO CON TRYCATH */,
  API_TEXT_VAL_DEF: 'Debe validar todos los parametros' /* MENSAJE ESTATICO TRYCATCH VALIDATE */,
  API_TEXT_VAL_CATH_DEF: 'Valor Incorrecto' /* MENSAJE ESTATICO TRYCATCH VALIDATE */,
};

/** Tipos de Errores */
const TYPE_ERRORS = {
  FRONTEND: 1,
  RETURN_VALIDATE: 2,
  API: 3,
  DATABASE: 4,
  SERVER: 5,
};

module.exports = {
  REGEX,
  FORMAT,
  MESSAGES,
  TYPE_ERRORS,
};
