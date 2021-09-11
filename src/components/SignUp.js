import { useState } from 'react';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { config } from '../config';

function SignUp() {
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
        const attributeList = [
          new CognitoUserAttribute({
            Name: 'email',
            Value: state.username,
          })
        ];
        userPool.signUp( state.username, state.password, attributeList, null, (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log('user name is ', result.user.getUsername());
          console.log('call result: ', result);
        });
    }

    return (
        <div >
          <h2>Register New user</h2>
          <form onSubmit={onSubmit}>
            <div>
              <label>Email: </label>
              <input onChange={updateInput} name="username" value={state.username}/>
            </div>
            <div>
              <label>Password: </label>
              <input onChange={updateInput} name="password" type="password" value={state.password}/>
            </div>
            <div>
              <input type="submit" value="Register"/>
            </div>
          </form>
        </div>
    );
    
}

export default SignUp;