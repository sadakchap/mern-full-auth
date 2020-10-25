import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Signup from './components/pages/Signup';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact /> 
        <Route path="/signup" component={Signup} exact />
      </Switch>
    </Router>
  );
}

export default App;
