import { MenuProps } from "antd";

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  danger?: boolean
): MenuItem {
  return {
    // className: "!text-black dark:!text-white",
    key,
    icon,
    children,
    label,
    danger,
  } as MenuItem;
}

export type MenuItem = Required<MenuProps>["items"][number];
