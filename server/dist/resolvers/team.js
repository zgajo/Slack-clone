"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatErrors = require("../formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _permissions = require("../permissions");

var _channel = require("./channel");

var _channel2 = _interopRequireDefault(_channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Query: {
    getTeamMembers: _permissions.requiresAuth.createResolver(function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, _ref2, _ref3) {
        var teamId = _ref2.teamId;
        var models = _ref3.models,
            user = _ref3.user;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", models.sequelize.query("SELECT * FROM users as u JOIN  members as m ON m.user_id = u.id WHERE m.team_id = ?", {
                  replacements: [teamId],
                  model: models.User,
                  raw: true
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }())
  },
  Mutation: {
    createTeam: _permissions.requiresAuth.createResolver(function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(parent, args, _ref5) {
        var models = _ref5.models,
            user = _ref5.user;
        var response;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return models.sequelize.transaction(function () {
                  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(transaction) {
                    var team;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return models.Team.create((0, _extends3.default)({}, args), { transaction: transaction });

                          case 2:
                            team = _context2.sent;
                            _context2.next = 5;
                            return models.Channel.create({
                              name: "general",
                              public: true,
                              teamId: team.id
                            }, { transaction: transaction });

                          case 5:
                            _context2.next = 7;
                            return models.Member.create({
                              teamId: team.id,
                              userId: user.id,
                              admin: true
                            }, { transaction: transaction });

                          case 7:
                            return _context2.abrupt("return", team);

                          case 8:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, undefined);
                  }));

                  return function (_x7) {
                    return _ref6.apply(this, arguments);
                  };
                }());

              case 3:
                response = _context3.sent;
                return _context3.abrupt("return", {
                  ok: true,
                  team: response
                });

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);

                console.log(_context3.t0);
                return _context3.abrupt("return", {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context3.t0, models)
                });

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[0, 7]]);
      }));

      return function (_x4, _x5, _x6) {
        return _ref4.apply(this, arguments);
      };
    }()),
    addTeamMember: _permissions.requiresAuth.createResolver(function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(parent, _ref8, _ref9) {
        var email = _ref8.email,
            teamId = _ref8.teamId;
        var models = _ref9.models,
            user = _ref9.user;

        var memberPromise, userToAddPromise, _ref10, _ref11, member, userToAdd;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                memberPromise = models.Member.findOne({ where: { teamId: teamId, userId: user.id } }, { raw: true });
                userToAddPromise = models.User.findOne({ where: { email: email } }, { raw: true });
                _context4.next = 5;
                return Promise.all([memberPromise, userToAddPromise]);

              case 5:
                _ref10 = _context4.sent;
                _ref11 = (0, _slicedToArray3.default)(_ref10, 2);
                member = _ref11[0];
                userToAdd = _ref11[1];

                if (member.admin) {
                  _context4.next = 11;
                  break;
                }

                return _context4.abrupt("return", {
                  ok: false,
                  errors: [{ path: "email", message: "You cannot add members to the team" }]
                });

              case 11:
                if (userToAdd) {
                  _context4.next = 13;
                  break;
                }

                return _context4.abrupt("return", {
                  ok: false,
                  errors: [{
                    path: "email",
                    message: "Could not find user with this email"
                  }]
                });

              case 13:
                _context4.next = 15;
                return models.Member.create({ userId: userToAdd.id, teamId: teamId });

              case 15:
                return _context4.abrupt("return", {
                  ok: true
                });

              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4["catch"](0);

                console.log(_context4.t0);
                return _context4.abrupt("return", {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context4.t0, models)
                });

              case 22:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, undefined, [[0, 18]]);
      }));

      return function (_x8, _x9, _x10) {
        return _ref7.apply(this, arguments);
      };
    }())
  },
  Team: {
    channels: function channels(_ref12, args, _ref13) {
      var id = _ref12.id;
      var channelLoader = _ref13.channelLoader;
      return channelLoader.load(id);
    },
    directMessageMembers: function directMessageMembers(_ref14, args, _ref15) {
      var id = _ref14.id;
      var models = _ref15.models,
          user = _ref15.user;
      return models.sequelize.query("select distinct on (u.id) u.id, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId", {
        replacements: { currentUserId: user.id, teamId: id },
        model: models.User,
        raw: true
      });
    }
  }
};