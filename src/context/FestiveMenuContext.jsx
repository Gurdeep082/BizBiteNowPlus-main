import { createContext, useContext, useState } from "react";
import { festiveMenuData } from "../data/festiveMenuData";

const FestiveMenuContext = createContext();

export function FestiveMenuProvider({ children }) {
  const [menus, setMenus] = useState(festiveMenuData);

  const addMenu = (menu) => {
    setMenus((prev) => [
      ...prev,
      menu,
    ]);
  };

  const updateMenu = (updatedMenu) => {
    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === updatedMenu.id
          ? updatedMenu
          : menu
      )
    );
  };

  const deleteMenu = (id) => {
    setMenus((prev) =>
      prev.filter((menu) => menu.id !== id)
    );
  };

  const duplicateMenu = (id) => {
    const menu = menus.find(
      (m) => m.id === id
    );

    if (!menu) return;

    const copy = {
      ...menu,
      id: Date.now(),
      name: `${menu.name} Copy`,
      status: "draft",
      revenue: 0,
      orders: 0,
    };

    setMenus((prev) => [
      copy,
      ...prev,
    ]);
  };

  const endMenu = (id) => {
    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === id
          ? {
              ...menu,
              status: "expired",
            }
          : menu
      )
    );
  };

  return (
    <FestiveMenuContext.Provider
      value={{
        menus,
        addMenu,
        updateMenu,
        deleteMenu,
        duplicateMenu,
        endMenu,
      }}
    >
      {children}
    </FestiveMenuContext.Provider>
  );
}

export const useFestiveMenu = () =>
  useContext(FestiveMenuContext);