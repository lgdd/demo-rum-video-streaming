import type { User } from "@/types/User";
import { Button, Center, Field, Input } from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [value, setValue, removeValue] = useLocalStorage<User>(
    "rum-vide-streaming--user",
    {} as User
  );

  const handleLogin = async (username: string): Promise<User> => {
    const response = await fetch("http://localhost:3000/login", {
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
      setValue(user);
      navigate("/home");
    });
  });

  useEffect(() => {
    if (Object.keys(value).length > 0) {
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
