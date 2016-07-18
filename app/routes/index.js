App.IndexRoute = Ember.Route.extend({
    beforeModel(){
        console.log('beforeModel');
    },
    afterModel(){
        console.log('afterModel');
    },
    model: function() {
        /*var post={  
            title: 'JavaScript prototypes.',  
            body: 'This post will discuss JavaScript prototypes.'  
        }
        var postController = Ember.Controller.create();  
        postController.set('model', post);  
        console.log(postController.get('title')); //  undefined  
        console.log(postController.get('model.title')); // JavaScript prototypes.

        postController = Ember.ObjectController.create();  
        postController.set('model', post);  
        console.log(postController.get('title')); // JavaScript prototypes.*/  

        /*var list = this.get('store').findAll('brand');
        console.log('this is index route');
        return [{id:1,brandName:"123"},{id:2,brandName:"345"}];*/

        console.log(idb_options.db);
        var res=ajax('http://localhost:3000/data/brand.json');
        console.log(res);
        return res;

        /*var r=Ember.$.getJSON('http://localhost:3000/data/brand.json');
        console.log(r);
        return r;*/
    }
});

/*App.IndexController = Ember.ArrayController.extend({
     model: [{"brandName":"aaaa"}]
});*/

function ajax (url, options) {
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