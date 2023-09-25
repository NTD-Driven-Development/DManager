export default {
    local: {
        usernameField: 'email',
        passwordField: 'password',
    },
    jwt: {
        get secretOrKey() {
            return process.env.AUTH_SECRET || 'secret';
        },
    },
};
