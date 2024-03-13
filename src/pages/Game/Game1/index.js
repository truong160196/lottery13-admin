import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  formatDate,
  get,
  GridView,
  Form,
  message,
  Empty,
  Tag,
  Col,
  Row,
  formatNumber,
  InputNumber,
  Input,
  Radio,
  Space,
  Table,
  Tabs,
  Spin,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  DiceResult,
  DiceText,
  gameLevelText,
  statusColor,
  statusText,
} from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import { useNotify } from "_common/component/NotifyProvider";
import { useStores } from "_common/hooks";
import { formatTimeSecond } from "_common/utils/datetimeFormat";
import classNames from "classnames";
import { GameApi } from "states/api/game";
import ListPlayer from "../ListPlayer";

const categoryText = "nhanh";

const Game1Page = observer(() => {
  const { isAdmin } = usePermission();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const {
    authStore: { games, dice_url, item_ball, item_number },
  } = useStores();
  const {
    dataGame,
    new_time_game,
    game_level,
    handleChangeGame,
    pushNotify,
  } = useNotify();

  const [currentBall, setCurrentBall] = useState();
  const [game_code, setGameCode] = useState();

  const listGame = useMemo(() => {
    const cloneData = [...games];
    return cloneData?.filter((obj) => obj?.category === categoryText);
  }, [games]);

  useEffect(() => {
    if (!listGame?.length) return;
    setGameCode(listGame?.[0].id);
    handleChangeGame(listGame?.[0].code);
  }, [listGame]);

  const { data: gameInfo, refetch } = useQuery(
    ["game", "detail", game_code, game_level],
    () =>
      GameApi.getGameInfo({
        params: {
          code: game_level,
          game_id: game_code,
          category: categoryText,
        },
      }),
    {
      staleTime: 300000,
      enabled: !!game_code,
    }
  );

  useEffect(() => {
    queryClient.invalidateQueries(["game", "detail"]);
    queryClient.invalidateQueries(["game-player", "list"]);
  }, [game_code, game_level]);

  const { mutate: onUpdate, isLoading: isLoadingUpdate } = useMutation(
    (variables) => {
      return GameApi.update({
        params: {
          game_id: gameInfo?.id,
          ...variables,
        },
      });
    },
    {
      onSuccess: (res) => {
        pushNotify({
          type: "update_user",
        });
        queryClient.invalidateQueries(["game", "detail"]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  useEffect(() => {
    form.setFieldsValue({
      ...gameInfo,
    });
  }, [gameInfo]);

  const handleChangeLevel = (key) => {
    const indexItem = listGame?.find((obj) => obj?.id === key);
    handleChangeGame(indexItem?.code);
    setGameCode(indexItem?.id);
  };

  const handleChangeBall = (type) => {
    const optionDice = Dice2Result[type];

    const requests = {
      number1: optionDice[0],
      number2: optionDice[1],
      number3: optionDice[2],
      number4: optionDice[3],
      number5: optionDice[4],
    };

    form.setFieldsValue(requests);

    onUpdate(requests);
  };

  useEffect(() => {
    if (!currentBall) return;
    handleChangeBall(currentBall);
  }, [currentBall]);

  useEffect(() => {
    if (!new_time_game) return;
    setCurrentBall(null);
    form.resetFields();
    queryClient.invalidateQueries(["game", "detail"]);
    queryClient.invalidateQueries(["game-player", "list"]);
  }, [new_time_game]);

  if (!isAdmin)
    return (
      <div className="remix-page">
        <Empty description="Không có quyền truy cấp" />
      </div>
    );

  return (
    <div className="remix-page">
      <div className="main-content-inner">
        <div className="page-container">
          <div className="remix-sub-header">
            <h2 className="remix-page-title">Nhanh 3</h2>
          </div>
          <Tabs activeKey={game_code} onChange={handleChangeLevel}>
            {listGame?.map((item) => {
              return <Tabs.TabPane key={item?.id} tab={item?.title} />;
            })}
          </Tabs>
          <Row>
            <Col xs={24} sm={12} md={8}>
              <Card className="remix-card shadow-sm full-height">
                <div className="card-bet">
                  <h5>
                    Thời gian còn lại phiên <b>#{gameInfo?.game_no}</b>
                  </h5>
                  <h4 className="time">{formatTimeSecond(dataGame?.time)}</h4>
                  <p>
                    Trạng thái đặt cược:{" "}
                    <Tag color={dataGame?.status === "start" ? "green" : "red"}>
                      <b>
                        {dataGame?.status != "start" ? "Mở" : "Chờ kết quả"}
                      </b>
                    </Tag>
                  </p>
                  <p className="ks">
                    Kết quả phiên trước:{" "}
                    <div className="lotteryNumber">
                      <div
                        className={
                          DiceText[get(gameInfo, "prev_game.number1", 1)]
                        }
                        style={{
                          backgroundImage: `url(${dice_url})`,
                        }}
                      />
                      <div
                        className={
                          DiceText[get(gameInfo, "prev_game.number2", 1)]
                        }
                        style={{
                          backgroundImage: `url(${dice_url})`,
                        }}
                      />
                      <div
                        className={
                          DiceText[get(gameInfo, "prev_game.number2", 1)]
                        }
                        style={{
                          backgroundImage: `url(${dice_url})`,
                        }}
                      />
                    </div>
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="remix-card shadow-sm full-height">
                <p className="text-gray mb-0">
                  <b>Điều chỉnh kết quả xúc xắc từ 1 - 6</b>
                </p>
                <Spin spinning={isLoadingUpdate} tip="Đang cập nhật ...">
                  <Form
                    form={form}
                    layout="vertical"
                    className="remix-form-cms"
                    onFinish={onUpdate}
                  >
                    <Form.Item name="number1" label="Xúc xắc 1">
                      <InputNumber
                        placeholder="Nhập giá trị"
                        inputMode="numeric"
                        min={1}
                        max={6}
                      />
                    </Form.Item>
                    <Form.Item name="number2" label="Xúc xắc 2">
                      <InputNumber
                        placeholder="Nhập giá trị"
                        inputMode="numeric"
                        min={1}
                        max={6}
                      />
                    </Form.Item>
                    <Form.Item name="number3" label="Xúc xắc 3">
                      <InputNumber
                        placeholder="Nhập giá trị"
                        inputMode="numeric"
                        min={1}
                        max={6}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        onClick={() => form.submit()}
                        className="btn-danger btn-relief"
                      >
                        Cập nhật
                      </Button>
                    </Form.Item>
                  </Form>
                </Spin>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="remix-card shadow-sm full-height">
                <div className="list-ball-bet">
                  {item_ball.map((item) => {
                    return (
                      <div
                        className={classNames("item", {
                          active: item?.code === currentBall,
                        })}
                        key={item?.code}
                        onClick={() => setCurrentBall(item?.code)}
                      >
                        <div className="itemBall">
                          <div className="number">{item?.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="list-ball-bet">
                  {item_number.map((item) => {
                    return (
                      <div
                        className={classNames("item", {
                          active: item?.code === currentBall,
                        })}
                        key={item?.code}
                        onClick={() => setCurrentBall(item?.code)}
                      >
                        <div className="itemBall">
                          <div className="number">{item?.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Card className="remix-card shadow-sm full-height">
                <h5 className="mb-0">
                  <b>Người chơi</b>
                </h5>

                <ListPlayer game_id={gameInfo?.id} />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
});

export default Game1Page;
