import React from 'react';
import { ReactNavbar } from 'overlay-navbar';
import { MdAccountCircle } from 'react-icons/md';
import { MdSearch } from 'react-icons/md';
import { MdAddShoppingCart } from 'react-icons/md';
import logo from '../../../images/logo.png';

const options = {
burgerColorHover: 'black',
burgerColor: 'grey',
logo,
logoWidth: '15vmax',
navColor1: 'white',
logoHoverSize: '10px',
logoHoverColor: 'black',
link1Text: 'Home',
link2Text: 'Products',
link3Text: 'Contact Us',
link4Text: 'About Us',
link1Url: '/',
link2Url: '/products',
link3Url: '/contact',
link4Url: '/about',
link1Size: '1.3vmax',
link1Color: 'grey',
nav1justifyContent: 'flex-end',
nav2justifyContent: 'flex-end',
nav3justifyContent: 'flex-start',
nav4justifyContent: 'flex-start',
link1AnimationTime: 0.8,
link1ColorHover: '#34495e',
link1Margin: '1vmax',
profileIcon: true,
profileIconColor: 'grey',
profileIconUrl: '/login',
ProfileIconElement: MdAccountCircle,
searchIcon: true,
searchIconColor: 'grey',
searchIconTransition: 0.5,
SearchIconElement: MdSearch,
cartIcon: true,
cartIconColor: 'grey',
CartIconElement: MdAddShoppingCart,
profileIconColorHover: '#34495e',
searchIconColorHover: '#34495e',
cartIconColorHover: '#34495e',
cartIconMargin: '1vmax',
};

const Header = () => {
return <ReactNavbar {...options} />;
};

export default Header;