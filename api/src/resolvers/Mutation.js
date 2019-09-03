const Mutations = {
  async createCategory(parent, args, ctx, info) {
    // TODO: check if they are logged in
    const category = await ctx.db.mutation.createCategory(
      {
        data: { ...args },
      },
      info,
    );

    return category;
  },
};

module.exports = Mutations;
