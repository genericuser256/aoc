Array.prototype.peek = function (method) {
  this.forEach(method);
  return this;
};
