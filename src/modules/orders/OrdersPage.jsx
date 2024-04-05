import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import Container from "../../components/Container.jsx";
import {Col, Empty, Flex, Image, Modal, Row, Space, Spin, Typography} from "antd";
import useGetAllQuery from "../../hooks/api/useGetAllQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import {get, isEmpty, isNil} from "lodash";
import Orders from "./components/Orders.jsx";
const {Text,Title} = Typography;
const OrdersPage = () => {
    const {t,i18n} = useTranslation()
    const {userId,lang} = useParams()
    const [selectedItem, setSelectedItem] = useState(null);
    const {data,isLoading} = useGetAllQuery({
        key: KEYS.get_all_order,
        url: URLS.get_all_order,
        params: {
            params: {
                user_id: userId,
            }
        }
    })
    const changeLang = () => {
        localStorage.setItem('lang', lang);
        i18n.changeLanguage(lang)
    }
    useEffect(() => {
        changeLang();
    }, []);
    if (isLoading){
        return <Spin fullscreen />
    }
    const style = {
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: "10px",
        borderRadius: 10,
        cursor: "pointer",
        marginTop: 3
    }
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}}>
                {
                    isEmpty(get(data,'data.data')) ? (
                        <Flex justify={"center"} vertical align={"center"} style={{marginTop: 100}}>
                            <Empty description={false}/>
                            <Text>{t("Malumot yo'q")}</Text>
                        </Flex>
                    ) : (
                        <>
                            {
                                get(data,'data.data',[])?.map((data) => {
                                    return <Orders data={data} key={get(data,'id')} setSelectedItem={setSelectedItem}/>
                                })
                            }
                        </>
                    )
                }
            </Space>
            <Modal title={"To'liq ma'lumot"} open={!isNil(selectedItem)} onCancel={() => setSelectedItem(null)} footer={null}>
               <Space direction={"vertical"} style={{width: "100%", maxHeight: "80vh", overflowY: "scroll", scrollbarWidth: "none"}}>
                   <Flex align={"center"} justify={"space-between"}>
                       <Text>{t("Buyurtma raqami")}: {get(selectedItem,'id')}</Text>
                       <Text>{t("To'lov turi")}: {get(selectedItem,'paymentProviderName')}</Text>
                   </Flex>
                   <Row gutter={[5,15]}>
                       {
                           get(selectedItem,'orderProducts',[])?.map((item) => {
                               return (
                                   <Col span={24} key={get(item,'id')} style={style}>
                                       <Row justify={"space-between"}>
                                           <Space style={{justifyContent: "space-between"}}>
                                               <img
                                                   src={get(item,'variation.product.imageUrl')}
                                                   width={90}
                                                   height={90}
                                               />
                                               <Space direction={"vertical"}>
                                                   <Title level={5}>{get(item,'variation.product.name')}</Title>
                                                   <Text>{get(item,'variation.name','')}</Text>
                                               </Space>
                                           </Space>
                                           <Space direction={"vertical"} size={"large"} style={{textAlign: "end", justifyContent: "center", alignItems: "end"}}>
                                               <Text>{get(item,'count')} {t("dona")}</Text>
                                               <Text>{Intl.NumberFormat('en-US').format(get(item,'variation.price') * get(item,'count'))} {t("so'm")}</Text>
                                           </Space>
                                       </Row>
                                   </Col>
                               )
                           })
                       }
                   </Row>
                   {
                       get(selectedItem,'comment') && (
                           <Text>
                               <Text strong>{t("Comment")}</Text>: {get(selectedItem,'comment')}
                           </Text>
                       )
                   }
               </Space>
            </Modal>
        </Container>
    );
};

export default OrdersPage;
