'use strict';

var IDB = require('fm-indexeddb');
var idb_options={
    name:'footmark',
    version:1,
    objectStoreList:[
        {
            name:"Brands",
            index:[
                {name:"nameIndex",field:"brandName",unique:false},
                {name:"codeIndex",field:"brandCode",unique:false},
                {name:"countryIndex",field:"country",unique:false}
            ]
        }
    ]
}

var db = {};
db.dbName = idb_options.name;
db.storeBrands = idb_options.objectStoreList[0].name;

/**
* ajax('http://localhost:3000/data/brand.json')
* return promise
*/
db.ajax = function(url, options) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        options = options || {};
        options.url = url;
        options.success = function (data) {
            var list=data.list;
            Ember.run(null, resolve, list);
        };
        options.error = function (jqxhr, status, something) {
            Ember.run(null, reject, arguments);
        };
        Ember.$.ajax(options);
    });
};

db.isSuppoutIndexedDB = function() {
    return IDB.isSuppoutIndexedDB;
}

var callDB = function() {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        try{
            if(idb_options.db){
                resolve(true);
            }else{
                IDB.openDB(idb_options, function(){
                    resolve(true);
                });                
            }
        }catch(e){
            reject(false);
        }
    }).then(function(value){
        return value;
    });
}

db.getList = function(storeName,indexName,value) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        callDB().then(function(succ){
            if(succ){
                try{
                    IDB.getList(idb_options.db, storeName,indexName,value, function(data){
                        if (data.list&&data.list.length>0) {
                            resolve(data.list);
                        }else{
                            resolve([]);
                        }
                    });
                }catch(e){
                    reject(e.name + ": " + e.message);
                }
            }else{
                reject('error');
            }
        });
    });
}

db.addRecord = function(storeName,value) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        callDB().then(function(succ){
            if(succ){
                try{
                    IDB.add(idb_options.db,storeName,value);
                    resolve(1);
                }catch(e){
                    reject(e.name + ": " + e.message);
                }
            }else{
                reject('error');
            }
        });
    });
}

db.updateRecord = function(storeName,value) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        callDB().then(function(succ){
            if(succ){
                try{
                    IDB.update(idb_options.db,storeName,value);
                    resolve(1);
                }catch(e){
                    reject(e.name + ": " + e.message);
                }
            }else{
                reject('error');
            }
        });
    });
}

db.deleteRecord = function(storeName,key) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        callDB().then(function(succ){
            if(succ){
                try{
                    IDB.delete(idb_options.db,storeName,key);
                    resolve(1);
                }catch(e){
                    reject(e.name + ": " + e.message);
                }
            }else{
                reject('error');
            }
        });
    });
}

db.getOneByKey = function(storeName,key) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        callDB().then(function(succ){
            if(succ){
                try{
                    IDB.getOneByKey(idb_options.db,storeName,key,function(data){
                        resolve(data);
                    });                    
                }catch(e){
                    reject(e.name + ": " + e.message);
                }
            }else{
                reject('error');
            }
        });
    });
}

db.getOneByIndex = function(storeName,indexName,value) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        callDB().then(function(succ){
            if(succ){
                try{
                    IDB.getOneByIndex(idb_options.db,storeName,indexName,value,function(data){
                        if (data.list&&data.list.length>0) {
                            resolve(data.list);
                        }else{
                            resolve([]);
                        }
                    });                    
                }catch(e){
                    reject(e.name + ": " + e.message);
                }
            }else{
                reject('error');
            }
        });
    });
}

db.clearDB = function(storeName) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        callDB().then(function(succ){
            if(succ){
                try{
                    IDB.clearDB(idb_options.db,storeName);
                    resolve(1);
                }catch(e){
                    reject(e.name + ": " + e.message);
                }
            }else{
                reject('error');
            }
        });
    });
}

db.deleteDB = function() {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        callDB().then(function(succ){
            if(succ){
                try{
                    IDB.deleteDB(idb_options.db);
                    resolve(1);
                }catch(e){
                    reject(e.name + ": " + e.message);
                }
            }else{
                reject('error');
            }
        });
    });
}

db.closeDB = function() {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        callDB().then(function(succ){
            if(succ){
                try{
                    IDB.closeDB(idb_options.db);
                    resolve(1);
                }catch(e){
                    reject(e.name + ": " + e.message);
                }
            }else{
                reject('error');
            }
        });
    });
}

module.exports = db;