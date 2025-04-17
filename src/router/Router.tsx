import { BrowserRouter, useRoutes } from 'react-router-dom'
import { routes } from './routes'
import Header from '../components/header/header'
import Footer from '../components/footer/Footer'
import '../config-translation'

const RouterContent = () => {
  const element = useRoutes(routes)
  return element
}

export const Router = () => {
  return (
    <BrowserRouter>
      <Header/>
      <RouterContent />
      <Footer/>
    </BrowserRouter>
  )
}
