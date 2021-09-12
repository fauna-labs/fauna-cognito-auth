import { useState } from 'react';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { useHistory } from 'react-router-dom';
import { config } from '../config';

function ConfirmSignup() {
    let history = useHistory();
    const [state, setState] = useState({
        username: '',
        confirmCode: '',
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
        cognitoUser.confirmRegistration(state.confirmCode, true, (err, result) => {
            if(err) {
                console.log('Error', err)
            }
            console.log('Call Result', result);
            alert('User Confirmed. Please Login')
            history.push('/login')
        })
    }

    return (
      <div >
        <h2>User Confirmation</h2>
        <form onSubmit={onSubmit}>
          <div>
            <label>Email: </label>
            <input onChange={updateInput} name="username" value={state.username}/>
          </div>
          <div>
            <label>Code: </label>
            <input onChange={updateInput} name="confirmCode"  value={state.confirmCode}/>
          </div>
          <div>
            <input type="submit"/>
          </div>
        </form>
      </div>
    );
}

export default ConfirmSignup;