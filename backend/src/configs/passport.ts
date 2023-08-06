export default {
    local: {
        usernameField: 'account',
        passwordField: 'password',
    },
    jwt: {
        get secretOrKey() {
            return process.env.AUTH_SECRET || 'secret';
        },
    },
};
