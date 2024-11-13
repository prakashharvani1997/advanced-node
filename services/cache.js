const mongoose = require('mongoose')

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec  = function(){
    console.log('---- i am in query----')

const key = JSON.stringify(Object.assign({},this.getQuery(),{
colletion: this.mongooseCollection.name
}))

console.log('-----key',key)

    return exec.apply(this,arguments)
}