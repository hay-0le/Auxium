import React from 'react';
import styled from 'styled-components';

const HeaderStyled = styled.div`
  text-align: center;
  vertical-align: middle;
  height: 50px;
  border: solid;
  border-color: red;
  padding: 15px;
  padding-top: 0;
  margin: 10px;
  font-size: 3em;
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  text-transform: uppercase;

`;

const Header = ({}) => {

  return (
    <HeaderStyled>
      <span>Auxium</span>
    </HeaderStyled>
  )
};

export default Header;