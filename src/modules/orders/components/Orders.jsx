import React from 'react';
import {Row, Space, Typography} from "antd";
import {get, isEqual} from "lodash";
import {useTranslation} from "react-i18next";
const {Title,Text} = Typography;
const Orders = ({data,setSelectedItem}) => {
    const {t} = useTranslation();
    const style = {
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: "10px",
        borderRadius: 10,
        cursor: "pointer",
        marginTop: 3
    }
    const getOrderType = (status) => {
        if (isEqual(status,'Tasdiqlangan')){
            return "success"
        }else if (isEqual(status,'Rad etilgan')){
            return "danger"
        }else if (isEqual(status,'Tasdiqlanmagan')){
            return "warning"
        }
    }
    return (
        <div style={style} onClick={() => setSelectedItem(data)}>
            <Row justify={"space-between"}>
                <Space direction={"vertical"}>
                    <Title level={5} style={{margin: 0}}>{get(data,'branchWebDTO.name')}</Title>
                    <Text>{get(data,'createdAt')}</Text>
                </Space>
                <Space direction={"vertical"} style={{textAlign: "end"}}>
                    <Text>{Intl.NumberFormat('en-US').format(get(data,'price') )} {t("so'm")}</Text>
                    <Text type={getOrderType(get(data,'status'))}>{get(data,'status')}</Text>
                </Space>
            </Row>
        </div>
    );
};

export default Orders;
