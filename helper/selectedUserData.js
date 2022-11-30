const selectedUserData = async (userData) => {
  console.log("helper", userData);
  if (!Array.isArray(userData)) {
		delete userData.password;
		delete userData.createdAt;
		delete userData.updatedAt;
		return userData;
  }
  const replacedItem = userData.map((item) => {
    return { ...item._doc }
  })
  const selectedUser = replacedItem.map((item) => {
		delete item.password;
		delete item.createdAt;
    delete item.updatedAt;
    return item
  });
  return selectedUser
};

module.exports = { selectedUserData };