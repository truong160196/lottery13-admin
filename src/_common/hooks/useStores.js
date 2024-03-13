import { useContext } from "react";
import { rootStoreContext } from "states/stores";

export const useStores = () => useContext(rootStoreContext);
