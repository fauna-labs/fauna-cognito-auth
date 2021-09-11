import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import SignUp from './components/SignUp';
import ConfirmSignup from './components/Confirm';
import Login from './components/Login';
import Movies from './components/Movies';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/confirm">Confirm Signup</Link>
            </li>
            <li>
              <Link to="/movies">Movies</Link>
            </li>
          </ul>
        </nav>
        <hr />
        <Switch>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/confirm">
            <ConfirmSignup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/movies">
            <Movies />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
