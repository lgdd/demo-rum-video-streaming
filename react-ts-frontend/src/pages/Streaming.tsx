import { Link, useParams } from "react-router-dom";
import MuxPlayer from "@mux/mux-player-react";
import { Flex, Heading, IconButton } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { datadogLogs } from "@datadog/browser-logs";
import { datadogRum } from "@datadog/browser-rum";
import { useLocalStorage } from "usehooks-ts";
import type { User } from "@/types/User";
import { useState } from "react";

const Streaming = () => {
  const params = useParams();
  const [value] = useLocalStorage<User>("rum-vide-streaming--user", {} as User);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const updateIntervalInMilliseconds: number = 1 * 60 * 1000;

  const muxMetadata = {
    video_id: params.id,
    video_title: params.title,
    viewer_user_id: params.viewerUserId,
  };

  const onPlay = () => {
    datadogLogs.logger.info(
      `${value.username} is playing video '${params.title}'`,
      muxMetadata
    );
    datadogRum.addAction("play", muxMetadata);
  };

  const onTimeUpdate = () => {
    if (lastUpdate === null) {
      setLastUpdate(new Date());
    } else {
      const currentDate: Date = new Date();
      const timeDifference: number =
        currentDate.getTime() - lastUpdate.getTime();
      if (timeDifference >= updateIntervalInMilliseconds) {
        datadogLogs.logger.debug(
          `${value.username} is still watching '${params.title}'`,
          muxMetadata
        );
        datadogRum.addAction("watching", muxMetadata);
        setLastUpdate(new Date());
      }
    }
  };

  const onPause = () => {
    datadogLogs.logger.info(
      `${value.username} has paused video '${params.title}'`,
      muxMetadata
    );
    datadogRum.addAction("pause", muxMetadata);
  };

  const onEnded = () => {
    datadogLogs.logger.info(
      `Video ${params.title} has ended for ${value.username}`,
      muxMetadata
    );
    datadogRum.addAction("ended", muxMetadata);
  };

  return (
    <>
      <Flex direction="flex-start" alignItems="center" gap={2}>
        <Link to="/home">
          <IconButton
            bg="transparent"
            color={{ base: "black", _dark: "white" }}
          >
            <LuArrowLeft />
          </IconButton>
        </Link>
        <Heading my={2}>{params.title}</Heading>
      </Flex>
      <MuxPlayer
        playbackId={params.playbackId}
        metadata={muxMetadata}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
    </>
  );
};

export default Streaming;
