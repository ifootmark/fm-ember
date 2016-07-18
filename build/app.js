(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var IDB = require('./db');
var storeBrands = IDB.storeBrands;

var App = Ember.Application.create({
	ready: function(){
        if(!IDB.isSuppoutIndexedDB){
            alert('您的浏览器不支持 IndexedDB');
            return false;
        }
    }
});

/*//create adapter
App.ApplicationAdapter = DS.RESTAdapter.extend({
	namespace: 'footmark'
});
//create model
App.Brand = DS.Model.extend({
	brandLogo: DS.attr('string'),
	brandName: DS.attr('string'),
	brandCode: DS.attr('string'),
	country: DS.attr('string'),
	remark: DS.attr('string'),
	createTime: DS.attr('date'),
	remarkCom: function() {
        var arr = new Array();
        arr.push(this.get('brandName'));
        arr.push(this.get('brandCode'));
        arr.push(this.get('remark'));
        arr = arr.filter(function(n){return n});
        return arr.join(",");
    }.property('brandName','brandCode','remark'),
    createTimeFormat: function(){
        return moment(this.get('createTime')).fromNow();
    }.property('createTime')
});*/


//create class
App.Brand = Ember.Object.extend({
	brandLogo: null,
	brandName: null,
	brandCode: null,
	country: null,
	remark: null,
	createTime: null,
	remarkCom: function() {
        var arr = new Array();
        arr.push(this.get('brandName'));
        arr.push(this.get('brandCode'));
        arr.push(this.get('remark'));
        arr = arr.filter(function(n){return n});
        return arr.join(",");
	}.property('brandName','brandCode','remark'),
    createTimeFormat: function(){
        return moment(this.get('createTime')).fromNow();
    }.property('createTime')
});


App.Router.map(function() {
    this.route('index', {path: '/'});
	this.resource('list', function() {
		this.resource('detail', {path: '/detail/:detail_id'});
        this.resource('update', {path: '/update/:update_id'});
	});
	this.route('add', {path: '/add'});
    this.resource('search');
});
/*App.Router.reopen({
    location: 'history'
});*/


App.ApplicationController = Ember.Controller.extend({
    actions:{
        clearDB:function(){
            if(confirm('确定要清空所有数据吗?')){
                return IDB.clearDB().then(function(data){
                    alert('数据清空成功');
                    return true;
                }).catch(function(error){
                    alert(error);
                    return false;
                });
            }
        },
        deleteDB:function(){
            if(confirm('确定要删除数据库吗?')){
                return IDB.deleteDB().then(function(data){
                    alert('数据库删除成功');
                    return true;
                }).catch(function(error){
                    alert(error);
                    return false;
                });
            }
        }
    }
});

App.IndexRoute = Ember.Route.extend({
    queryParams: {
        r: {
            refreshModel: true,
            replace: true
        },
        nameKey: {
            refreshModel: true,
            replace: true
        }
    },
    model: function(params) {
        var nameKey = params.nameKey;
        if(nameKey){
            return IDB.getList(storeBrands,'nameIndex',nameKey).then(function(data){
                return data;
            }).catch(function(error){
                alert(error);
                return false;
            });
        }else{
            return IDB.getList(storeBrands,null,null).then(function(data){
                return data;
            }).catch(function(error){
                alert(error);
                return false;
            });            
        }
    },
    afterModel: function(model, transition, queryParams) {
        //console.log(model.get('length'));
    }/*,
    renderTemplate: function(){
        this.render('index', {controller: 'about'});
    }*//*,
    setupController: function(controller, model) {
        this.controllerFor('about').set('model', model);
    }*/
});
var words = "zhang wang li zhao liu".w();
App.IndexController = Ember.Controller.extend({
    queryParams: ['r','nameKey'],
    r: null,
    nameKey: '',
    sortProperties: ['createTime'],
    sortAscending: false,
    actions:{
        delete:function(params){
            if(!confirm('确定要删除吗')){
                return false;
            }
            var _that=this;
            return IDB.deleteRecord(storeBrands,params.id).then(function(value){
                _that.transitionToRoute('index',{queryParams: {r: Math.round(Math.random() * 10000)}});
            }).catch(function(error){
                alert(error);
                return false;
            });
        },
        change: function() {
            this.set('foo', words[Math.floor(Math.random()*words.length)]);
        },
        search: function() {
            var nameKey = $('#nameKey').val();
            this.transitionToRoute('index',{queryParams: {nameKey: nameKey}});
        }
    }
});


App.ListRoute = Ember.Route.extend({
	model: function() {      
        return IDB.getList(storeBrands,null,null).then(function(data){
            return data;
        }).catch(function(error){
            alert(error);
            return false;
        });
	}
});
App.ListController = Ember.Controller.extend({
	sortProperties: ['createTime'],
	sortAscending: false,
    actions:{
        delete:function(params){
            if(!confirm('确定要删除吗')){
                return false;
            }
            var _that=this;
            return IDB.deleteRecord(storeBrands,params.id).then(function(value){
                _that.transitionToRoute('index');
                location.href=location.href;
            }).catch(function(error){
                alert(error);
                return false;
            });
        }
    }
});

App.DetailRoute = Ember.Route.extend({
    /*queryParams: {
        category: {
            refreshModel: true,
            replace: true
        }
    },*/
	model: function(params) {
        var id=parseInt(params.detail_id);
        return IDB.getOneByKey(storeBrands, id).then(function(data){
            var m=App.Brand.create(data);
            return m;
        }).catch(function(error){
            alert(error);
            return false;
        });
	},
    afterModel(model){
        var m=App.Brand.create(model);
        $('.v-remark').html(m.get('remarkCom'));
        $('.v-createTime').html(m.get('createTimeFormat'));
    },
    setupController(controller, model) {
        controller.set("model",model);
    }
});
/*App.DetailController = Ember.Controller.extend({
    queryParams: ['category'],
    category: 1
});*/


App.AddController = Ember.Controller.extend({
	actions: {
		save: function() {
			var o_logo=$('#brandLogo');
            var o_name=$('#brandName');
            var o_code=$('#brandCode');
            var o_country=$('#country');
            var o_remark=$('#remark');
            if(o_logo.val()==""){
                o_logo.focus();
                return false;
            }
            if(o_name.val()==""){
                o_name.focus();
                return false;
            }
            if(o_code.val()==""){
                o_code.focus();
                return false;
            }
            var createTime = new Date().getTime();
			var brand = App.Brand.create({
				brandLogo: o_logo.val(),
				brandName: o_name.val(),
				brandCode: o_code.val(),
				country: o_country.val(),
                remark: o_remark.val(),
				createTime: createTime
			});

            var _that = this;
			IDB.addRecord(storeBrands,brand).then(function(value){
                _that.transitionToRoute('index');
            }).catch(function(error){
                alert(error);
                return false;
            });
		},
		goback:function(){
			history.go(-1);
		}
	}
});

App.UpdateRoute = Ember.Route.extend({
    model: function(params) {
        var id=parseInt(params.update_id);
        return IDB.getOneByKey(storeBrands, id).then(function(data){
            return data;
        }).catch(function(error){
            alert(error);
            return false;
        });
    },
    afterModel:function(model){
        $('#country').val(model.country);
    },
    setupController(controller, model) {
        controller.set("model",model);
    }
});

App.UpdateController = Ember.Controller.extend({
    actions:{
        update: function(model) {
            var o_logo=$('#brandLogo');
            var o_name=$('#brandName');
            var o_code=$('#brandCode');
            var o_country=$('#country');
            var o_remark=$('#remark');
            if(o_logo.val()==""){
                o_logo.focus();
                return false;
            }
            if(o_name.val()==""){
                o_name.focus();
                return false;
            }
            if(o_code.val()==""){
                o_code.focus();
                return false;
            }

            var brand = App.Brand.create(model);
            brand.set('brandLogo',o_logo.val());
            brand.set('brandName',o_name.val());
            brand.set('brandCode',o_code.val());
            brand.set('country',o_country.val());
            brand.set('remark',o_remark.val());

            var _that = this;
            IDB.updateRecord(storeBrands,brand).then(function(value){
                _that.transitionToRoute('index');
            }).catch(function(error){
                alert(error);
                return false;
            });
        },
        goback(){
            this.transitionToRoute('index');
        }
    }
});


Ember.Helper.helper('format-date', function(date) {
	return moment(date).fromNow();
});

},{"./db":2}],2:[function(require,module,exports){
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
},{"fm-indexeddb":3}],3:[function(require,module,exports){
'use strict';

module.exports = require('./lib/fm-indexeddb');
},{"./lib/fm-indexeddb":4}],4:[function(require,module,exports){
'use strict';

var localIndexedDB = {
    isSuppoutIndexedDB: function(){
        if(window.indexedDB)
        {
            return true;
        }else{
            return false;
        }
    },
    openDB: function (options,callback) {
        var name=options.name || 'footmark';
        var version=options.version || 1;
        if(!options.db){
            options.db=null;
        }
        var request=window.indexedDB.open(name,version);
        request.onerror=function(e){
            console.log(e.currentTarget.error.message);
        };
        request.onsuccess=function(e){
            var db=e.target.result;
            db.onversionchange = function(event) {
                db.close();
                location.href=location.href;
            };
            options.db=db;
            if(callback){
                callback();            
            }
        };
        request.onupgradeneeded=function(e){
            var db=e.target.result;
            db.onversionchange = function(event) {
                db.close();
                location.href=location.href;
            };

            //create  objectStore
            for(var i=0;i<options.objectStoreList.length;i++){
                var objStore=options.objectStoreList[i];
                var storeName=objStore.name;
                var indexList=objStore.index;
                if(storeName && !db.objectStoreNames.contains(storeName)){
                    var store=db.createObjectStore(storeName, {keyPath: 'id', autoIncrement: true});
                    if(indexList){
                        for(var j=0;j<indexList.length;j++){
                            var indexName=indexList[j].name;
                            var field=indexList[j].field;
                            var unique=indexList[j].unique || false;
                            if(indexName && field){
                                store.createIndex(indexName,field,{unique:unique});
                            }
                        }                        
                    }
                }
            }
            console.log('IndexedDB version changed to '+version);
        };
    },
    addData: function (db,storeName,value){
        var transaction=db.transaction(storeName,'readwrite'); 
        var store=transaction.objectStore(storeName); 
        store.add(value);
    },
    getDataByKey: function (db,storeName,key,callback){
        var transaction=db.transaction(storeName,'readwrite');
        var store=transaction.objectStore(storeName); 
        var request=store.get(key); 
        request.onsuccess=function(e){ 
            var o=e.target.result; 
            if(callback){
                callback(o);
            }
        };
    },
    getDataByIndex: function (db,storeName,indexName,value,callback){
        var transaction=db.transaction(storeName);
        var store=transaction.objectStore(storeName);
        var index = store.index(indexName);
        index.get(value).onsuccess=function(e){
            var o=e.target.result;
            if(callback){
                callback(o);
            }
        }
    },
    updateData: function (db,storeName,value){
        var transaction=db.transaction(storeName,'readwrite');
        var store=transaction.objectStore(storeName); 
        store.put(value);
    },
    deleteDataByKey: function (db,storeName,key){
        var transaction=db.transaction(storeName,'readwrite');
        var store=transaction.objectStore(storeName);
        store.delete(key); 
    },
    clearObjectStore: function (db,storeName){
        var transaction=db.transaction(storeName,'readwrite');
        var store=transaction.objectStore(storeName); 
        store.clear();
    },
    deleteObjectStore: function (db,storeName){
        if(db.objectStoreNames.contains(storeName)){ 
            db.deleteObjectStore(storeName);
        }
    },
    deleteDB: function (dbname){
        var request = window.indexedDB.deleteDatabase(dbname);
        request.onerror = function(event) {
            console.log("Error deleting database.");
        };
        request.onsuccess = function(event) {
            console.log("Database deleted successfully");
        };
    },
    getDataList: function (db,storeName,indexName,value,callback){
        var transaction=db.transaction(storeName);
        transaction.onerror = function(event) {
            console.log("Error");
            preventDefault()
        };    
        transaction.oncomplete = function(event) {
            //console.log("Success");
        };
        var store=transaction.objectStore(storeName);
        var request=null;
        if(indexName){
            var index = store.index(indexName);
            if(value)
                request=index.openCursor(IDBKeyRange.only(value),IDBCursor.prev);
            else
                request=index.openCursor(null,IDBCursor.prev);
        }else{
            request=store.openCursor(null,IDBCursor.prev);
        }
        var data={};
        data.list=[];
        request.onsuccess=function(e){
            var cursor=e.target.result;
            if(cursor){
                var o=cursor.value;
                data.list.push(o);
                cursor.continue();
            }else{
                if(callback){
                    callback(data);
                }
            }
        };
    }
};

/**
options:{
    name:'footmark',
    version:1,
    objectStoreList:[
        {
            name:"Brands",
            index:[
                {name:"nameIndex",field:"brandName",unique:false},
                {name:"codeIndex",field:"brandCode",unique:false}
            ]
        }
    ]
}
*/
var IDB = {
    isSuppoutIndexedDB: localIndexedDB.isSuppoutIndexedDB(),
    openDB: function(options,callback){
        localIndexedDB.openDB(options,callback);
    },
    add: function(db,storeName,value){
        localIndexedDB.addData(db,storeName,value);
    },
    update: function(db,storeName,value){
        localIndexedDB.updateData(db,storeName,value);
    },
    delete: function(db,storeName,key){
        localIndexedDB.deleteDataByKey(db,storeName,key);
    },
    getOneByKey: function(db,storeName,key,callback){
        localIndexedDB.getDataByKey(db,storeName,key,callback);
    },
    getOneByIndex: function(db,storeName,indexName,value,callback){
        localIndexedDB.getDataByIndex(db,storeName,indexName,value,callback);
    },
    getList: function(db,storeName,indexName,value,callback){
        localIndexedDB.getDataList(db,storeName,indexName,value,callback);
    },
    clearDB: function(db,storeName){
        localIndexedDB.clearObjectStore(db,storeName);
    },    
    deleteDB: function(dbname){
        localIndexedDB.deleteDB(dbname);
    },
    closeDB: function(db){
        db.close();
    }
};

(function(root, IDB){
    if (typeof define === 'function' && define.amd) {
        define('IDB',[], IDB);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = IDB;
    } else {
        root.IDB = IDB;
    }
})(this, IDB);

},{}]},{},[1]);
