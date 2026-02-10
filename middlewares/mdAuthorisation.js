const authorisedRoles = require('../config/authorisedRoles');

exports.isAuthorised = (req, res, next) => {
    const method = req.method;
    const base = req.baseUrl;
    const path = req.route?.path || ""; // ":id", "", etc.
    const routeKey = `${method} ${base}${path}`;
    
    const role = req.decoded?.role?.toLowerCase();

    const isAuthorised = authorisedRoles[routeKey]?.includes(role);    
    if (isAuthorised) {
        req.authentication = req.decoded;
        next();
    } else {
        res.status(403).json({
            message: "You are not authorised to access this resource"
        });
    }
};