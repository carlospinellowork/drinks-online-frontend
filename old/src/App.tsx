import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { DefaultTheme, ThemeProvider } from "styled-components"
import Page from "./components/page/page"
import usePersistTheme from "./hooks/usePersistTheme"
import * as Styled from "./styled"
import GlobalStyle from "./styles/global"
import dark from "./styles/themes/dark"
import light from "./styles/themes/light"
import { CartProvider } from "./context/useCart"

function App() {
  const [theme, setTheme] = usePersistTheme<DefaultTheme>('theme', light)
  const queryClient = new QueryClient()

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <CartProvider>
        <Router>
        <Styled.Layout>
            <Routes>
              <Route path="/" element={<Page toggleTheme={toggleTheme} />} />
              <Route path="/drinks/:id" element={<Page toggleTheme={toggleTheme} />} />
              <Route path="/:category" element={<Page toggleTheme={toggleTheme} />} />
            </Routes>
          </Styled.Layout>
        </Router>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
