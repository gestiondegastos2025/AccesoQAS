import React from 'react'
import History from '../components/History/History'
import MisTickets from '../components/MisTickets/MisTickets'
import FAQ from '../components/FAQ/FAQ'
import FormReembolsoGastos from '../components/Form/FormApp'
import AdminSolicitudesTicketsList from '../components/AdminView/AdminSolicitudesTicketsList'
import { HashRouter, Route, Routes } from 'react-router-dom'
import LayoutNav from '../components/LayoutNav/LayoutNav'
import Home from '../Home/Home'
import PaginaAccesoQAS from "../components/AccesoQAS/PaginaAccesoQAS";


 
function RoutesApp() {

  return (
      <HashRouter>
          <Routes>
            <Route path="/" element={<LayoutNav/>}>
              <Route path="/" element={<Home />} />
              <Route path="formMesaDeAyudaSAPS4HANA" element={<FormReembolsoGastos />} />
              <Route path="/misTickets" element={<History />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/adminView/adminSolicitudesTicketsList" element={<AdminSolicitudesTicketsList />} />
              <Route path="/listTickets" element={<MisTickets />} />
              <Route path="/acceso-qas" element={<PaginaAccesoQAS />} />
            </Route>
          </Routes>
        
    </HashRouter>

  )
}

export default RoutesApp