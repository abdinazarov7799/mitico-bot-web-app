import React, {useEffect, useState} from 'react';
import {Carousel, Col, Row, Space, Typography, FloatButton, Button, Modal} from "antd";
import Container from "../../components/Container.jsx";
import useGetAllQuery from "../../hooks/api/useGetAllQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import {get, isEqual} from "lodash";
import {useTranslation} from "react-i18next";
import ProductContainer from "./components/ProductContainer.jsx";
import {useNavigate, useParams} from "react-router-dom";
import AffixContainer from "../../components/AffixContainer.jsx";
import {ShoppingCartOutlined} from "@ant-design/icons";
import {Link} from "react-scroll";
import useStore from "../../services/store/useStore.jsx";
const {Text} = Typography

const HomePage = () => {
    const {t,i18n} = useTranslation();
    const navigate = useNavigate();
    const {lang,userId} = useParams();
    const {branchesIsOpen,setBranchesIsOpen} = useStore();
    const [isModalOpen, setIsModalOpen] = useState(!branchesIsOpen);
    const {data:categoriesData} = useGetAllQuery({
        key: KEYS.category_list,
        url: URLS.category_list,
        params: {
            params: {
                user_id: userId,
            }
        }
    })
    const {data:bannerData} = useGetAllQuery({
        key: KEYS.banner_list,
        url: URLS.banner_list,
        params: {
            params: {
                user_id: userId,
            }
        }
    })
    const {data:branchesIsActive} = useGetAllQuery({
        key: KEYS.get_branch_active,
        url: URLS.get_branch_active,
    })
    useEffect(() => {
        setBranchesIsOpen(get(branchesIsActive,'data.data'));
    }, [get(branchesIsActive,'data')]);
    const changeLang = () => {
        localStorage.setItem('lang', lang);
        i18n.changeLanguage(lang)
    }
    useEffect(() => {
        changeLang();
    }, []);
    return (
        <Container>
            <Modal title={t("Ma'lumot")} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <Text>
                    {t("Hozirgi vaqtda barcha filiallarimiz yopilgan. Keltirilgan noqulayliklar uchun uzr so'raymiz.")}
                </Text>
            </Modal>
            <Space style={{width: "100%"}} direction={"vertical"}>
                <Row gutter={[10,10]}>
                    {
                        get(categoriesData,'data.data')?.map((item) => (
                            <Col xs={{span: 8}} sm={{span: 6}} key={get(item,'id')} style={{textAlign: "center"}}>
                                <Link
                                    activeClass="active"
                                    to={get(item,'name')}
                                    smooth={true}
                                    isDynamic={true}
                                    offset={-50}
                                    ignoreCancelEvents={false}
                                >
                                    <div style={{
                                        height: 100,
                                        backgroundImage: `url(${get(item,'imageUrl')})`,
                                        backgroundPosition: "center center",
                                        backgroundSize: "cover",
                                        borderRadius: "20px"
                                    }}>
                                    </div>
                                    <Text>{get(item,'name')}</Text>
                                </Link>
                            </Col>
                        ))
                    }
                </Row>
                <Carousel autoplay>
                    {
                        get(bannerData, 'data.data')?.map((item) => (
                            <div key={get(item,'id')}>
                                <div style={{
                                    height: 200,
                                    backgroundImage: `url(${get(item, 'imageUrl')})`,
                                    backgroundPosition: "center center",
                                    backgroundSize: "cover",
                                }}>
                                </div>
                            </div>
                        ))
                    }
                </Carousel>
                <AffixContainer>
                    <Space>
                        {
                            get(categoriesData,'data.data')?.map((item) => (
                                <Link
                                    key={get(item,'id')}
                                    activeClass="active"
                                    to={get(item,'name')}
                                    smooth
                                    spy
                                    offset={-50}
                                >
                                    <Button type={"text"}>{get(item,'name')}</Button>
                                </Link>
                            ))
                        }
                    </Space>
                </AffixContainer>
                <div>
                    {
                        get(categoriesData,'data.data',[])?.map((item) => {
                            return <ProductContainer category={item} key={get(item,'id')} userId={userId} lang={lang}/>
                        })
                    }
                </div>
            </Space>
            <FloatButton.Group>
                <FloatButton onClick={() => navigate(`/basket/${userId}/${lang}`)} icon={<ShoppingCartOutlined />} />
                <FloatButton.BackTop />
            </FloatButton.Group>
        </Container>
    );
};

export default HomePage;
