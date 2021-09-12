import { useState } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { config } from '../config';

function Login() {
    let history = useHistory();
    const [cookies, setCookie] = useCookies([]);
    const [state, setState] = useState({
      username: '',
      password: '',
    })
    
    const poolData = {
        UserPoolId: config.UserPoolId,
        ClientId: config.ClientId,
    };
    
    const userPool = new CognitoUserPool(poolData);

    const updateInput = (e) => {
      setState({ 
        ...state,
        [e.target.name]: e.target.value
      })
    }
    
    const onSubmit = async e => {
      e.preventDefault();
      console.log('State', state);
      
      const cognitoUser = new CognitoUser({ 
        Username: state.username,
        Pool: userPool,
      });
      const authenticationDetails = new AuthenticationDetails({
          Username: state.username,
          Password: state.password,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: data => {
          setCookie('fauna_access_token', data.getIdToken().payload.fauna_access_token)
          setCookie('cognito_refresh', data.getRefreshToken().getToken())
          setCookie('cognito_username', data.getAccessToken().payload.username)
          console.log('Auth Data', data);
          alert('User Login Successful');
          history.push('/movies');
        },

        onFailure: err => {
          console.log('Failed', err)
        },

        newPasswordRequired: newPass => {
          console.log('New Pass Required', newPass)
        }
      })
    }

    return (
      <div >
        <h2>Login User</h2>
        <form onSubmit={onSubmit}>
          <div>
            <label>Email: </label>
            <input onChange={updateInput} name="username" value={state.username}/>
          </div>
          <div>
            <label>Code: </label>
            <input onChange={updateInput} name="password" type="password" value={state.password}/>
          </div>
          <div>
            <input type="submit" value="Login"/>
          </div>
        </form>
      </div>
    );
    
}

export default Login;