import type { User } from "@/types/User";
import { Button, Center, Field, Input } from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "@/utils/api";
import { datadogLogs } from "@datadog/browser-logs";
import { datadogRum } from "@datadog/browser-rum";

interface LoginFormValues {
  username: string;
}

const Login = () => {
  let navigate = useNavigate();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
  const [value, setValue] = useLocalStorage<User>(
    "rum-video-streaming--user",
    {} as User
  );

  const setDatadogRumUser = (user: User) => {
    datadogRum.setUser({
      id: `${user.userId}`,
      name: user.username,
      plan: "premium",
    });
  };

  const handleLogin = async (username: string): Promise<User> => {
    const response = await fetch(`${BACKEND_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username }),
    });
    const data = await response.json();
    return data;
  };

  const onSubmit = handleSubmit((data) => {
    handleLogin(data.username).then((user) => {
      reset();
      setDatadogRumUser(user);
      setValue(user);
      navigate("/home");
    });
  });

  useEffect(() => {
    if (Object.keys(value).length > 0) {
      datadogLogs.logger.info("Redirect  already logged in user", {
        username: value.username,
        userId: `${value.userId}`,
      });
      setDatadogRumUser(value);
      navigate("/home");
    }
  }, []);

  return (
    <Center>
      <form onSubmit={onSubmit} style={{ minWidth: "400px" }}>
        <Field.Root required>
          <Field.Label>
            Username <Field.RequiredIndicator />
          </Field.Label>
          <Input {...register("username")} placeholder="Enter your username" />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>
        <Button type="submit" marginTop="4">
          Login
        </Button>
      </form>
    </Center>
  );
};

export default Login;
