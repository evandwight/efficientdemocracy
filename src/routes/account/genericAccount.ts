
export async function logout(req, res) {
    req.logout();
    res.redirect("/");
}
