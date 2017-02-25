var app = angular.module('ListaCompras', ['ngResource', 'ui.router', 'blockUI']);

app.controller('AppController', function load() {
});

app.factory('ListaCompraFactory', function ($resource) {
    return $resource('https://jsonplaceholder.typicode.com/posts/:id');
});

app.controller('ListaController', function (ListaCompraFactory, $state, $stateParams) {
    this.lista = ListaCompraFactory.query();
});

app.controller('FormController', function (ListaCompraFactory, $state, $stateParams) {
    this.valorTotal = 0;
    if ($stateParams.id) {
        this.listaCompra = ListaCompraFactory.get({id: $stateParams.id});
        this.lista = ListaCompraFactory.query();
        console.log(this.lista);
        this.produtos = [];
    } else {
        this.listaCompra = new ListaCompraFactory();
        this.lista = ListaCompraFactory.query();
        this.produtos = [];
    };

//    this.save = function () {
//        this.listaCompra.$save(function (listaCompra) {
//            $state.go('edit/{id}', {id: listaCompra.id});
//        });
//    };

    this.atualizarValorTotal = function () {
        this.valorTotal = 0;
        for (var i = 0; i < this.produtos.length; i++) {
            this.valorTotal += this.produtos[i].id;
        }
    };

    this.adicionarProduto = function (produto) {
        this.produtos.push(produto);
        var index = this.lista.indexOf(produto);
        if (index > -1) {
            this.lista.splice(index, 1);
        }
        this.atualizarValorTotal();
    };

    this.removerProduto = function (produto) {
        this.lista.push(produto);
        var index = this.produtos.indexOf(produto);
        if (index > -1) {
            this.produtos.splice(index, 1);
        }
        this.atualizarValorTotal();
    };
    
});

app.config(function (blockUIConfig) {
    blockUIConfig.templateUrl = 'page/block.html';
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