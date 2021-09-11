const {
    registerUser,
    createAccessToken,
    createRefreshToken,
    getUserByEmail
} = require('users')

exports.handler = async (event, context) => {
    
    const email = event.request.userAttributes['email']; // get the email from event
    
    let userId;
    let fauna_refresh_token;
    let fauna_access_token;
    
    try {
        const foundUser = await getUserByEmail(email);
        userId = foundUser.ref.id;
        
    } catch (e) {
        console.log('Error: %s', e);
        const newUser = await registerUser(email);
        userId = newUser.ref.id;
    }
    
    try {
        const faunaRefreshToken = await createRefreshToken(userId, 3600);
        fauna_refresh_token = faunaRefreshToken.secret;
        console.log('fauna_refresh_token', fauna_refresh_token);
        const rret = await createAccessToken(userId, fauna_refresh_token, 600);
        fauna_access_token = rret.secret;
        console.log('fauna_access_token', rret.secret);
    } catch (e) {
        console.log('Token Generation Error: %s', e);
    }
  
    event.response = {
        "claimsOverrideDetails": {
            "claimsToAddOrOverride": {
                fauna_access_token,
                fauna_refresh_token,
                userId
            },
            "claimsToSuppress": ["email"]
        }
    };
    context.done(null, event);
    return event;
};
