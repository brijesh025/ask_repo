async function handleUserLogout(req, res) {
    res.clearCookie("uid", {
        httpOnly: true,
        path: "/",
    });

    return res.status(200).json({
        message: "Logout successful",
    });
}

module.exports = {
    handleUserLogout,
};