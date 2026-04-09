import React, { ReactNode, useCallback, useEffect, useState } from "react";
import type { MenuProps } from "antd";
import {
  Button,
  Layout,
  Menu,
  Modal,
  Dropdown,
  Spin,
  message as antdMessage,
  Input,
  Drawer,
  Tooltip,
} from "antd";
import {
  UpOutlined,
  LoadingOutlined,
  MessageOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentModelState } from "../../atoms/currentModelState";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { apiFetcher } from "../../services/api";
import { loadingChat } from "../../atoms/loadingChat";
import useSWR from "swr";
import { isToday, subDays } from "date-fns";
import Section from "./Section";
import { getItem, MenuItem } from "../../utils/helpers";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Sider } = Layout;
const { confirm } = Modal;

interface SidebarProps {
  children?: ReactNode;
}

interface Conversation {
  id: string;
  title: string;
  date: number;
}

const Sidebar: React.FC<SidebarProps> = ({ children }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [currentModel, setCurrentModel] = useRecoilState(currentModelState);
  const [editingConversation, setEditingConversation] = useState<string | null>(
    null
  );
  const [newTitle, setNewTitle] = useState("");
  const isLoadingChat = useRecoilValue(loadingChat);

  const navigate = useNavigate();
  const location = useLocation();

  const conversationId = location.pathname.split("/").pop() ?? "";

  const handleResize = useCallback(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (isDesktop) {
      setIsDrawerVisible(false);
    }
  }, [isDesktop]);

  const {
    data: conversations,
    isLoading,
    error,
    mutate,
  } = useSWR("fetch_conversations/", apiFetcher);

  useEffect(() => {
    if (error) {
      const apiError = error.response?.data as APIError;
      antdMessage.error(
        apiError.message ||
          "Failed to fetch conversations history. Please try again."
      );
    }
  }, [error]);

  const handleModelChange = (model: "Speed" | "Quality") => {
    if (model !== currentModel) {
      setCurrentModel(model);
      localStorage.setItem("currentModelState", model);
      antdMessage.success(`Model changed to ${model}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#F5F5F5] dark:bg-[#1E2021]">
        <Spin size="large" indicator={<LoadingOutlined spin />} />
      </div>
    );
  }

  const handleClearConversations = () => {
    confirm({
      title: "Clear All Conversations",
      content: "Are you sure you want to clear all conversations?",
      okText: "Clear All",
      okButtonProps: { danger: true, type: "primary" },
      cancelButtonProps: { danger: true, type: "default" },
      maskClosable: true,
      width: isDesktop ? 520 : "80%",

      onOk: async () => {
        try {
          await api.delete("/delete_all_conversations/");
          navigate("/chats");
        } catch (error) {
          const apiError = error.response?.data as APIError;
          antdMessage.error(
            apiError.message || "Failed to clear all conversations"
          );
        }
      },
    });
  };

  const handleSignOut = () => {
    confirm({
      title: "Sign Out",
      content: "Are you sure you want to sign out?",
      okText: "Sign Out",
      okButtonProps: { danger: true, type: "primary" },
      cancelButtonProps: { danger: true, type: "default" },
      maskClosable: true,
      width: isDesktop ? 520 : "80%",
      onOk() {
        localStorage.removeItem("isAuth");
        localStorage.removeItem("username");
        localStorage.removeItem("currentModelState");
        window.location.reload();
      },
    });
  };

  const handleRenameConversation = async (conversationId: string) => {
    try {
      await mutate(
        async () => {
          await api.put(`/rename_conversation/${conversationId}`, null, {
            params: { new_title: newTitle },
          });
          return conversations.map((conv: Conversation) =>
            conv.id === conversationId ? { ...conv, title: newTitle } : conv
          );
        },
        {
          optimisticData: conversations.map((conv: Conversation) =>
            conv.id === conversationId ? { ...conv, title: newTitle } : conv
          ),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      antdMessage.success("Conversation renamed successfully");
      setEditingConversation(null);
    } catch (error) {
      const apiError = error.response?.data as APIError;
      antdMessage.error(apiError.message || "Failed to rename conversation");
    }
  };

  const handleDeleteConversation = async (deletedConversationId: string) => {
    const previousData = conversations;
    try {
      await mutate(
        async () => {
          await api.delete(`/delete_conversation/${deletedConversationId}`);
          return conversations.filter(
            (conv: Conversation) => conv.id !== deletedConversationId
          );
        },
        {
          optimisticData: conversations.filter(
            (conv: Conversation) => conv.id !== deletedConversationId
          ),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      antdMessage.success("Conversation deleted successfully");
      if (conversationId === deletedConversationId) {
        setTimeout(() => {
          navigate("/chats");
        }, 500);
      }
    } catch (error) {
      const apiError = error.response?.data as APIError;
      antdMessage.error(apiError.message || "Failed to delete conversation");
      mutate(previousData, false);
    }
  };

  const model: MenuProps["items"] = [
    getItem(
      <div
        key="Speed"
        className="flex items-center justify-between text-black"
        onClick={() => handleModelChange("Speed")}
      >
        Speed
        <Tooltip
          placement="right"
          title={
            "Choosing Speed will speed up the process (10-15 seconds), but the results might not be comprehensive."
          }
        >
          <InfoCircleOutlined />
        </Tooltip>
      </div>,
      "Speed"
    ),
    getItem(
      <div
        key="Quality"
        className="flex items-center justify-between text-black"
        onClick={() => handleModelChange("Quality")}
      >
        Quality
        <Tooltip
          placement="right"
          title={
            "Selecting Quality may take longer time (25-40 seconds), but it will yield more accurate and comprehensive results."
          }
        >
          <InfoCircleOutlined />
        </Tooltip>
      </div>,
      "Quality"
    ),
  ];

  const now = new Date();
  const endOfToday = new Date(now.setHours(23, 59, 59, 999));
  const endOfYesterday = subDays(endOfToday, 1);
  const startOfYesterday = subDays(endOfToday, 2);
  const startOf7DaysAgo = subDays(endOfToday, 7);
  const startOf30DaysAgo = subDays(endOfToday, 30);

  const conversationsToday = conversations?.filter(
    (conv: Conversation) =>
      new Date(conv.date) <= endOfToday && isToday(new Date(conv.date))
  );
  const conversationsYesterday = conversations?.filter((conv: Conversation) => {
    const convDate = new Date(conv.date);
    return convDate <= endOfYesterday && convDate >= startOfYesterday;
  });
  const conversations7Days = conversations?.filter((conv: Conversation) => {
    const convDate = new Date(conv.date);
    return convDate < startOfYesterday && convDate >= startOf7DaysAgo;
  });
  const conversations30Days = conversations?.filter((conv: Conversation) => {
    const convDate = new Date(conv.date);
    return convDate < startOf7DaysAgo && convDate >= startOf30DaysAgo;
  });
  const conversationsOlder = conversations?.filter((conv: Conversation) => {
    const convDate = new Date(conv.date);
    return convDate < startOf30DaysAgo;
  });

  const conversationItems = (conversations: Conversation[]) => {
    return conversations.map((conv: Conversation) =>
      getItem(
        <div className="group">
          {editingConversation === conv.id ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onPressEnter={() => handleRenameConversation(conv.id)}
              onBlur={() => setEditingConversation(null)}
              className="bg-transparent text-inherit"
              autoFocus
            />
          ) : (
            <div className="flex">
              <Link
                to={`/chats/${conv.id}`}
                className={`flex-1 truncate hover:text-primary group-hover:pr-7 duration-0
                ${
                  conv.id === conversationId
                    ? "!text-primary dark:!text-primary"
                    : "!text-black dark:!text-white"
                }
                  `}
              >
                {conv.title}
              </Link>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "edit",
                      icon: <EditOutlined />,
                      label: "Edit",
                      onClick: () => {
                        setEditingConversation(conv.id);
                        setNewTitle(conv.title);
                      },
                    },
                    {
                      key: "delete",
                      className: "text-red-500",
                      icon: <DeleteOutlined />,
                      label: "Delete",
                      danger: true,
                      onClick: () => handleDeleteConversation(conv.id),
                    },
                  ],
                }}
                trigger={["click"]}
                className="hidden group-hover:block group/dropdown"
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  className="relative right-2"
                >
                  <EllipsisOutlined
                    className={`absolute top-1/2 transform -translate-y-1/2 ${
                      conv.id !== conversationId
                        ? "group-hover/dropdown:text-primary"
                        : "group-hover/dropdown:text-black"
                    }`}
                  />
                </a>
              </Dropdown>
            </div>
          )}
        </div>,
        conv.id,
        undefined
      )
    );
  };

  const itemsToday: MenuItem[] = conversationItems(conversationsToday);
  const itemYesterday: MenuItem[] = conversationItems(conversationsYesterday);
  const items7Days: MenuItem[] = conversationItems(conversations7Days);
  const items30Days: MenuItem[] = conversationItems(conversations30Days);
  const itemsOlder: MenuItem[] = conversationItems(conversationsOlder);

  const sidebarContent = (
    <div className="flex flex-col items-center justify-between h-full pt-2 pb-4">
      {/* New Chat Button and divider */}
      <Menu
        defaultSelectedKeys={["1"]}
        mode="vertical"
        items={[
          getItem("New Chat", "new_chat", <MessageOutlined />),
          { type: "divider", style: { margin: "12px 0px 0px 0px" } },
        ]}
        triggerSubMenuAction="click"
        selectedKeys={[
          conversationId === "chats" ? "new_chat" : conversationId,
        ]}
        onSelect={({ key }) => {
          if (key === "new_chat") {
            navigate("/chats");
          }
        }}
        className="w-full"
      />

      {/* Conversation List */}
      <div className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-red-red2  ">
        <Section
          title="Today"
          items={itemsToday}
          id="conversation-list-today"
          conversationId={conversationId}
        />
        <Section
          title="Yesterday"
          items={itemYesterday}
          id="conversation-list-yesterday"
          conversationId={conversationId}
        />
        <Section
          title="Previous 7 Days"
          items={items7Days}
          id="conversation-list-7days"
          conversationId={conversationId}
        />
        <Section
          title="Previous 30 Days"
          items={items30Days}
          id="conversation-list-30days"
          conversationId={conversationId}
        />
        <Section
          title="Older"
          items={itemsOlder}
          id="conversation-list-older"
          conversationId={conversationId}
        />
      </div>

      {/* Divider */}
      <Menu items={[{ type: "divider" }]} className="w-full" />

      {/* Downside buttons */}
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <Dropdown
          menu={{ items: model }}
          trigger={["click"]}
          disabled={isLoadingChat}
          placement="topRight"
        >
          <Button
            className="w-11/12 mt-4 disabled:opacity-90 dark:disabled:opacity-50 duration-0
           border-black dark:border-white"
          >
            <div className="!text-black dark:!text-white">
              {currentModel === "Speed" ? "Speed" : "Quality"} <UpOutlined />
            </div>
          </Button>
        </Dropdown>
        <Button
          danger
          type="primary"
          className="w-11/12"
          onClick={handleClearConversations}
        >
          Clear All Conversations
        </Button>
        <Button danger className="w-11/12" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <Layout className="h-full">
      {/* Mobile Drawer */}
      {!isDesktop && (
        <Drawer
          placement="left"
          closable
          onClose={() => setIsDrawerVisible(false)}
          open={isDrawerVisible}
          styles={{ body: { padding: 0 } }}
          width={220}
          className="bg-white dark:bg-[#181A1B]"
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Desktop Sider */}
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        width={220}
        className={`${isDesktop ? "block" : "hidden"} `}
      >
        {sidebarContent}
      </Sider>

      {/* Toggle Button for Mobile */}
      {!isDesktop && (
        <Button
          type="text"
          icon={<UnorderedListOutlined />}
          onClick={() => setIsDrawerVisible(true)}
          className="absolute z-10 bg-white border border-gray-200 top-4 left-4 dark:bg-gray-800 dark:border-gray-700 duration-0"
        />
      )}

      <Layout className="relative">{children}</Layout>
    </Layout>
  );
};

export default Sidebar;
