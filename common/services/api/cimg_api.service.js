'use strict';

const FormData = require('form-data');
const ErrorUtilClass = require('../../utils/error.util_class');
const GatewayRequestUtilClass = require('../../utils/gateway_request.util_class');
const LogUtilClass = require('../../utils/log.util_class');

/**
 *
 * Tracking-code  :CCM-SAIMG
 * Lang-code      :TL-CCM-SAIMG
 * @type          :Service
 * @description   :Apis de conexion en Imagen
 *
 */
module.exports = {
  /**
   *
   * @version       :1.0.0
   * @description   :Guardar una imagen en el Servidor de Imagen
   * @param {Number} _idDataCompanyPerson - ID data company person
   * @param {*} _file - Archivo
   * @param {*} _type - Tipo de archivo (img,self,etc)
   * @returns
   *
   */
  async CmmCreateImageService(_idDataCompanyPerson, _file, _type) {
    try {
      if (!_idDataCompanyPerson) throw new ErrorUtilClass(__filename, 'CMM-SAIMGE001', 'Error, parámetro "_idDataCompanyPerson"').server();
      if (!_file) throw new ErrorUtilClass(__filename, 'CMM-SAIMGE002', 'Error, parámet "_file"').server();
      if (!_type) throw new ErrorUtilClass(__filename, 'CMM-SAIMGE003', 'Error, parámetro "_type"').server();
      // Seteamos Form Data
      const FORM = new FormData();
      FORM.append('file', _file.buffer, _file.originalname);
      /** API Request */
      const NEW_REQUEST = new GatewayRequestUtilClass(process.env.JM_URL_CIMG, {
        'Content-Type': `multipart/form-data; boundary=${FORM._boundary}`,
        'api-key': process.env.JM_CIMG_APIKEY,
      });
      // Llamamos el servicio
      const API_RESPONSE = await NEW_REQUEST.post(`/v1/upload/${_type}/${_idDataCompanyPerson}`, FORM).catch((_error) => {
        throw _error;
      });
      // Si no trae nada el response
      if (!API_RESPONSE) throw new ErrorUtilClass(__filename, 'CMM-SAIMGE005', null).api();
      new LogUtilClass('cimg_api_service, CmmCreateImageService').responseApi(API_RESPONSE.data);
      return API_RESPONSE.data;
    } catch (_error) {
      throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-SAIMGE006', _error).server() : _error;
    }
  },

  /**
   *
   * @version       :1.0.0
   * @description   :Borrar una imagen en el Servidor de Imagen
   * @param {String} _url - Direccion donde se guardo
   * @returns
   *
   */
  async CmmDeleteImageService(_url) {
    try {
      if (!_url) throw new ErrorUtilClass(__filename, 'CMM-SAIMGE007', 'Error, parámetro "_url"').server();
      /** API Request */
      const NEW_REQUEST = new GatewayRequestUtilClass(process.env.JM_URL_CIMG, { 'api-key': process.env.JM_CIMG_APIKEY });
      const API_RESPONSE = await NEW_REQUEST.delete(`/v1/delete`, { urlName: _url }).catch((_error) => {
        throw _error;
      });
      // Si no trae nada el response
      if (!API_RESPONSE) throw new ErrorUtilClass(__filename, 'CMM-SAIMGE009', null).api();
      new LogUtilClass('cimg_api_service, CmmDeleteImageService').responseApi(API_RESPONSE.data);
      return API_RESPONSE.data;
    } catch (_error) {
      throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-SAIMGE010', _error).server() : _error;
    }
  },
};
