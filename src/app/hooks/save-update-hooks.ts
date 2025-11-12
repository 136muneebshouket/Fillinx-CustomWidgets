import { recoil, _ } from "fillinxsolutions-provider";

export interface DesignWidgetError {
  id: string;
  heading: string;
}

export const designErrorAtom = recoil.atom<{
  [key: string]: DesignWidgetError;
}>({
  key: "design-error-list",
  default: {},
});

export const saveUpdateModal = recoil.atom<{
  modalIsOpen: boolean;
  isSaved: boolean;
  route:
    | ""
    | "/home/main"
    | "/home/collections"
    | "/home/product-detail"
    | "/home/custom-screen"
    | "/home/menu"
    | "/home/design"
    | "/home/maintenance"
    | "/billing/payment";
}>({
  key: "saveUpdateModal",
  default: {
    modalIsOpen: false,
    isSaved: false,
    route: "",
  },
});

export const useSaveButtons = () => {
  const setDesignErrors = recoil.useSetRecoilState(designErrorAtom);
  const [isSave, setIsSave] = recoil.useRecoilState(saveUpdateModal);
  const [leaveBrowser, setLeaveBrowser] = recoil.useRecoilState(_.leaveBrowser);
  const handleUpdate = () => {
    setIsSave((prev) => {
      return {
        ...prev,
        isSaved: true,
      };
    });
    setLeaveBrowser(true);
  };
  const handleRouteChange = (path: any) => {
    setIsSave((prev) => {
      return {
        ...prev,
        modalIsOpen: path,
        route: path,
      };
    });
    setLeaveBrowser(true);
  };
  const handleReset = () => {
    setIsSave((prev) => {
      return {
        ...prev,
        modalIsOpen: false,
        route: "",
        isSaved: false,
      };
    });
    setDesignErrors({});
    setLeaveBrowser(false);
  };
  return {
    handleReset,
    leaveBrowser,
    handleRouteChange,
    setLeaveBrowser,
    isSave,
    handleUpdate,
    setIsSave,
  };
};
