
import { config } from '../config';
import { CognitoUserPool, CognitoUser, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import { useCookies } from 'react-cookie';

function Movies() {
    const [cookies, setCookie] = useCookies(['cognito_refresh']);
    const poolData = {
        UserPoolId: config.UserPoolId,
        ClientId: config.ClientId,
    };
    
    const userPool = new CognitoUserPool(poolData);

    const refreshTokens = () => {
        const cognitoUser = new CognitoUser({ 
            Username: 'jawabe1004@rebation.com',
            Pool: userPool,
        });
        
        const cognito_refresh_token = new CognitoRefreshToken({ RefreshToken: cookies.cognito_refresh })
        console.log('cookies.cognito_refresh', cognito_refresh_token)

        cognitoUser.refreshSession(cognito_refresh_token, (err, session) => {
            if (err) {
                console.error(err);
            }
            setCookie('fauna_access_token', session.getIdToken().payload.fauna_access_token);
        });
    }

    const queryMovies = async () => {
        console.log('Get Movies');
    }

    return (
        <div>
            <h1>Movies</h1>
            <h3>Click to Query Movies</h3>
            <button onClick={queryMovies}>Get Movies</button>
            <h3>Click to Refresh Token</h3>
            <button onClick={refreshTokens}>Refresh Token</button>
        </div>
    )
}

export default Movies;