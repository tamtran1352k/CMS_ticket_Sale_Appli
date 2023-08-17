import { Area } from "@ant-design/plots";
import { collection, getDocs } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/plots";
import { Col, DatePicker, Layout, Row } from "antd";
import { db } from "../../firebase/fibase";
import Sider from "antd/es/layout/Sider";
import MenuLayout from "../menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import Card from "antd/es/card/Card";
import {
  BellIcon,
  DateIcon,
  EmailIcon,
  ImgIcon,
  ShapeBlueIcon,
  ShapeOrangeIcon,
} from "../icon/icon";

interface DataPoint {
  ngay_apdung: string;
  value: number;
}
interface DonutChartProps {
  data: { type: string; value: number }[];
}

interface DataType {
  key: string;
  stt: string;
  ma_goi: string;
  ten_goi: string;
  ngay_apdung: string;
  ngay_hethan: string;
  gia_ve: string;
  gia_combo: string;
  tinh_trang: string;
  soluong: string;
  loaive: string;
  checkin: string;
  chot: string;
  tensukien: string;
  sove: string;
  tinhtrangsudung: string;
}
const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const config = {
    data,

    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [{ type: "element-active" }],
    statistic: {
      title: {
        offsetY: -20,
        style: {
          fontSize: "20px",
          textAlign: "center",
        },
        formatter: () => "",
      },
      content: {
        style: {
          fontSize: "24px",
          textAlign: "center",
        },
        customHtml: () => `<div></div>`,
      },
    },
    color: ["#4F75FF", "#FF8A48"],
    legend: {
      visible: false,
    },
  };

  return <Pie {...config} style={{ width: 330, height: 200 }} />;
};

