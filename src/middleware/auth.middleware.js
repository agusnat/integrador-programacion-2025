authMiddleware = (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader) 
        return res.status(401).send('Error: Missing Authorization header!');
    
    const base64 = authHeader.split(' ')[1];

    if (!base64) 
        return res.status(401).send('Error: Invalid Authorization format!');
    
    const [user, password] = Buffer.from(base64, 'base64').toString().split(':');

    if (
        user !== process.env.USER_CREDENTIALS ||
        password !== process.env.PASSWORD_CREDENTIALS
    ) 
        return res.status(403).send('Error: Bad Auth credentials!');

    next();
}

module.exports = authMiddleware;