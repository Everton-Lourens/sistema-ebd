// A cache that never expires.
export class Cache extends Map<any, any> {
  set(key: any, value: any) {
    super.set(key, value);
    return this;
  }
  get(key: any) {
    return super.get(key);
  }
  getOrSet(key: any, fn: () => any) {
    if (this.has(key)) {
      return this.get(key);
    } else {
      let value = fn();
      this.set(key, value);
      return value;
    }
  }
  delete(key: any) {
    return super.delete(key);
  }
  clear() {
    super.clear();
  }
}

