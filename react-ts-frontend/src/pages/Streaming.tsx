import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MuxPlayer from "@mux/mux-player-react";
import { Flex, Heading, IconButton } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";

const Streaming = () => {
  const params = useParams();

  useEffect(() => {}, []);

  return (
    <>
      <Flex direction="flex-start" alignItems="center" gap={2}>
        <Link to="/home">
          <IconButton bg="transparent" color={{ base: "black", _dark: "white" }}>
            <LuArrowLeft />
          </IconButton>
        </Link>
        <Heading my={2}>{params.title}</Heading>
      </Flex>
      <MuxPlayer
        playbackId={params.playbackId}
        metadata={{
          video_id: params.id,
          video_title: params.title,
          viewer_user_id: params.viewerUserId,
        }}
      />
    </>
  );
};

export default Streaming;
