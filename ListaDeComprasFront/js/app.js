var app = angular.module('ListaCompras', ['ngResource', 'ui.router']);

app.controller('AppController', function load() {
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
            });
});