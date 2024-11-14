const mongoose = require("mongoose");

const redis = require("redis");
const util = require("util");

const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient(redisURL);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = async function(options={}) {

  this.hashKey = options.hashKey ? options.hashKey: ''

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

  const cacheValue = await client.hget(this.hashKey,key);
  if (cacheValue) {
    console.log("-----from rediss");
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map(x => new this.model(x))
      : new this.model(x); // hydrating Arrays  & objects
  }
  console.log("-----key", key);

  const res = await exec.apply(this, arguments);

  // client.set(key, JSON.stringify(res),'EX',10); // Expiration in 10 sec
  client.hset(this.hashKey,key, JSON.stringify(res)); // set nested Objects in redis cache

  
  return res;
};


module.exports = {
   clearHash(key){ // clear nested hash when creating new Record
      client.del(key)
  }
}