import Layout from "@/components/Layout";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <Layout>
      <div className="h-screen flex flex-row items-center justify-center p-3 md:p-7 lg:p-10 overflow-x-hidden bg-gray-50 dark:bg-gray-900">
        <div className="w-full lg:w-1/2 px-2 lg:px-10">
          <LoginForm />
        </div>
        <div className="w-1/2 hidden lg:block">
          <img
            src="/images/pic.png"
            alt="Login"
            className="w-4/5 h-4/5 transition-all duration-500 ease-in-out"
          />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
