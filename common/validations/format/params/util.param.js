'use strict';

/* Utils */
const Express = require('express-validator');
const { CMM_CONST } = require('../../../configs');
const ErrorUtilClass = require('../../../utils/error.util_class');

/** Services */
const { CmmIsValidAmountService, CmmRemoveEmojisService } = require('../../../services/util.services');

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :Validar todos primary key
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmPrimaryKeyParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL001', null, 'TL-CMM-PUTL-5').frontend())
      .matches(CMM_CONST.REGEX.NATURAL_NUMBERS)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL002', null, 'TL-CMM-PUTL-6').frontend())
      .isLength({ min: 1, max: 19 })
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL003', null, 'TL-CMM-PUTL-23').frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL004', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Number} _limitAmount - longitud del monto
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmAmountParam = (_tag = '', _location = '', _limitAmount = null, _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL005', null, 'TL-CMM-PUTL-9').frontend())
      .matches(CMM_CONST.REGEX.REAL_NUMBERS)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL006', null, 'TL-CMM-PUTL-6').frontend())
      .custom(async (_value, { req: _req }) => {
        try {
          // Validamos el si el monto existe o que sea un numero
          if (!CmmIsValidAmountService(_value)) throw new ErrorUtilClass(__filename, 'CMM-PUTL007', null, 'TL-CMM-PUTL-6').frontend();
          return true;
        } catch (_error) {
          throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL008', _error).server() : _error;
        }
      })
      .isLength({ min: 1, max: 50 })
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL009', null, 'TL-CMM-PUTL-8').frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL010', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   : Validar un parámetro tipo string.
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Object} _length - longitud del valor del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmStringParam = (_tag = '', _location = '', _length = { min: 3, max: 100 }, _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL011', null, 'TL-CMM-PUTL-9').frontend())
      .customSanitizer((_value) => {
        try {
          if (_value && typeof _value === 'string') return CmmRemoveEmojisService(_value);
        } catch (_error) {
          throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL012', _error).server() : _error;
        }
      })
      .isString()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL013', null, 'TL-CMM-PUTL-10').frontend())
      .isLength(_length)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL014', null, `TP-CMM-PUTL-26((:${_length.min}((:${_length.max}`).frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL015', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   : Validar un parámetro constraseña string
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Object} _length - longitud del valor del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmStringPasswordParam = (_tag = '', _location = '', _length = { min: 3, max: 20 }, _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL016', null, 'TL-CMM-PUTL-9').frontend())
      .customSanitizer((_value) => {
        try {
          // Decodificamos el password a utf-8
          return Buffer.from(String(_value), 'base64').toString('utf-8');
        } catch (_error) {
          throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL017', _error).server() : _error;
        }
      })
      .isString()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL018', null, 'TL-CMM-PUTL-10').frontend())
      .isLength(_length)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL019', null, `TP-CMM-PUTL-26((:${_length.min}((:${_length.max}`).frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL020', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   : Validar un parámetro  constraseña numerica
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Object} _length - longitud del valor del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmNumericPasswordParam = (_tag = '', _location = '', _length = { min: 3, max: 20 }, _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL021', null, 'TL-CMM-PUTL-9').frontend())
      .customSanitizer((_value) => {
        try {
          // Decodificamos el password a utf-8
          return Buffer.from(String(_value), 'base64').toString('utf-8');
        } catch (_error) {
          throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL022', _error).server() : _error;
        }
      })
      .matches(CMM_CONST.REGEX.ONLY_NUMBER)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL023', null, 'TL-CMM-PUTL-6').frontend())
      .isLength(_length)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL024', null, `TP-CMM-PUTL-26((:${_length.min}((:${_length.max}`).frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL025', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :Validar que el parámetro sea una fecha con formato válido
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmDateOperationParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL026', null, 'TL-CMM-PUTL-11').frontend())
      .isDate([{ format: 'YYYY/MM/DD' }, { strictMode: true }, { delimiters: ['/', '-'] }])
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL027', null, 'TL-CMM-PUTL-12').frontend())
      .customSanitizer((_value) => {
        try {
          return String(_value).split('-').join('/');
        } catch (_error) {
          throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL028', _error).server() : _error;
        }
      });
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL029', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :Validar que el parámetro sea un array
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmArrayParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL030', null, 'TL-CMM-PUTL-9').frontend())
      .isArray()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL031', null, 'TL-CMM-PUTL-13').frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL032', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :Validar que el parámetro sea un numérico con numeros naturales
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Object} _length - longitud del valor del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmNumericParam = (_tag = '', _location = '', _length = { min: 3, max: 20 }, _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL033', null, 'TL-CMM-PUTL-9').frontend())
      .matches(CMM_CONST.REGEX.ONLY_NUMBER)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL034', null, 'TL-CMM-PUTL-6').frontend())
      .isLength(_length)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL035', null, `TP-CMM-PUTL-26((:${_length.min}((:${_length.max}`).frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL036', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :Validar que el parámetro sea un Booleano
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmBooleanParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL037', null, 'TL-CMM-PUTL-9').frontend())
      .isBoolean()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL038', null, 'TL-CMM-PUTL-14').frontend())
      .custom((_value) => {
        try {
          if (_value == 0 || _value == 1) throw new ErrorUtilClass(__filename, 'CMM-PUTL038', null, 'TL-CMM-PUTL-14').frontend();
          return true;
        } catch (_error) {
          throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL065', _error).server() : _error;
        }
      });
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL039', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :Validar que el parámetro sea un array
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 */
exports.CmmEmailParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL040', null, 'TL-CMM-PUTL-15').frontend())
      .isLength({ min: 6, max: 254 })
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL041', null, 'TL-CMM-PUTL-16').frontend())
      .isEmail()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL042', null, 'TL-CMM-PUTL-17').frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL043', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   : Validar parámetro nickname/usuario
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 */
exports.CmmNicknameParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL044', null, 'TL-CMM-PUTL-18').frontend())
      .customSanitizer((_value) => {
        try {
          return String(_value).toLowerCase();
        } catch (_error) {
          throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL045', _error).server() : _error;
        }
      })
      .isLength({ min: 3, max: 40 })
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL046', null, 'TL-CMM-PUTL-19').frontend())
      .matches(CMM_CONST.REGEX.NICKNAME)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL047', null, 'TL-CMM-PUTL-20').frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL048', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   : Validar Carga de archivo
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 */
exports.CmmFileServerImageParam = (_tag = '', _location = 'check', _required = true) => {
  try {
    return (
      Express[_location](_tag)
        .if((_value, { req: _req }) => {
          return _value === undefined && _required === false ? false : true;
        })
        .not()
        .isEmpty()
        .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL049', null, 'TL-CMM-PUTL-21').frontend())
        .toLowerCase()
        // TODO: Mejorar esto
        .matches(/^(com|loc|sel|img|dep)$/)
        .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL050', null, 'TL-CMM-PUTL-22').frontend())
    );
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL051', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   : Validar parámetro Address ethereum
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 */
exports.CmmEthAddressParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL052', null, 'TL-CMM-PUTL-18').frontend())
      .matches(CMM_CONST.REGEX.ETH_ADDRESS)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL053', null, 'TL-CMM-PUTL-25').frontend());
  } catch (_error) {
    throw !error.errorType ? new ErrorUtilClass(_filename, 'CMM-PUTL054', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :Validar que el parámetro sea un numérico con numeros naturales
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmLimitParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL055', null, 'TL-CMM-PUTL-9').frontend())
      .matches(CMM_CONST.REGEX.ONLY_NUMBER)
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL056', null, 'TL-CMM-PUTL-6').frontend())
      .customSanitizer((_value) => {
        try {
          // Si el limite es mayor que 20 le colocamos 20
          if (Number(_value) > 20) return 20;
          return _value;
        } catch (_error) {
          throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL057', _error).server() : _error;
        }
      });
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL058', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :Validar que el parámetro este presente
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */
exports.CmmValueDefaultParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL059', null, 'TL-CMM-PUTL-9').frontend());
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL060', _error).server() : _error;
  }
};

/**
 *
 * Tracking-code  :CMM-PUTL
 * Lang-code      :TL-CMM-PUTL
 * @type          :Param
 * @version       :1.0.0
 * @description   :Validar que el parámetro sea un objeto
 * @param {String} _tag - parametro del request
 * @param {String} _location - ubicación del parámetro
 * @param {Boolean} _required - parámetro para indicar si el parámetro es obligatorio u opcional (default = true)
 *
 */

exports.CmmObjectParam = (_tag = '', _location = '', _required = true) => {
  try {
    return Express[_location](_tag)
      .if((_value, { req: _req }) => {
        return _value === undefined && _required === false ? false : true;
      })
      .not()
      .isEmpty()
      .withMessage(new ErrorUtilClass(__filename, 'CMM-PUTL061', null, 'TL-CMM-PUTL-9').frontend())
      .custom((_value, { req: _req }) => {
        try {
          // Si el limite es mayor que 20 le colocamos 20
          if (typeof _value != 'object') throw new ErrorUtilClass(__filename, 'CMM-PUTL062', null, 'TP-CMM-PUTL-27').frontend();
          return _value;
        } catch (_error) {
          throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL063', _error).server() : _error;
        }
      });
  } catch (_error) {
    throw !_error.errorType ? new ErrorUtilClass(__filename, 'CMM-PUTL064', _error).server() : _error;
  }
};

