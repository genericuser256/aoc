Array.prototype.peek = function (method) {
  this.forEach(method);
  return this;
};

Array.prototype.ptAt = function (pt) {
  if (!this[pt.y]) {
    return undefined;
    // throw `${pt} not in ${this.join(",")}`;
  }
  return this[pt.y][pt.x];
};
Array.prototype.setAt = function (pt, value) {
  if (!this[pt.y]) {
    throw `${pt} not in ${this.join(",")}`;
  }
  this[pt.y][pt.x] = value;
};
