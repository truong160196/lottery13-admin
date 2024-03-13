import { useStores } from "./useStores";

export function usePermission() {
  const {
    authStore: { permissions, role, isAdmin, user },
  } = useStores();

  const checkRole = (key) => {
    try {
      if (role === "admin") return true;
      if (!key) return false;
      if (typeof key === "boolean") return key;
      if (permissions?.length === 0) return false;

      return permissions.indexOf(key) > -1;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  return {
    permissions,
    role,
    isAdmin: user?.position_key === "admin",
    isSale: user?.position_key === "sale",
    isAgency: user?.position_key === "agency",
    checkRole,
  };
}
