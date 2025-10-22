function requireAuth(resolver) {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }

    return resolver(parent, args, context, info);
  };
}

module.exports = requireAuth;
