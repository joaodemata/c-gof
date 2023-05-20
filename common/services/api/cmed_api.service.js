'use strict';

const ErrorUtilClass = require('../../utils/error.util_class');
const GatewayRequestUtilClass = require('../../utils/gateway_request.util_class');
const LogUtilClass = require('../../utils/log.util_class');

/** API Request */
const NEW_REQUEST = new GatewayRequestUtilClass(process.env.JM_URL_CMED, { 'api-key': process.env.JM_CMED_APIKEY });

/**
 *
 * Tracking-code  :CCM-SAMED
 * Lang-code      :TL-CCM-SAMED
 * @type          :Service
 * @version       :1.0.0
 * @description   :Apis de conexion de Media
 *
 */
module.exports = {
  /**
   *
   * @version         :1.0.0
   * @description     :Envío de SMS o emails.
   * @param {Number}  _idDataCompanyPerson - ID data company person
   * @param {*}       _destination - Identificadores de los destinatarios
   * @param {Integer} _destination.id - Id Data Company (Opcional)
   * @param {Array}   _destination.phones - Array con los telefonos a enviar.
   * @param {Array}   _destination.emails - Array con los correos a enviar.
   * @param {Array}   _transport - Tipo de Medio al cual va enviar el mensaje
   * @param {String}  _method - Tipo de correo y/o SMS a enviar
   * @param {Object}  _body - Información a enviar
   * @returns
   *
   */
  async CmmSendMediaService(_destination, _transport, _method, _body) {
    try {
      if (!_destination) throw new ErrorUtilClass(__filename, 'CMM-SAMEDE001', 'Error, parámetro "_to"').server();
      if (!_transport) throw new ErrorUtilClass(__filename, 'CMM-SAMEDE002', 'Error, parámet "_method"').server();
      if (!_body) throw new ErrorUtilClass(__filename, 'CMM-SAMEDE003', 'Error, parámetro "_body"').server();

      const BODY = {
        destination: _destination,
        transport: _transport,
        method: _method,
        body: _body,
      };

      /* Hacemos el llamado al API MEDIA */
      const API_RESPONSE = await NEW_REQUEST.post(`/v1/notification/media/external`, BODY).catch((_error) => {
        throw new ErrorUtilClass(__filename, 'CMM-SAMEDE007').parseCatch(_error);
      });
      if (!API_RESPONSE) throw new ErrorUtilClass(__filename, 'CMM-SAMEDE005', null).api();
      new LogUtilClass('cmed_api_service, CmmSendMediaService').responseApi(API_RESPONSE.data);
      return API_RESPONSE.data;
    } catch (_error) {
      throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-SAMEDE006', _error).server() : _error;
    }
  },
};
