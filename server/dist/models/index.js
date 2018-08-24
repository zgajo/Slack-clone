"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sequelize = new _sequelize2.default(process.env.TEST_DB || "slack", "dpranjic", "1111", {
  dialect: "postgres",
  operatorsAliases: _sequelize2.default.Op, // to ger rid of Sequelize depricate error message
  define: {
    underscored: true
  }
});

const models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Team: sequelize.import("./team"),
  Member: sequelize.import("./member"),
  Message: sequelize.import("./message"),
  DirectMessage: sequelize.import("./directMessage"),
  PCMember: sequelize.import("./pcmember")
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = _sequelize2.default;

models.op = _sequelize2.default.op;

exports.default = models;