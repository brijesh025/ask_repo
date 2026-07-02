async function handleGetCurrentUser(req, res) {
    if (!req.user) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }

    return res.status(200).json({
        user: req.user,
    });
}

module.exports = {
    handleGetCurrentUser,
};