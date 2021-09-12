
import { config } from '../config';
import { CognitoUserPool, CognitoUser, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import faunadb from 'faunadb';
import { useCookies } from 'react-cookie';

const q = faunadb.query;

function Movies() {
    const [cookies, setCookie] = useCookies(['cognito_refresh', 'cognito_username', 'fauna_access_token']);
    const poolData = {
        UserPoolId: config.UserPoolId,
        ClientId: config.ClientId,
    };
    
    const userPool = new CognitoUserPool(poolData);

    const refreshTokens = () => {
        const cognitoUser = new CognitoUser({ 
            Username: cookies.cognito_username,
            Pool: userPool,
        });
        
        const cognito_refresh_token = new CognitoRefreshToken({ RefreshToken: cookies.cognito_refresh })

        cognitoUser.refreshSession(cognito_refresh_token, (err, session) => {
            if (err) {
                console.error(err);
            }
            setCookie('fauna_access_token', session.getIdToken().payload.fauna_access_token);
            alert('Token Refreshed')
        });
    }

    const queryMovies = async () => {
        const serverClient = new faunadb.Client({ secret: cookies.fauna_access_token });
        try {
            const movies = await serverClient.query(
              q.Map(
                q.Paginate(q.Documents(q.Collection("movies"))),
                q.Lambda("X", q.Get(q.Var("X")))
              )
            )
            console.log('Movies', movies); 
          } catch (error) {
            console.log('error', error);
            if(error.name === "Unauthorized") {
              // Refresh Tokens
              alert('Token Expired! Refresh Token or Log in again')
            }
        }
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