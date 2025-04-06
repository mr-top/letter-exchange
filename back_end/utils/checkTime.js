function checkTime (original) {
  const localTime = new Date().getTime();
  const originalTime = new Date(original).getTime();
  
  return localTime < originalTime;
}

module.exports = checkTime;