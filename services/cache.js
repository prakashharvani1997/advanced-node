const mongoose = require("mongoose");

const redis = require("redis");
const util = require("util");

const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient(redisURL);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
  this.useCache = true; // togglable Cache
};

mongoose.Query.prototype.exec = async function() {
  console.log("---- i am in query----");

  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      colletion: this.mongooseCollection.name
    })
  );

  const cacheValue = await client.get(key);
  if (cacheValue) {
    console.log("-----from rediss");
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map(x => new this.model(x))
      : new this.model(x); // hydrating Arrays  & objects
  }
  console.log("-----key", key);

  const res = await exec.apply(this, arguments);

  client.set(key, JSON.stringify(res));

  return res;
};
