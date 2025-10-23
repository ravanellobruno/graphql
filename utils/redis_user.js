const redis = require("../config/redis");
const User = require("../models/user");

async function cacheUser(user, expiresIn = 3600) {
  const obj = user.toObject ? user.toObject() : user;
  obj.id = obj._id.toString();
  const cacheKey = `user:${obj.id}`;
  
  await redis.set(cacheKey, JSON.stringify(obj), { EX: expiresIn });
}

async function getCachedUser(id) {
  const key = `user:${id}`;
  const cached = await redis.get(key);

  if (cached) return JSON.parse(cached);

  const user = await User.findById(id).lean();
  
  if (!user) throw new Error("User not found");

  await cacheUser(user);

  return { ...user, id: user._id.toString() };
}

async function deleteCachedUser(id) {
  const key = `user:${id}`;
  await redis.del(key);
}

module.exports = {
  cacheUser,
  getCachedUser,
  deleteCachedUser,
};
