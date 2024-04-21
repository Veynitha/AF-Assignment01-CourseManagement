const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req?.role) {
                return res.status(401).json({ message: 'Unauthorized: No roles provided' });
            }

            const rolesArray = [...allowedRoles];
            //implemented just in case we might need multiple roles.
            const result = rolesArray.some(role => role === req.role);
            if (!result) {
                return res.status(401).json({ message: 'Unauthorized: Insufficient roles' });
            }
            next();
        } catch (error) {
            console.error('Error in role verification:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = verifyRoles;
