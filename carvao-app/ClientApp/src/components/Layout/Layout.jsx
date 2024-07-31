import React, { useState } from 'react';
import './layout.css';
import { GetDataUser } from "../../util/GetDataUser";
import { FaArrowRight, FaDoorOpen, FaUser, FaUserPlus } from 'react-icons/fa';
import { FaUsers, FaShoppingCart, FaCartPlus } from "react-icons/fa";
import { FaGears, FaKey } from "react-icons/fa6";
import { FaBoxes } from "react-icons/fa";
import { BsInboxesFill } from "react-icons/bs";
import ModalAlterarSenha from '../Modals/Usuario/ModalAlterarSenha';
import Logo from '../../imgs/logo.png';

function Layout({ children, Tela, Icon }) {
  const usuario = GetDataUser();
  const [show, setShow] = useState(false);

  function toggleMenu() {
    document.querySelector('.menu').classList.toggle("open");
    document.querySelector('.arrow').classList.toggle('rotate');
    document.querySelector('.content').classList.toggle('opening');
    document.querySelector('.tela-atual').classList.toggle('opening');
  }

  function logout() {
    window.localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div className='container-header'>
      <div className="menu">
        <div className="menu-top" onClick={() => toggleMenu()}>
          <FaArrowRight className='arrow' size={20} color='#fff' />
        </div>
        <div className="menu-body">
          <a className="slider_item" href='cliente' title='Meus Clientes'>
            MEUS CLIENTES
            <FaUsers className='slider-item-hover' size={20} />
          </a>
          <a className="slider_item" href='pedido' title='Pedidos por Cliente'>
            PEDIDOS POR CLIENTE
            <FaShoppingCart size={20} className='slider-item-hover' />
          </a>
          <a className='slider_item' href='gestao' title='Gestão de Pedidos'>
            GESTÃO DE PEDIDOS
            <FaGears size={20} className='slider-item-hover' />
          </a>
          {usuario.IsMaster && <a className='slider_item' href='produtos' title='Produtos'>
            PRODUTOS
            <FaBoxes size={20} className='slider-item-hover' />
          </a>}
          {usuario.IsMaster && <a className='slider_item' href='estoqueCarvao' title='Estoque'>
            ESTOQUE
            <BsInboxesFill size={20} className='slider-item-hover' />
          </a>}
          {usuario.IsMaster && <a className='slider_item' href='usuarios' title='Usuários'>
            USUÁRIOS
            <FaUsers size={20} className='slider-item-hover' />
          </a>}
          <a className='slider_item' onClick={e => setShow(true)} title='Troca de Senha'>
            TROCA SENHA
            <FaKey size={20} className='slider-item-hover' />
          </a>
        </div>
        <div className="menu-footer">
          <a className="slider_item" style={{ borderTop: '1px solid #ccc' }} onClick={logout} title='Sair'>
            SAIR
            <FaDoorOpen size={20} className='slider-item-hover' />
          </a>
        </div>
      </div>
      <nav>
        <img src={Logo} />
      </nav>
      <div style={{ width: '100%', padding: '2rem' }}>
        <ModalAlterarSenha show={show} setShow={setShow} />
        <div className="tela-atual">
          <span>{Icon} {Tela}</span>
          <button onClick={() => window.history.go(-1)} className="btn btn-link">Voltar</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Layout;
