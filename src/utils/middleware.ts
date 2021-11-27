
export async function addCustomLocals(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    res.locals.csrfToken = req.csrfToken();
    next();
}

