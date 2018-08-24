"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (sequelize, DataTypes) {
  var User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "Username can only be letters and numbers"
        },
        len: {
          args: [2, 10],
          msg: "Username must be between 2-10 characters long"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [4, 25],
          msg: "Password  must be between 4-25 characters long"
        }
      }
    }
  }, {
    hooks: {
      afterValidate: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(user) {
          var hashedPassword;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _bcrypt2.default.hash(user.password, 12);

                case 2:
                  hashedPassword = _context.sent;

                  user.password = hashedPassword;

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, undefined);
        }));

        return function afterValidate(_x) {
          return _ref.apply(this, arguments);
        };
      }()
    }
  });

  User.associate = function (models) {
    // n:m
    User.belongsToMany(models.Team, {
      through: models.Member,
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });

    User.belongsToMany(models.Channel, {
      through: "channel_member",
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });

    User.belongsToMany(models.Channel, {
      through: models.PCMember,
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
  };

  return User;
};