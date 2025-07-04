import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MuxPlayer from "@mux/mux-player-react";
import { Heading } from "@chakra-ui/react";

const Streaming = () => {
  const params = useParams();

  useEffect(() => {}, []);

  return (
    <>
      <Heading marginBottom={2}>{params.title}</Heading>
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
