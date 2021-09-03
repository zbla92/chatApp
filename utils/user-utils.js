/**
 * standardizeUser - Standardizes user and strips unnecessary data
 * @param   {Object}  user  Full user object
 * @returns {Object}        Stripped down user information
 */
exports.standardizeUser = (user) => ({
  id: user.id || null,
  email: user.email || null,
  firstName: user.firstName || null,
  lastName: user.lastName || null,
  profilePicture: user.profilePicture || null,
});
