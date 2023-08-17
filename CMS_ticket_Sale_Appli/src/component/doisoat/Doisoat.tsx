import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Layout,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
  Tooltip,
} from "antd";
import Sider from "antd/es/layout/Sider";
import MenuLayout from "../menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import Table, { ColumnsType } from "antd/es/table";
import { ChangeEvent, useEffect, useState } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebase/fibase";
import {
  BellIcon,
  DateIcon,
  DropdownIcon,
  EmailIcon,
  ImgIcon,
  SearchIcon,
} from "../icon/icon";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
}

const columns: ColumnsType<DataType> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    render: (_, record, index) => index + 1,
  },
  {
    title: "Số vé",
    dataIndex: "sove",
    key: "sove",
  },
  {
    title: "Tên sự kiện",
    dataIndex: "tensukien",
    key: "tensukien",
  },
  {
    title: "Ngày sử dụng",
    dataIndex: "ngay_apdung",
    key: "ngay_apdung",
  },
  {
    title: "Loại vé",
    dataIndex: "loaive",
    key: "loaive",
  },
  {
    title: "Cổng check - in",
    dataIndex: "checkin",
    key: "checkin",
  },
  {
    title: "",
    dataIndex: "chot",
    key: "chot",
  },
];

const DoiSoat: React.FC = () => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  //lịch distable
  const [datetungay, setDatetungay] = useState<dayjs.Dayjs | null>(null);

  const [data, setData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [value, setValue] = useState("Tất cả");
  const [searchText, setSearchText] = useState<string>("");
  const [isDoiSoat, setIsDoiSoat] = useState(false);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const handleInputChange = (value: string) => {
    setSearchText(value);

    // Filter the data based on the searchText
    const filteredData = data.filter((item) =>
      item.sove.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filteredData);
  };
  useEffect(() => {
    if (value === "Tất cả") {
      setIsDoiSoat(false);
      setFilteredData(data);
    }
  }, [data, value]);

  const handleExportTocsv = async () => {
    const dataToExport = data.filter((item) => item.chot === "Đã đối soát");

    const dataWithoutKey = dataToExport.map(({ key, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(dataWithoutKey);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "csv",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "Danh_sach_da_doi_soat.csv");
  };
  const handleFilter = () => {
    // Convert the selected date to the format "DD/MM/YYYY" using dayjs
    const selectedDateFormatted: string | null = date
      ? dayjs(date).format("DD/MM/YYYY")
      : null;
    // console.log(selectedDateFormatted)

    if (value === "Tất cả") {
      setIsDoiSoat(false);

      setFilteredData(data);
    } else if (value === "Đã đối soát") {
      setIsDoiSoat(true);

      setFilteredData(
        data.filter((item) => {
          // console.log(item.ngay_apdung.substring(0,10)); // Log the value of ngay_apdung
          return (
            (item.chot === "Đã đối soát" &&
              item.ngay_apdung.substring(0, 10) === selectedDateFormatted) ||
            item.chot === "Đã đối soát"
          );
        })
      );
    } else if (value === "Chưa đối soát") {
      setIsDoiSoat(false);

      setFilteredData(
        data.filter((item) => {
          // console.log(item.ngay_apdung); // Log the value of ngay_apdung
          return (
            (item.chot === "Chưa đối soát" &&
              item.ngay_apdung.substring(0, 10) === selectedDateFormatted) ||
            item.chot === "Chưa đối soát"
          );
        })
      );
    }
  };

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
          });
        });

        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);

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
            <Row gutter={16}>
              <Col span={16}>
                <Card style={{ height: "75vh" }}>
                  <Row>
                    <Col style={{ marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: "36px",
                          fontWeight: 700,
                          fontStyle: "normal",
                          lineHeight: "54px",
                        }}
                      >
                        Đối soát vé{" "}
                      </span>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 10 }}>
                    <Col span={12}>
                      <div className="input-group">
                        <input
                          placeholder="Tìm bằng số vé"
                          className="input with-icon"
                          value={searchText}
                          onChange={(e) => handleInputChange(e.target.value)}
                        />
                      </div>
                    </Col>
                    <Col style={{ textAlign: "right" }} span={12}>
                      {isDoiSoat ? (
                        <Button
                          className="btn_whiteor"
                          onClick={handleExportTocsv}
                        >
                          Xuất file
                        </Button>
                      ) : (
                        <Button className="btn_submit" onClick={handleFilter}>
                          Chốt đối soát
                        </Button>
                      )}
                    </Col>
                  </Row>
                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 4 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ height: "75vh" }}>
                  <Row>
                    <Col style={{ marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: "24px",
                          fontWeight: 700,
                          fontStyle: "normal",
                          lineHeight: "30px",
                        }}
                      >
                        Lọc vé
                      </span>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 10 }} justify={"center"}>
                    <Col>
                      <Select
                        placeholder="Hội chợ triển lãm hàng tiêu dùng 2021"
                        style={{ width: "100%" }}
                        suffixIcon={<DropdownIcon />}
                      >
                        <Option value="Hội chợ triển lãm hàng tiêu dùng 2021">
                          Hội chợ triển lãm hàng tiêu dùng 2021
                        </Option>
                      </Select>
                    </Col>
                  </Row>

                  <Row
                    style={{ marginBottom: 10, textAlign: "left" }}
                    gutter={12}
                  >
                    <Col span={12}>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          fontStyle: "normal",
                          lineHeight: "26px",
                        }}
                      >
                        Tình trạng đối soát
                      </span>
                    </Col>
                    <Col span={12} style={{ textAlign: "left" }}>
                      <Radio.Group onChange={onChange} value={value}>
                        <Space direction="vertical">
                          <Radio value="Tất cả">Tất cả</Radio>
                          <Radio value="Đã đối soát">Đã đối soát</Radio>
                          <Radio value="Chưa đối soát">Chưa đối soát</Radio>
                        </Space>
                      </Radio.Group>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 10 }}>
                    <Col span={12} style={{ textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          fontStyle: "normal",
                          lineHeight: "26px",
                        }}
                      >
                        Loại vé
                      </span>
                    </Col>
                    <Col span={12} style={{ textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 500,
                          fontStyle: "normal",
                          lineHeight: "normal",
                          opacity: "0.7",
                        }}
                      >
                        Vé cổng
                      </span>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 10 }}>
                    <Col span={12} style={{ textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          fontStyle: "normal",
                          lineHeight: "26px",
                        }}
                      >
                        Từ ngày
                      </span>
                    </Col>
                    <Col span={12} style={{ textAlign: "left" }}>
                      <DatePicker
                        format="DD/MM/YYYY"
                        value={datetungay}
                        onChange={(value) => setDatetungay(value)}
                        suffixIcon={<DateIcon />}
                        disabled
                      />{" "}
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 30 }}>
                    <Col span={12} style={{ textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          fontStyle: "normal",
                          lineHeight: "26px",
                        }}
                      >
                        Đến ngày
                      </span>
                    </Col>
                    <Col span={12} style={{ textAlign: "left" }}>
                      <DatePicker
                        format="DD/MM/YYYY"
                        value={date}
                        onChange={(value) => setDate(value)}
                        suffixIcon={<DateIcon />}
                      />{" "}
                    </Col>
                  </Row>
                  <Row justify={"center"}>
                    <Col>
                      <Button className="btn_whiteor" onClick={handleFilter}>
                        Lọc
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default DoiSoat;
