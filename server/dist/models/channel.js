"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (sequelize, DataTypes) => {
  const Channel = sequelize.define("channel", {
    name: DataTypes.STRING,
    dm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Channel.associate = models => {
    // 1:m
    Channel.belongsTo(models.Team, {
      foreignKey: {
        name: "teamId",
        field: "team_id"
      }
    });

    Channel.belongsToMany(models.User, {
      through: "channel_member",
      foreignKey: {
        name: "channelId",
        field: "channel_id"
      }
    });

    Channel.belongsToMany(models.User, {
      through: models.PCMember,
      foreignKey: {
        name: "channelId",
        field: "channel_id"
      }
    });
  };

  return Channel;
};