import { useLocation } from 'react-router-dom'
import Input from '../parts/input'
import * as Styled from './styled'

const Header = () => {
  const location = useLocation()
  const navItem = [
    {
      name: "Drinks",
      link: "/drinks",
    },
    {
      name: "Bebidas",
      link: "/whiskeys",
    },
    {
      name: "Cervejas",
      link: "/beers",
    },
  ]
  return (
    <Styled.Container>
      <Input />
      <Styled.NavMenu>
        {navItem.map((item, index) => (
          <Styled.NavItem key={index}>
            <Styled.Link to={item.link} active={location.pathname === item.link}>{item.name}</Styled.Link>
          </Styled.NavItem>
        ))}
      </Styled.NavMenu>
    </Styled.Container>
  )
}

export default Header