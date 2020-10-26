import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Activate from './components/pages/Activate';
import ForgotPass from './components/pages/ForgotPass';
import Home from './components/pages/Home';
import Signin from './components/pages/Signin';
import Signup from './components/pages/Signup';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact /> 
        <Route path="/signup" component={Signup} exact />
        <Route path="/signin" component={Signin} exact />
        <Route path="/user/activate/:token" component={Activate} exact />
        <Route path="/user/password/forgot" component={ForgotPass} exact />
      </Switch>
    </Router>
  );
}

export default App;
