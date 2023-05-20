'use strict';

const ErrorUtilClass = require('../utils/error.util_class');
const ResponseUtilClass = require('../utils/response.util_class');

/**
 *
 * Tracking-code  :CCM-MCH
 * Lang-code      :TL-CCM-MCH
 * @type          :Middleware
 * @version       :1.0.0
 * @description   :Identificar el canal del gateway.
 * @param {Number} _idChannel - Identificador del Canal
 * @returns
 *
 */
module.exports = (_idChannel) => async (_req, _res, _next) => {
  const JM_RESPONSE = new ResponseUtilClass(_req, _res);
  try {
    _req.CC.idChannel = _idChannel;
    return _next();
  } catch (_error) {
    return JM_RESPONSE.sendError(!_error.errorType ? new ErrorUtilClass(__filename, 'CMM-MCHE001', _error).server() : _error);
  }
};
