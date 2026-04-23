import { hasPermission } from "../constants/roles.js";

export function authorizePermissions(...permissions) {
  return (request, response, next) => {
    const granted = permissions.every((permission) =>
      hasPermission(request.user.role, permission)
    );

    if (!granted) {
      return response.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }

    return next();
  };
}
