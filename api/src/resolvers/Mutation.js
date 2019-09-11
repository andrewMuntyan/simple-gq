const Mutations = {
  async createCategory(parent, args, ctx, info) {
    const { name } = args;
    const trimmedName = name.trim();

    if (!trimmedName.length) {
      throw new Error('invalid input data');
    }

    // TODO: check if they are logged in
    const category = await ctx.db.mutation.createCategory(
      {
        data: { name: trimmedName }
      },
      info
    );

    return category;
  },
  async createWord(parent, args, ctx, info) {
    const {
      content,
      category: {
        connect: { name }
      }
    } = args;
    const trimmedName = name.trim();
    const trimmedContent = content.trim();

    if (!trimmedName.length || !trimmedContent.length) {
      throw new Error('invalid input data');
    }

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
  },
  async deleteWord(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the word
    const word = await ctx.db.query.words({ where }, `{ id content}`);
    if (!word) {
      throw new Error('No such Word in Database');
    }
    // 2. Delete it!
    const res = await ctx.db.mutation.deleteManyWords({ where }, info);

    return res;
  },
  async deleteCategory(parent, args, ctx, info) {
    const where = { name: args.name };
    // 1. find the category
    const category = await ctx.db.query.categories({ where }, `{ id name}`);
    if (!category) {
      throw new Error('No such Category in Database');
    }
    // 2. Delete it!
    const deletedCategory = await ctx.db.mutation.deleteCategory(
      { where },
      info
    );

    return deletedCategory;
  }
};

module.exports = Mutations;
