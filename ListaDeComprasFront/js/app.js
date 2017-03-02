var app = angular.module('ListaCompras', ['ngResource', 'ui.router', 'blockUI', 'ui.utils.masks']);

app.run(function ($rootScope) {
    $rootScope.currencyFormat = function (valor) {
        return valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}).replace("R$", "");
    };
});

app.controller('AppController', function load() {
});

app.factory('ListaCompraFactory', function ($resource) {
    return $resource('http://3812ad01.ngrok.io/rest/listacompra/:id');
});

app.factory('ProdutoFactory', function ($resource) {
    return $resource('http://3812ad01.ngrok.io/rest/produto/:id');
});

app.factory('ListaCompraProdutoFactory', function ($resource) {
    return $resource('http://3812ad01.ngrok.io/rest/listacompraproduto/:idListaCompra');
});

app.controller('ListaController', function (ListaCompraFactory) {
    this.lista = ListaCompraFactory.query();

    this.remove = function (listaCompra) {
        listaCompra.$delete({"id": listaCompra.id});
        var index = this.lista.indexOf(listaCompra);
        if (index > -1) {
            this.lista.splice(index, 1);
        }
        ;
    };
});

app.controller('FormController', function (ListaCompraFactory, ListaCompraProdutoFactory, ProdutoFactory, $state, $stateParams) {
    this.valorTotal = 0;
    if ($stateParams.id) {
        this.listaCompra = ListaCompraFactory.get({id: $stateParams.id});
        this.lista = ListaCompraProdutoFactory.query({idListaCompra: $stateParams.id});
    } else {
        this.listaCompra = new ListaCompraFactory;
        this.listaCompra.listaProdutos = [];
        this.lista = ProdutoFactory.query();
    }
    ;

    this.save = function () {
        this.listaCompra.$save(function (listaCompra) {
            $state.go('edit', {id: listaCompra.id});
        });
        this.valorTotal = 0;
    };

    this.valorTotalFunction = function () {
        valorTotal = 0;
        if (this.listaCompra && this.listaCompra.listaProdutos){
        for (var i = 0; i < this.listaCompra.listaProdutos.length; i++) {
            var produto = this.listaCompra.listaProdutos[i];
            valorTotal += (produto.valorAtualizado * produto.quantidade);
        }}
        return valorTotal;
    };

    this.adicionarProduto = function (produto) {
        produto.quantidade = 1;
        produto.valorAtualizado = produto.valor;
        produto.idProduto = produto.id;
        this.listaCompra.listaProdutos.push(produto);
        var index = this.lista.indexOf(produto);
        if (index > -1) {
            this.lista.splice(index, 1);
        }
    };

    this.removerProduto = function (produto) {
        produto.quantidade = 1;
        produto.valorAtualizado = produto.valor;
        this.lista.push(produto);
        var index = this.listaCompra.listaProdutos.indexOf(produto);
        if (index > -1) {
            this.listaCompra.listaProdutos.splice(index, 1);
        }
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
