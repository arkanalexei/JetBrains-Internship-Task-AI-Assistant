import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

interface SectionProps {
  title: string;
  items: MenuItem[];
  id: string;
  conversationId: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  items,
  id,
  conversationId,
}) => (
  <>
    {items.length > 0 && (
      <div className="w-full">
        <div className="border border-white dark:border-[#181A1B] sticky top-0 z-10 h-11 text-[12px] font-semibold text-gray-500 dark:text-white bg-white dark:bg-[#181A1B] px-4 pb-6 pt-6 w-full will-change-transform antialiased -translate-y-[1px]">
          {title}
        </div>
        <Menu
          id={id}
          mode="vertical"
          items={items}
          triggerSubMenuAction="click"
          selectedKeys={[conversationId]}
        />
      </div>
    )}
  </>
);

export default Section;
