import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Loading } from './components/loader/loading';
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
import Usuarios from './views/usuarios';
import Estoque from './views/estoque/estoque';
import Teste from './views/Test';

import { FaUsers, FaDev, FaShoppingCart, FaRegFileAlt, FaHistory, FaUser, FaBoxes } from 'react-icons/fa';
import { BsInboxesFill } from 'react-icons/bs';
import { FaGears } from 'react-icons/fa6';
import ResetarSenha from './views/resetarSenha/ResetarSenha';


const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <BrowserRouter basename={baseUrl}>
    <Loading />
    <Route exact path='/' component={(props) => (
      <Layout Icon={<FaUsers color='#fff' size={25} />} Tela="Clientes">
        <Clientes {...props} />
      </Layout>
    )} />
    <Route exact path='/cliente' component={(props) => (
      <Layout Icon={<FaUsers color='#fff' size={25} />} Tela="Clientes">
        <Clientes {...props} />
      </Layout>
    )} />
    <Route exact path='/teste' component={(props) => (
      <Layout Icon={<FaDev color='#fff' size={25} />} Tela="Developer Test">
        <Teste {...props} />
      </Layout>
    )} />
    <Route exact path='/estoqueCarvao' component={(props) => (
      <Layout Icon={<BsInboxesFill size={25} color='#fff' />} Tela="Estoque">
        <Estoque {...props} />
      </Layout>
    )} />
    <Route exact path='/login' component={(props) => (
      <Login {...props} />
    )} />
    <Route exact path='/pedido' component={(props) => (
      <Layout Icon={<FaShoppingCart color='#fff' size={25} />} Tela="Pedidos">
        <Pedidos {...props} />
      </Layout>
    )} />
    <Route exact path='/gestao' component={(props) => (
      <Layout Icon={<FaGears size={25} color="#fff" />} Tela="Gestão">
        <Gestao {...props} />
      </Layout>
    )} />
    <Route exact path='/recibo' component={(props) => (
      <Layout Icon={<FaRegFileAlt size={25} color='#fff' />} Tela="Recibo">
        <Recibo {...props} />
      </Layout>
    )} />
    <Route exact path='/recibos' component={(props) => (
      <Layout Icon={<FaHistory size={25} color='#fff' />} Tela="Lista de Recibos">
        <ListaRecibo {...props} />
      </Layout>
    )} />
    <Route exact path='/novousuario' component={(props) => (
      <Layout Icon={<FaUser size={25} color='#fff' />} Tela="Cadastro de Usuário">
        <CadUsuario {...props} />
      </Layout>
    )} />
    <Route exact path='/usuarios' component={(props) => (
      <Layout Icon={<FaUsers size={25} color='#fff' />} Tela="Usuários">
        <Usuarios {...props} />
      </Layout>
    )} />
    <Route exact path='/produtos' component={(props) => (
      <Layout Icon={<FaBoxes size={25} color='#fff' />} Tela="Produtos">
        <Produtos {...props} />
      </Layout>
    )} />
    <Route exact path='/ResetarSenha' component={(props) => (
      <ResetarSenha {...props} />
    )} />
  </BrowserRouter>);


const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>404 - Página Não Encontrada</h1>
    <p>A página que você está procurando não existe.</p>
    <button onClick={() => window.history.go(-1)} className="btn btn-link">Voltar</button>
  </div>
);
