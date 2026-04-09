import withUnProtectedPage from "../hocs/withUnProtectedPage";
import type { FormProps } from "antd";
import { Button, Form, Input, message as antdMessage } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

type FieldType = {
  username?: string;
};

const HomePage = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    localStorage.setItem("isAuth", "true");
    localStorage.setItem("username", values.username || "Anonymous");
    localStorage.setItem("currentModelState", "Quality");
    window.location.reload();
    setTimeout(() => navigate("/chats"), 1000);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () =>
    // errorInfo
    {
      antdMessage.error("Failed to login. Please try again.");
    };

  return (
    <div className="flex items-center justify-center h-[calc(100dvh)]">
      <div className="w-[85%] md:w-full max-w-md bg-white p-12 rounded-lg shadow-xl border border-gray-200 dark:bg-[#25282A] dark:border-gray-700">
        <h2 className="mb-8 text-4xl font-extrabold text-center text-gray-800 dark:text-white">
          LOGIN
        </h2>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            className="mb-8"
            rules={[
              { required: true, message: "Please input your username!" },
              {
                pattern: /^[a-z0-9_.-]{3,16}$/,
                message:
                  "Username must be 3-16 characters long and can only include lowercase letters, numbers, underscores, and hyphens.",
              },
            ]}
          >
            <Input
              className="w-full shadow-sm"
              placeholder="Enter your username"
              prefix={<UserOutlined className="mr-1 text-gray-400" />}
              maxLength={16}
            />
          </Form.Item>
          <Form.Item>
            <Button
              danger
              type="primary"
              htmlType="submit"
              className="w-full py-3 mt-6 font-semibold"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const WrappedHomePage = withUnProtectedPage(HomePage);

export default WrappedHomePage;
