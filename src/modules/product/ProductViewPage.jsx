import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Container from "../../components/Container.jsx";
import useGetOneQuery from "../../hooks/api/useGetOneQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import {get, head, isEqual} from "lodash";
import {Button, Flex, Input, Radio, Space, Spin, theme, Typography} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import useStore from "../../services/store/useStore.jsx";
const {Text,Title} = Typography;
const ProductViewPage = () => {
    const {id,userId,lang} = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [selected, setSelected] = useState();
    const [count, setCount] = useState(1);
    const {addToOrder} = useStore();
    const {
        token: { colorBorder },
    } = theme.useToken();
    const {data,isLoading} = useGetOneQuery({
        id,
        key: KEYS.get_variation,
        url: URLS.get_variation,
        params: {
            params: {
                user_id: userId
            }
        }
    })
    const headData = get(data,'data.data',[])
    const product = get(head(headData),'product');
    const isOneVariation = headData?.length === 1;
    useEffect(() => {
        if (isOneVariation){
            setSelected(head(headData))
        }
    }, [headData]);
    useEffect(() => {
        if (isOneVariation) {
            setCount(0)
        }else {
            setCount(1)
        }
    }, [selected]);
    const addToBasket = () => {
        addToOrder({
            variationId: get(selected,'id'),
            variationName: get(selected,'name'),
            price: get(selected,'price'),
            id: get(selected,'product.id'),
            name: get(selected,'product.name'),
            imageUrl: get(selected,'product.imageUrl'),
            count
        })
        navigate(`/${userId}/${lang}`)
    }
    if (isLoading){
        return <Spin fullscreen/>
    }
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}}>
                <Flex>
                    <Button
                        type={"primary"}
                        icon={<ArrowLeftOutlined/>}
                        onClick={() => navigate(`/${userId}/${lang}`)}
                    >
                        {t("Back")}
                    </Button>
                </Flex>
                <img
                    src={get(product, 'imageUrl')}
                    height={300}
                    style={{width: "100%", objectFit: "cover"}}
                />
                <Title level={4}>{get(product, 'name')}</Title>
                <Text>{get(product,'description')}</Text>
                <Radio.Group
                    style={{display: "flex", flexDirection: "column", paddingBottom: 70}}
                    onChange={(e) => {
                        setSelected(head(headData?.filter(data => isEqual(get(data, "id"), get(e, 'target.value')))));
                    }}
                >
                    <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                        {
                            !isOneVariation && headData?.map((item) => {
                                return  <Radio
                                    value={get(item,'id')}
                                    key={get(item,'id')}
                                >
                                    <Text style={{margin: "0 10px"}}>{get(item,'measure')} {get(item,'measureUnit.name')}</Text>
                                    <Text>{Intl.NumberFormat('en-US').format(get(item,'price'))} {t("so'm")}</Text>
                                </Radio>
                            })
                        }
                    </Space>
                </Radio.Group>
                <div style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    padding: "15px 10px 17px 10px",
                    width: "100%",
                    backgroundColor: colorBorder
                }}>
                    <Space direction={"vertical"} style={{width: "100%"}}>
                        <Flex justify={"space-between"} align={"center"}>
                            <Text strong>
                                {selected ? get(selected, 'name') : t("Keraklisini tanlang")}
                            </Text>
                            {
                                selected && (
                                    <Space>
                                        <Text style={{marginRight: 5}} strong>
                                            {Intl.NumberFormat('en-US').format(count * get(selected,'price'))} {t("so'm")}
                                        </Text>
                                        <Button
                                            type={"primary"}
                                            onClick={() => count > 0 && setCount(count-1)}
                                        >
                                            -
                                        </Button>
                                        <Input
                                            value={count}
                                            min={0}
                                            controls={false}
                                            type={"number"}
                                            style={{textAlign: "center", width: 50}}
                                        />
                                        <Button
                                            type={"primary"}
                                            onClick={() => setCount(count+1)}
                                        >
                                            +
                                        </Button>
                                    </Space>
                                )
                            }
                        </Flex>
                        {
                            selected && <Button block type={"primary"} onClick={addToBasket}>{t("Savatga qo'shish")}</Button>
                        }
                    </Space>
                </div>
            </Space>
        </Container>
    );
};

export default ProductViewPage;
