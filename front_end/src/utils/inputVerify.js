function checkUsername (username) {
  const regex = new RegExp(/^[0-9A-Za-z]{6,16}$/, 'gm');
  return regex.test(username);
}

function checkEmail (email) {
  const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'gm');
  return regex.test(email.toLowerCase());
}

function checkPassword (password) {
  const regex = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'gm');
  return regex.test(password);
}

function checkDuplicate (password, anotherPassword) {
  return password === anotherPassword;
}

function signup (username, email, password, anotherPassword) {
  return checkUsername(username) && checkEmail(email) && checkPassword(password) && checkDuplicate(password, anotherPassword);
}

export default {checkUsername, checkEmail, checkPassword, checkDuplicate, signup};