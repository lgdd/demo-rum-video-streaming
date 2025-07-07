import { ColorModeButton } from "@/components/ui/color-mode";
import type { User } from "@/types/User";
import { Button, Container, Flex, Heading } from "@chakra-ui/react";
import { datadogLogs } from "@datadog/browser-logs";
import { datadogRum } from "@datadog/browser-rum";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

const Layout = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState<User>({} as User);
  const [value, setValue] = useLocalStorage<User>(
    "rum-vide-streaming--user",
    {} as User
  );

  useEffect(() => {
    if (Object.keys(value).length === 0) {
      navigate("/");
    } else {
      setUser(value);
    }
  }, [value, user]);

  return (
    <Container py={4}>
      {(Object.keys(value).length > 0 && (
        <Flex justify="space-between">
          <ColorModeButton />
          <Heading>Hello, {user.username}!</Heading>
          <Button
            type="button"
            colorPalette={"red"}
            onClick={() => {
              datadogLogs.logger.info("User logged out", {
                userId: value.userId,
                username: value.username,
              });
              datadogRum.clearUser();
              datadogRum.stopSession();
              setValue({} as User);
              navigate("/");
            }}
          >
            Logout
          </Button>
        </Flex>
      )) || (
        <Flex justify="space-between">
          <ColorModeButton />
        </Flex>
      )}
      <Outlet />
    </Container>
  );
};

export default Layout;
