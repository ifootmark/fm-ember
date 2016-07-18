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
