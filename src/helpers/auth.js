function hasRoles(userRoles, to) {
  return userRoles.some((role) => to.includes(role));
}

export default hasRoles;
