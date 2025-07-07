import type { User } from "@/types/User";
import type { Video } from "@/types/Video";
import { BACKEND_BASE_URL } from "@/utils/api";
import { Table } from "@chakra-ui/react";
import { datadogRum } from "@datadog/browser-rum";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

const Home = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState<User>({} as User);
  const [videos, setVideos] = useState<Video[]>([]);
  const [value] = useLocalStorage<User>("rum-vide-streaming--user", {} as User);

  const fetchVideos = async (): Promise<Video[]> => {
    const response = await fetch(`${BACKEND_BASE_URL}/videos`);
    const json = await response.json();
    return json["data"];
  };

  useEffect(() => {
    if (Object.keys(value).length === 0) {
      navigate("/");
    } else {
      datadogRum.setUser({
        id: `${value.userId}`,
        username: value.username,
        plan: "premium",
      });
      setUser(value);
      fetchVideos().then((videos) => setVideos(videos));
    }
  }, []);

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Title</Table.ColumnHeader>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {videos != undefined &&
            videos.length > 0 &&
            videos.map((video, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Link
                      to={`/streaming/${video.id}/${video.playback_ids[0].id}/${video.meta.title}/${user.userId}`}
                    >
                      {video.meta.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{video.id}</Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default Home;
