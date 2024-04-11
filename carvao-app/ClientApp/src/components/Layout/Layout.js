import React from 'react';
import './layout.css';

import { FaArrowRight, FaDoorOpen } from 'react-icons/fa';
import { FaUsers, FaShoppingCart,FaCartPlus  } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";

function Layout({ children }) {
  function toggleMenu() {
    document.querySelector('.menu').classList.toggle("open");
    document.querySelector('.arrow').classList.toggle('rotate');
    document.querySelector('.content').classList.toggle('opening');
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
          <FaGears  size={20} className='slider-item-hover' />
        </a>
      </div>
      <div class="menu-footer">
        <a class="slider_item" style={{ borderTop: '1px solid #ccc' }} href='logout'>
          SAIR
          <FaDoorOpen size={20} className='slider-item-hover' />
        </a>
      </div>
    </div>
    <div style={{ width: '100%' }}>
      {children}
    </div>
  </div>);
}

export default Layout;