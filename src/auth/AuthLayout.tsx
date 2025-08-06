import { LoginForm } from "wasp/client/auth";
import { SignupForm } from "wasp/client/auth";
import { Link } from "react-router-dom";

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex justify-center">
      {/* Auth UI has margin-top on title, so we lower the top padding */}
      <div className="card mt-32 h-fit w-full max-w-md px-8 py-10 pt-4">
        {children}
      </div>
    </div>
  );
}

export function Login() {
  return (
    <Layout>
      <LoginForm />
      <br />
      <span className="text-sm font-medium text-gray-900">
        Don{"'"}t have an account yet? <Link to="/signup" className="underline">go to signup</Link>.
      </span>
    </Layout>
  );
}

export function Signup() {
  return (
    <Layout>
      <SignupForm />
      <br />
      <span className="text-sm font-medium text-gray-900">
        I already have an account (<Link to="/login" className="underline">go to login</Link>).
      </span>
    </Layout>
  );
}