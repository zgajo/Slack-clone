export default (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define("direct_message", {
    text: DataTypes.STRING
  });

  DirectMessage.associate = models => {
    // 1:m
    DirectMessage.belongsTo(models.Team, {
      foreignKey: { name: "teamId", field: "team_id" }
    });
    DirectMessage.belongsTo(models.User, {
      foreignKey: { name: "receiver", field: "receiver_id" }
    });
    DirectMessage.belongsTo(models.User, {
      foreignKey: { name: "sender", field: "sender_id" }
    });
  };

  return DirectMessage;
};
