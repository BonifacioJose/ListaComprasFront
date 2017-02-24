var app = angular.module('ListaCompras', ['ngResource', 'ui.router']);

app.controller('AppController', function load() {
});

app.factory('ListaCompraFactory', function ($resource) {
    return $resource('https://jsonplaceholder.typicode.com/posts/:id');
});

app.controller('ListaController', function (ListaCompraFactory, $state, $stateParams) {
    this.lista = ListaCompraFactory.query();
});

app.controller('FormController', function (ListaCompraFactory, $state, $stateParams) {
    if ($stateParams.id) {
        this.listaCompra = ListaCompraFactory.get({id: $stateParams.id});
    } else {
        this.listaCompra = new ListaCompraFactory();
    }

    this.save = function () {
        this.listaCompra.$save(function(user){
            $state.go('edit/{id}', {id: listaCompra.id});
        });
    };
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("home");

    $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "page/listacompra/lista.html"
            })
            .state('cadastro', {
                url: "/cadastro",
                templateUrl: "page/listacompra/cadastro.html"
            })
            .state('edit', {
                url: "/cadastro/{id}",
                templateUrl: "page/listacompra/cadastro.html"
            });
});