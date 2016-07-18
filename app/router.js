
var App = Ember.Application.create({
    totalReviews: 0, 
    ready: function(){ 
        //alert('helloooooooooo!');
    }
});

App.Router.map(function() {
    this.resource('index', {path: '/'}, function() {
        this.resource('detail', {path: '/detail/:detail_id'});      
    });
    this.route('add', {path: '/add'});
    this.route('about');
});