import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, Cart, Bars, Close } from '@rlecomm/common';
import NavItem from './nav-item';
import SearchBar from './search-bar';
import { Context } from '../context/container-context';

const Nav = () => {
  const { currentUser } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    !currentUser && { href: '/auth/signup', label: 'Signup' },
    !currentUser && { href: '/auth/signin', label: 'Signin' },
    currentUser && { href: '/products/create', label: 'Sell' },
    currentUser && { href: '/orders', label: 'Orders' },
    currentUser && { href: '/wishlist', label: <Heart /> },
    currentUser && { href: '/cart', label: <Cart /> },
    currentUser && { href: `/users/${currentUser.username}`, label: <User /> }
  ]
    .filter(Boolean)
    .map(({ href, label }) => (
      <NavItem key={href} href={href}>
        {label}
      </NavItem>
    ));

  return (
    <header class="lg:px-16 px-6 bg-white flex flex-wrap items-center lg:py-0 py-2 border-b">
      <div class="flex-1 flex justify-between items-center">
        <Link className="text-xl font-bold" to="/">
          Ecomm
        </Link>
      </div>

      <label
        for="menu-toggle"
        class="pointer-cursor lg:hidden block"
        onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? <Close /> : <Bars />}
      </label>
      <input class="hidden" type="checkbox" id="menu-toggle" />

      <div
        class={`lg:flex lg:items-center lg:w-auto w-full ${
          isOpen ? '' : 'hidden'
        }`}
        id="menu">
        <nav>
          <ul class="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
            {links}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
