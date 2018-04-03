import formatErrors from "../formatErrors";

export default {
  Mutation: {
    createChannel: async (parent, args, { models, user }) => {
      try {
        const channel = await models.Channel.create({ ...args });
        return {
          ok: true,
          channel
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error)
        };
      }
    }
  }
};
