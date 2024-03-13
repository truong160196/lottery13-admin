import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import io from "socket.io-client";
import { socketUrl } from "_common/constants/common";
import { useQueryClient } from "@tanstack/react-query";
import { get, message } from "remix-dls";
import { useParams } from "react-router-dom";
import { useStores } from "_common/hooks";

let sock = null;

export const NotifyContext = createContext({});

export default function NotifyProvider({ children }) {
  const queryClient = useQueryClient();
  const [dataGame, setDataGame] = useState({
    time: 60,
    game_no: null,
    game_1: {},
    game_2: {},
  });

  const [dataGame1, setDataGame1] = useState({});
  const [dataGame2, setDataGame2] = useState({});

  const [isConnect, setIsConnect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notify, setNotify] = useState(null);
  const [newResult, setNewResult] = useState(null);
  const [new_time_game, setNewTimeGame] = useState();
  const [game_level, setGameLevel] = useState("level_1");
  const [game_type, setGameType] = useState("game_1");

  const onGetDataGame = (data) => {
    setDataGame({ time: data?.time, status: data?.status });
    setDataGame1(get(data, "game_1"));
    setDataGame2(get(data, "game_2"));
  };

  const onConnectSocket = (e) => {
    console.log(e);
    setIsLoading(false);
    setIsConnect(true);
  };

  const onJoinRoom = (room_id) => {
    if (sock) {
      sock.emit("join_room", {
        room_id,
      });
    }
  };

  const onLeaveRoom = (room_id) => {
    if (sock) {
      sock.emit("leave_room", {
        room_id,
      });
    }
  };

  useEffect(() => {
    onJoinRoom(game_level);
    return () => {
      onLeaveRoom(game_level);
    };
  }, [sock, game_level]);

  const pushNotify = (data) => {
    sock.emit("push_notify", {
      data,
    });
  };

  const onBetGame = (data) => {
    setNewResult(data);

    setNewTimeGame(new Date().getTime());
  };

  const onGetNotify = (data) => {
    setNotify(data);
    if (data?.data?.type === "betGame") {
      queryClient.invalidateQueries(["game-player", "list"]);
      message.info("Có người chơi đặt cược");
    }
  };

  const betGame = useCallback((data) => {
    sock.emit("betGame", { ...data });
  }, []);

  useEffect(() => {
    sock = io(socketUrl, {
      transports: ["websocket"],
    });

    sock.on("open", onConnectSocket);
    sock.on("dataGame", onGetDataGame);
    sock.on("bet-game", onBetGame);
    sock.on("push_notify", onGetNotify);
    return () => {
      sock.close();
    };
  }, []);

  const handleChangeGame = (code) => {
    setGameLevel(code);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const returnDefault = useMemo(() => {
    return {
      isLoading,
      game_level,
      notify,
      dataGame1,
      dataGame2,
      dataGame,
      newResult,
      new_time_game,
      setIsLoading,
      handleChangeGame,
      setGameType,
      game_type,
      setNotify,
      pushNotify,
      betGame,
      onJoinRoom,
      onLeaveRoom,
      sock,
    };
  }, [
    betGame,
    isLoading,
    dataGame1,
    dataGame2,
    game_type,
    game_level,
    notify,
    newResult,
    new_time_game,
    dataGame,
  ]);

  return (
    <NotifyContext.Provider value={returnDefault}>
      {children}
    </NotifyContext.Provider>
  );
}

export function useNotify() {
  return useContext(NotifyContext);
}
