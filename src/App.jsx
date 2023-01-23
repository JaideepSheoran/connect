import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {

    return (
      <Router>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login />} />
  
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Home />} />
            <Route path='/chats' element={<Home />} />
            <Route path='/addpost' element={<Home />} />
            <Route path='/explore' element={<Home />} />
            <Route path='/saved' element={<Home />} />

          </Route>  
      </Routes>
      </Router>
    );
  }

export default App;

// jaideepsinghsheoran@gmail.com