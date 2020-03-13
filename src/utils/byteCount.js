function string(s) {
  return encodeURI(s).split(/%..|./).length - 1;
}

module.exports = { string };
