import Register from '@/pages/Register/Register'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'

const AppRoutes=()=>(
    <Router>
        <Routes>
            <Route path="/register" element={<Register />} />
        </Routes>
    </Router>
)

export default AppRoutes;