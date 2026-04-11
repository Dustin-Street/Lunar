export function buildJwtPayload(user) {
  return {
    _id: user._id,
    email: user.email,
    username: user.username,
  };
}
