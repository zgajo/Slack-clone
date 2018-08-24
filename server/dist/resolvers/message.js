"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _permissions = require("../permissions");

var _graphqlSubscriptions = require("graphql-subscriptions");

var _pubsub = require("../pubsub");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

exports.default = {
  Subscription: {
    newChannelMessage: {
      subscribe: _permissions.requiresTeamAccess.createResolver((0, _graphqlSubscriptions.withFilter)(function () {
        return _pubsub.pubsub.asyncIterator(NEW_CHANNEL_MESSAGE);
      }, function (payload, args) {
        return payload.channelId === args.channelId;
      }))
    }
  },
  Query: {
    messages: _permissions.requiresAuth.createResolver(function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, _ref2, _ref3) {
        var cursor = _ref2.cursor,
            channelId = _ref2.channelId;
        var models = _ref3.models,
            user = _ref3.user;
        var channel, member, options;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return models.Channel.findOne({
                  raw: true,
                  where: { id: channelId }
                });

              case 2:
                channel = _context.sent;

                if (channel.public) {
                  _context.next = 9;
                  break;
                }

                _context.next = 6;
                return models.PCMember.findOne({
                  raw: true,
                  where: { channelId: channelId, userId: user.id }
                });

              case 6:
                member = _context.sent;

                if (member) {
                  _context.next = 9;
                  break;
                }

                throw new Error("Not Authorized");

              case 9:
                options = {
                  order: [["created_at", "DESC"]],
                  where: { channelId: channelId },
                  limit: 25
                };


                if (cursor) {
                  // sequelize model messages has to have indexed creted_at field,
                  // so it could work faster
                  options.where.created_at = (0, _defineProperty3.default)({}, models.sequelize.Op.lt, cursor);
                }

                return _context.abrupt("return", models.Message.findAll(options, { raw: true }));

              case 12:
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
    createMessage: _permissions.requiresAuth.createResolver(function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(parent, _ref5, _ref6) {
        var file = _ref5.file,
            args = (0, _objectWithoutProperties3.default)(_ref5, ["file"]);
        var models = _ref6.models,
            user = _ref6.user;
        var messageData, message, asyncFunc;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                messageData = args;

                if (file) {
                  messageData.filetype = file.type;
                  messageData.url = file.path;
                }
                _context3.next = 5;
                return models.Message.create((0, _extends3.default)({}, messageData, {
                  userId: user.id
                }));

              case 5:
                message = _context3.sent;

                asyncFunc = function () {
                  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                    var currentUser;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return models.User.findOne({
                              where: {
                                id: user.id
                              }
                            });

                          case 2:
                            currentUser = _context2.sent;


                            console.log((0, _extends3.default)({}, message.dataValues, {
                              user: currentUser.dataValues
                            }));

                            _pubsub.pubsub.publish(NEW_CHANNEL_MESSAGE, {
                              channelId: args.channelId,
                              newChannelMessage: (0, _extends3.default)({}, message.dataValues, {
                                user: currentUser.dataValues
                              })
                            });

                          case 5:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, undefined);
                  }));

                  return function asyncFunc() {
                    return _ref7.apply(this, arguments);
                  };
                }();

                asyncFunc();

                return _context3.abrupt("return", true);

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](0);

                console.log(_context3.t0);
                return _context3.abrupt("return", false);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[0, 11]]);
      }));

      return function (_x4, _x5, _x6) {
        return _ref4.apply(this, arguments);
      };
    }())
  },
  Message: {
    url: function url(parent, args, _ref8) {
      var server_url = _ref8.server_url;
      return parent.url ? server_url + "/" + parent.url : parent.url;
    },
    user: function user(_ref9, args, _ref10) {
      var _user = _ref9.user,
          userId = _ref9.userId;
      var models = _ref10.models;

      if (_user) {
        return _user;
      }
      return models.User.findOne({ where: { id: userId } });
    }
  }
};