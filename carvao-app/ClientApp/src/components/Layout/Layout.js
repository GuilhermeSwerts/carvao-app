import React, { useState } from 'react';
import './layout.css';
import { GetDataUser } from "../../util/GetDataUser";
import { FaArrowRight, FaDoorOpen, FaUser, FaUserPlus } from 'react-icons/fa';
import { FaUsers, FaShoppingCart, FaCartPlus } from "react-icons/fa";
import { FaGears, FaKey } from "react-icons/fa6";
import { FaBoxes } from "react-icons/fa";
import { BsInboxesFill } from "react-icons/bs";
import ModalAlterarSenha from '../Modals/Usuario/ModalAlterarSenha';

function Layout({ children }) {
  const usuario = GetDataUser();
  const [show, setShow] = useState(false);

  function toggleMenu() {
    document.querySelector('.menu').classList.toggle("open");
    document.querySelector('.arrow').classList.toggle('rotate');
    document.querySelector('.content').classList.toggle('opening');
  }

  function logout() {
    window.localStorage.clear();
    window.location.href = "/login"
  }

  return (<div className='container-header'>
    <div class="menu">
      <div class="menu-top" onClick={() => toggleMenu()}>
        <FaArrowRight className='arrow' size={20} color='#000' />
      </div>
      <div class="menu-body">
        <a class="slider_item" href='cliente'>
          MEUS CLIENTES
          <FaUsers className='slider-item-hover' size={20} />
        </a>
        <a class="slider_item" href='pedido'>
          PEDIDOS POR CLIENTE
          <FaShoppingCart size={20} className='slider-item-hover' />
        </a>
        <a class='slider_item' href='gestao'>
          GESTÃO DE PEDIDOS
          <FaGears size={20} className='slider-item-hover' />
        </a>
        {usuario.IsMaster && <a class='slider_item' href='produtos'>
          PRODUTOS
          <FaBoxes size={20} className='slider-item-hover' />
        </a>}
        {usuario.IsMaster && <a class='slider_item' href='estoqueCarvao'>
          ESTOQUE
          <BsInboxesFill size={20} className='slider-item-hover' />
        </a>}
        {usuario.IsMaster && <a class='slider_item' href='usuarios'>
          USUÁRIOS
          <FaUsers size={20} className='slider-item-hover' />
        </a>}
        <a class='slider_item' onClick={e => setShow(true)}>
          TROCA SENHA
          <FaKey size={20} className='slider-item-hover' />
        </a>
      </div>
      <div class="menu-footer">
        <a class="slider_item" style={{ borderTop: '1px solid #ccc' }} onClick={logout}>
          SAIR
          <FaDoorOpen size={20} className='slider-item-hover' />
        </a>
      </div>
    </div>
    <div style={{ width: '100%' }}>
      <ModalAlterarSenha show={show} setShow={setShow} />
      {children}
    </div>
  </div>);
}

export default Layout;