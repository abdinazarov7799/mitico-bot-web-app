import React, {useEffect, useState} from 'react';
import Container from "../../components/Container.jsx";
import {Alert, Button, Col, Empty, Flex, Image, Input, Row, Space, theme, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {ArrowLeftOutlined, DeleteOutlined} from "@ant-design/icons";
import {get, isEmpty, isNil} from "lodash";
import {useNavigate, useParams} from "react-router-dom";
import useStore from "../../services/store/useStore.jsx";
import usePostQuery from "../../hooks/api/usePostQuery.js";
import {URLS} from "../../constants/url.js";
import {useTelegram} from "../../hooks/useTelegram.jsx";
const {Title,Text} = Typography;
const BasketPage = () => {
    const {
        token: { colorBorder },
    } = theme.useToken();
    const {orders,setOrders,increment, decrement,branchesIsOpen} = useStore();
    const {t} = useTranslation()
    const navigate = useNavigate()
    const {userId,lang} = useParams()
    const [fullPrice, setFullPrice] = useState(0);
    const {mutate,isLoading} = usePostQuery({})
    const {onClose} = useTelegram();
    useEffect(() => {
        let price = 0
        orders?.map((order) => {
            price += (get(order,'count') * get(order,'price'))
        })
        setFullPrice(price)
    }, [orders]);
    const dispatchOrder = () => {
        if (!isNil(orders) && !isEmpty(orders)){
            mutate({
                    url: URLS.add_order,
                    attributes: orders,
                    config: {
                        params: {
                            user_id: userId
                        }
                    }
                },
                {
                    onSuccess: () => {
                        setOrders([]);
                        setFullPrice(0);
                        onClose();
                    }
                })
        }
    }
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}}>
                <Flex justify={"space-between"}>
                    <Button
                        type={"primary"}
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(`/${userId}/${lang}`)}
                    >
                        {t("Back")}
                    </Button>
                    <Button
                        type={"default"}
                        icon={<DeleteOutlined />}
                        onClick={() => setOrders([])}
                    >
                        {t("Delete basket")}
                    </Button>
                </Flex>
                {
                    isEmpty(orders) ? (
                        <Flex justify={"center"} vertical align={"center"} style={{marginTop: 100}}>
                            <Empty description={false}/>
                            <Text>{t("Malumot yo'q")}</Text>
                        </Flex>
                    ) : (
                        <Row gutter={[5,15]} style={{paddingBottom: 70}}>
                            {
                                orders?.map((item,index) => {
                                    return (
                                        <Col span={24} key={index+1} style={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", borderRadius: 10,padding: "10px"}}>
                                            <Row style={{flexWrap: "nowrap"}} justify={"space-between"}>
                                                <Space>
                                                    <Image
                                                        src={get(item,'imageUrl')}
                                                        preview={false}
                                                        width={90}
                                                        height={90}
                                                    />
                                                    <Space direction={"vertical"}>
                                                        <Title level={5} style={{margin: 0}}>{get(item,'name')}</Title>
                                                        <Text>{get(item,'variationName')}</Text>
                                                        <Text>{Intl.NumberFormat('en-US').format(get(item,'price'))} {t("so'm")}</Text>
                                                    </Space>
                                                </Space>
                                                <Space direction={"vertical"} style={{ justifyContent: "space-between", alignItems: "end"}}>
                                                    <Text>{Intl.NumberFormat('en-US').format(get(item,'price') * get(item,'count'))} {t("so'm")}</Text>
                                                    <Flex>
                                                        <Button
                                                            type={"primary"}
                                                            onClick={() => decrement(get(item,'variationId'))}
                                                            style={{width: 30, padding: 0}}
                                                        >
                                                            -
                                                        </Button>
                                                        <Input style={{textAlign: "center", margin: "0 5px",width: 40 , minWidth: 30}} value={get(item,'count')}/>
                                                        <Button
                                                            type={"primary"}
                                                            onClick={() => increment(item)}
                                                            style={{width: 30, padding: 0}}
                                                        >
                                                            +
                                                        </Button>
                                                    </Flex>
                                                </Space>
                                            </Row>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    )
                }
                <div style={{position: "fixed", bottom: 0,left: 0,  padding: "15px 10px 17px 10px", width: "100%", backgroundColor: colorBorder}}>
                    <Space direction={"vertical"} style={{width: "100%"}}>
                        {
                            !branchesIsOpen &&
                            <Alert message={t("Hozirgi vaqtda barcha filiallarimiz yopilgan. Keltirilgan noqulayliklar uchun uzr so'raymiz.")} type="error" />
                        }
                        <Flex justify={"space-between"} align={"center"}>
                            <Text strong>
                                {t("Общая стоимость товаров:")}
                            </Text>
                            <Text strong>
                                {Intl.NumberFormat('en-US').format(fullPrice)} {t("so'm")}
                            </Text>
                        </Flex>
                        <Button block type={"primary"} onClick={dispatchOrder} loading={isLoading} disabled={!branchesIsOpen}>
                            {t("Оформить заказ")}
                        </Button>
                    </Space>
                </div>
            </Space>
        </Container>
    );
};

export default BasketPage;
