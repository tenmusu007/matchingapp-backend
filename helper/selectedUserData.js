const selectedUserData = async (userData) => {
  if (!Array.isArray(userData)) {
		delete userData.password;
		delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.__v;
		return userData;
  }
  const replacedItem = userData.map((item) => {
    return { ...item._doc }
  })
  const selectedUser = replacedItem.map((item) => {
		delete item.password;
		delete item.createdAt;
    delete item.updatedAt;
    delete item.__v
    return item
  });
  return selectedUser
};

module.exports = { selectedUserData };
