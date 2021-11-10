import { reactRender } from '../../views/utils';
import { Login } from '../../views/login';


export function login(req, res) {
    reactRender(res, Login({ csrfToken: res.locals.csrfToken }), { showLogin: false, title: "Login", includeRegisterJs: true });
}

export async function logout(req, res) {
    req.logout();
    res.redirect("/");
}
