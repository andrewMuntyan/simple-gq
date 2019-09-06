const Mutations = {
  async createCategory(parent, args, ctx, info) {
    // TODO: check if they are logged in
    const category = await ctx.db.mutation.createCategory(
      {
        data: { ...args }
      },
      info
    );

    return category;
  },
  async createWord(parent, args, ctx, info) {
    // TODO: check if they are logged in
    const createdWord = await ctx.db.mutation.createWord(
      {
        data: {
          ...args
        }
      },
      info
    );
    return createdWord;
  }
};

module.exports = Mutations;