const EventsChart: React.FC = () => {
  const [datadashboard, setDataDashboard] = useState<DataType[]>([]);
  const [totalComboPrice, setTotalComboPrice] = useState<number>(0);
  const [totalCombosukiendasudung, setTotalCombosukiendasudung] =
    useState<number>(0);
  const [totalCombosukienchuasudung, setTotalCombosukienchuasudung] =
    useState<number>(0);
  const [totalCombogiadinhchuasudung, setTotalCombogiadinhchuasudung] =
    useState<number>(0);
  const [totalComboGiadinhdasudung, setTotalCombogiadinhdasudung] =
    useState<number>(0);
  const [dataForAreaChart, setDataForAreaChart] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Danhsachgoive"));
        const newData: DataType[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          newData.push({
            key: doc.id,
            stt: docData.stt,
            ma_goi: docData.ma_goi,
            ten_goi: docData.ten_goi,
            ngay_apdung: docData.ngay_apdung,
            ngay_hethan: docData.ngay_hethan,
            gia_ve: docData.gia_ve,
            gia_combo: docData.gia_combo,
            tinh_trang: docData.tinh_trang,
            soluong: docData.soluong,
            loaive: docData.loaive,
            checkin: docData.checkin,
            chot: docData.chot,
            tensukien: docData.tensukien,
            sove: docData.sove,
            tinhtrangsudung: docData.tinhtrangsudung,
          });
        });
        const dailyComboTotal: Record<string, number> = {}; // Map to store daily totals

        newData.forEach((item) => {
          const date = item.ngay_apdung.substring(0, 11);
          const comboPrice = parseFloat(item.gia_combo);
          if (dailyComboTotal[date]) {
            dailyComboTotal[date] += comboPrice;
          } else {
            dailyComboTotal[date] = comboPrice;
          }
        });

        // Create data for the area chart using daily total combo prices
        const areaChartData: DataPoint[] = Object.entries(dailyComboTotal).map(
          ([date, total]) => ({
            ngay_apdung: date,
            value: total,
          })
        );
        areaChartData.sort(
          (a, b) =>
            new Date(a.ngay_apdung).getTime() -
            new Date(b.ngay_apdung).getTime()
        );
        setDataForAreaChart(areaChartData);
        setDataDashboard(newData);

        const combogia = newData.map((item) => parseFloat(item.gia_combo));
        const tonggia = combogia.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        setTotalComboPrice(tonggia);
        const combogiaGiadinhChuasudung = newData
          .filter(
            (item) =>
              item.ten_goi === "Gia đình" &&
              item.tinhtrangsudung === "Chưa sử dụng"
          )
          .map((item) => parseFloat(item.gia_combo));
        const tonggiaGiadinhChuasudung = combogiaGiadinhChuasudung.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        setTotalCombogiadinhdasudung(tonggiaGiadinhChuasudung);

        const combogiaGiadinhDasudung = newData
          .filter(
            (item) =>
              item.ten_goi === "Gia đình" &&
              item.tinhtrangsudung === "Đã sử dụng"
          )
          .map((item) => parseFloat(item.gia_combo));
        const tonggiaGiadinhDasudung = combogiaGiadinhDasudung.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        setTotalCombogiadinhchuasudung(tonggiaGiadinhDasudung);

        const combogiaSukienDasudung = newData
          .filter(
            (item) =>
              item.ten_goi === "Sự kiện" &&
              item.tinhtrangsudung === "Đã sử dụng"
          )
          .map((item) => parseFloat(item.gia_combo));
        const tonggiaSukienDasudung = combogiaSukienDasudung.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        setTotalCombosukiendasudung(tonggiaSukienDasudung);

        const combogiaSukienChuasudung = newData
          .filter(
            (item) =>
              item.ten_goi === "Sự kiện" &&
              item.tinhtrangsudung === "Chưa sử dụng"
          )
          .map((item) => parseFloat(item.gia_combo));
        const tonggiaSukienChuasudung = combogiaSukienChuasudung.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        setTotalCombosukienchuasudung(tonggiaSukienChuasudung);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);
  const data: DataPoint[] = datadashboard.map((item) => ({
    ngay_apdung: item.ngay_apdung.substring(0, 11),
    value: parseFloat(item.gia_combo),
  }));
  data.sort(
    (a, b) =>
      new Date(a.ngay_apdung).getTime() - new Date(b.ngay_apdung).getTime()
  );

  const config = {
    data: dataForAreaChart,
    smooth: true,

    xField: "ngay_apdung",
    yField: "value",
    xAxis: {
      tickCount: 7,
      range: [0, 1],
    },

    yAxis: {},
    areaStyle: {
      fill: "rgba(250, 160, 95, 0.26)", // Change the color of the area to rgba(250, 160, 95, 0.26)
    },
    color: "#FAA05F", // Màu đường vẽ
    line: {
      style: {
        lineWidth: 2, // Set the line width
      },
    },
  };

  const chartData = [
    { type: "Đã sử dụng", value: totalCombosukiendasudung },
    { type: "Chưa sử dụng", value: totalCombosukienchuasudung },
  ];
  const chartDatagd = [
    { type: "Đã sử dụng", value: totalComboGiadinhdasudung },
    { type: "Chưa sử dụng", value: totalCombogiadinhchuasudung },
  ];

  return (
    <div>
      <Layout>
        <Sider>
          <MenuLayout />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: "#f5f5f5" }}>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: "10px" }}
            >
              <Col span={12} style={{ textAlign: "left" }}>
                <div className="input-group">
                  <input placeholder="Search" className="input with-icon" />
                </div>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <EmailIcon />
                <BellIcon />
                <ImgIcon />
              </Col>
            </Row>{" "}
          </Header>
          <Content
            style={{
              margin: "24px 16px 0",
            }}
          >
            <Card>
              <Row>
                 <Col>
                <span
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  fontStyle: "normal",
                  lineHeight: "54px",
                }}
              >
                Thống kê{" "}
              </span>
              </Col>
              </Row>
             
            
              <Row>
                <Col span={12} style={{ textAlign: "start" }}>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      fontStyle: "normal",
                      lineHeight: "26px",
                    }}
                  >
                    Doanh thu
                  </span>
                </Col>
                <Col span={12} style={{ textAlign: "end" }}>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      fontStyle: "normal",
                      lineHeight: "26px",
                    }}
                  >
                    <DatePicker format="DD/MM/YYYY" suffixIcon={<DateIcon />} />{" "}
                  </span>
                </Col>
              </Row>

              <Row style={{ marginTop: 20 }} justify={"center"}>
                <Col>
                  <div style={{ position: "relative" }}>
                    <Area {...config} style={{ width: 1200, height: 200 }} />
                  </div>
                </Col>
              </Row>
              <Row style={{ marginTop: 20 }} justify={"start"}>
                <Col>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      fontStyle: "normal",
                      lineHeight: "22px",
                    }}
                  >
                    Tổng doanh thu theo tuần
                  </span>
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col>
                  <span>
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        fontStyle: "normal",
                        lineHeight: "30px",
                      }}
                    >
                      {totalComboPrice.toLocaleString("vi-VN")}.000
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        fontStyle: "normal",
                        lineHeight: "22px",
                      }}
                    >
                      {" "}
                      đồng
                    </span>
                  </span>
                </Col>
              </Row>
              <Row style={{ marginTop: 20 }} justify={"center"}>
                <Col span={4} style={{ textAlign: "start" }}>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      fontStyle: "normal",
                      lineHeight: "26px",
                    }}
                  >
                    <DatePicker format="DD/MM/YYYY"  suffixIcon={<DateIcon />} />{" "}
                  </span>
                </Col>
                <Col span={8}>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      fontStyle: "normal",
                      lineHeight: "25px",
                      marginRight: "40%",
                    }}
                  >
                    Sự kiện{" "}
                  </span>
                  <DonutChart data={chartData} />
                </Col>
                <Col span={8}>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      fontStyle: "normal",
                      lineHeight: "25px",
                      marginRight: "40%",
                    }}
                  >
                    Gia đình
                  </span>

                  <DonutChart data={chartDatagd} />
                </Col>
                <Col span={4} style={{ textAlign: "start" }}>
                  <Row justify={"start"}>
                    <Col span={24}>
                      <ShapeBlueIcon /> <span>&nbsp; Vé đã sử dụng</span>
                    </Col>
                    <Col span={24}>
                      <ShapeOrangeIcon />
                      <span>&nbsp; Vé chưa sử dụng </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default EventsChart;
