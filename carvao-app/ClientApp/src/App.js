import React, { Component } from 'react';
import { Route } from 'react-router';
import './custom.css'
import Layout from './components/Layout/Layout';

import Clientes from './views/clientes/Clientes';
import Pedidos from './views/pedidos/pedidos';
import Gestao from './views/gestao/gestao';
import Recibo from './views/recibo/recibo';
import ListaRecibo from './views/listaRecibo/listaRecibo';
import Login from './views/login/login';
import CadUsuario from './views/cadUsuario/cadUsuario';
import Produtos from './views/produtos/produtosTable';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Clientes} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/cliente' component={Clientes} />
        <Route exact path='/pedido' component={Pedidos} />
        <Route exact path='/gestao' component={Gestao} />
        <Route exact path='/recibo' component={Recibo} />
        <Route exact path='/recibos' component={ListaRecibo} />
        <Route exact path='/novousuario' component={CadUsuario} />
        <Route exact path='/produtos' component={Produtos} />
      </Layout>
    );
  }
}
