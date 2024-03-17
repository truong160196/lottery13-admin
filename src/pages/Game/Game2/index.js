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
  Dice2Result,
  Dice3Result,
  DiceResult,
  DiceText,
  gameLevelText,
} from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import { useNotify } from "_common/component/NotifyProvider";
import { useStores } from "_common/hooks";
import { formatTimeSecond } from "_common/utils/datetimeFormat";
import classNames from "classnames";
import { GameApi } from "states/api/game";
import ListPlayer from "../ListPlayer";

const categoryText = "pk10";

const Game2Page = observer(() => {
  const { isAdmin } = usePermission();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const {
    authStore: { games, item_ball, item_number },
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
    if (!gameInfo) return;
    console.log(gameInfo);
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
    const optionDice = Dice3Result[type];

    const requests = {
      number1: optionDice,
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
            <h2 className="remix-page-title">Cấu hình game</h2>
          </div>
          <Tabs activeKey={game_code} onChange={handleChangeLevel}>
            {listGame?.map((item) => {
              return <Tabs.TabPane key={item?.id} tab={item?.title} />;
            })}
          </Tabs>
          <Row>
            <Col xs={24} sm={12} md={6}>
              <Card className="remix-card shadow-sm full-height">
                <div className="card-bet">
                  <h5>
                    Thời gian còn lại phiên <b>#{gameInfo?.game_no}</b>
                  </h5>
                  <h4 className="time">{formatTimeSecond(dataGame?.time)}</h4>
                  <p>
                    Trạng thái đặt cược:
                    <Tag color={dataGame?.status === "start" ? "green" : "red"}>
                      <b>
                        {dataGame?.status == "start" ? "Mở" : "Chờ kết quả"}
                      </b>
                    </Tag>
                  </p>
                  <p className="ks">
                    Kết quả phiên trước: {get(gameInfo, "prev_game.game_no")}
                    <div className="list-ball">
                      <div className="ball">
                        {get(gameInfo, "prev_game.number1")}
                      </div>
                      <div className="ball">
                        {get(gameInfo, "prev_game.number2")}
                      </div>
                      <div className="ball">
                        {get(gameInfo, "prev_game.number3")}
                      </div>
                      <div className="ball">
                        {get(gameInfo, "prev_game.number4")}
                      </div>
                      <div className="ball">
                        {get(gameInfo, "prev_game.number5")}
                      </div>
                      <div className="ball">
                        {get(gameInfo, "prev_game.number6")}
                      </div>
                      <div className="ball">
                        {get(gameInfo, "prev_game.number7")}
                      </div>
                      <div className="ball">
                        {get(gameInfo, "prev_game.number8")}
                      </div>
                      <div className="ball">
                        {get(gameInfo, "prev_game.number9")}
                      </div>
                      <div className="ball">
                        {get(gameInfo, "prev_game.number10")}
                      </div>
                    </div>
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="remix-card shadow-sm full-height">
                <p className="text-gray mb-0">
                  <b>Điều chỉnh kết quả Con số từ 0 - 9</b>
                </p>
                <Spin spinning={isLoadingUpdate} tip="Đang cập nhật ...">
                  <Form
                    form={form}
                    layout="vertical"
                    className="remix-form-cms"
                    initialValues={{}}
                    onFinish={onUpdate}
                  >
                    <Row>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number1" label="Con số 1">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number2" label="Con số 2">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number3" label="Con số 3">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number4" label="Con số 4">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number5" label="Con số 5">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number5" label="Con số 5">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number6" label="Con số 6">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number7" label="Con số 7">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number8" label="Con số 8">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number9" label="Con số 9">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item name="number10" label="Con số 10">
                          <InputNumber
                            placeholder="Nhập giá trị"
                            inputMode="numeric"
                            min={0}
                            max={9}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="rate1" label="Tỉ lệ cược hai mặt đĩa">
                      <InputNumber
                        placeholder="Nhập giá trị"
                        inputMode="numeric"
                        min={0}
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
            <Col xs={24} sm={12} md={6}>
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

export default Game2Page;
