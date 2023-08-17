import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Layout,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Tag,
  TimePicker,
  Tooltip,
  message,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import MenuLayout from "../menu/Menu";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase/fibase";
import {
  BellIcon,
  DateIcon,
  EmailIcon,
  FitterIcon,
  ImgIcon,
  RadiusblueIcon,
  RadiusgreenIcon,
  RadiusredIcon,
  SearchIcon,
  SetIcon,
  TimeIcon,
} from "../icon/icon";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
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
  tinhtrangsudung: string;
}

const DanhsachVe: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleloc, setModalVisibleloc] = useState(false);
  const [originalData, setOriginalData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string | null>(null);

  const [selectedCheckinValues, setSelectedCheckinValues] = useState<string[]>(
    []
  );

  const [selectedUserData, setSelectedUserData] = useState<DataType | null>(
    null
  );

  const [updatedUserData, setUpdatedUserData] = useState<DataType | null>(null);
  const [value, setValue] = useState("Tất cả");
  const [selectedCheckboxValue, setSelectedCheckboxValue] = useState<
    string | null
  >("Tất cả");
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [time, setTime] = useState<dayjs.Dayjs | null>(null);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);

  const onChangecheck = (e: CheckboxChangeEvent) => {
    setSelectedCheckboxValue(e.target.checked ? e.target.value : null);
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Booking code",
      dataIndex: "ma_goi",
      key: "ma_goi",
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
      render: (text) => text.substring(0, 10),
    },
    {
      title: "Ngày xuất vé",
      dataIndex: "ngay_apdung",
      key: "ngay_apdung",
      render: (text) => text.substring(0, 10),
    },

    {
      title: "Tình trạng sử dụng",
      dataIndex: "tinhtrangsudung",
      key: "tinhtrangsudung",
      render: (text) => {
        switch (text) {
          case "Đã sử dụng":
            return (
              <Tag color="green">
                {" "}
                <RadiusgreenIcon /> &nbsp;{text}
              </Tag>
            );
          case "Chưa sử dụng":
            return (
              <Tag color="blue">
                <RadiusblueIcon />
                &nbsp;{text}
              </Tag>
            );
          case "Hết hạn":
            return (
              <Tag color="red">
                <RadiusredIcon /> &nbsp;{text}
              </Tag>
            );
          default:
            return text;
        }
      },
    },
    {
      title: "Cổng check - in",
      dataIndex: "checkin",
      key: "checkin",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleIconClick(record)}>
            <SetIcon />
          </a>
        </Space>
      ),
    },
  ];
  const handleIconClick = (record: DataType) => {
    setSelectedUserData(record);
    setUpdatedUserData({ ...record });
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (selectedUserData && updatedUserData) {
      try {
        await updateDoc(doc(db, "Danhsachgoive", selectedUserData.key), {
          stt: updatedUserData.stt,
          ma_goi: updatedUserData.ma_goi,
          tensukien: updatedUserData.tensukien,
          ngay_hethan:
            date?.format("DD/MM/YYYY") +
              " " +
              updatedUserData.ngay_hethan.substring(11) || null,
        });
        message.success("Cập nhật thành công");
        setData((prevData) =>
          prevData.map((item) =>
            item.key === selectedUserData.key ? updatedUserData : item
          )
        );
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
    setModalVisible(false);
  };

  const handleFilter = () => {
    const selectedDateFormatted: string | null = date
      ? dayjs(date).format("DD/MM/YYYY")
      : null;

    if (
      (filterValue === null || filterValue === "Tất cả") &&
      (selectedCheckinValues.length === 0 ||
        selectedCheckinValues.includes("Tất cả")) &&
      !selectedDateFormatted
    ) {
      setData(originalData);
    } else {
      const filteredData = originalData.filter((item) => {
        const filterByTinhTrang =
          filterValue === null || item.tinhtrangsudung === filterValue;
        const filterByCheckin =
          selectedCheckinValues.length === 0 ||
          selectedCheckinValues.includes("Tất cả") ||
          selectedCheckinValues.includes(item.checkin);

        const filterByDate =
          !selectedDateFormatted ||
          item.ngay_apdung.substring(0, 10) === selectedDateFormatted;

        return filterByTinhTrang && filterByCheckin && filterByDate;
      });

      setData(filteredData);
    }

    setModalVisibleloc(false);
  };

  const handleExportTocsv = async () => {
    const dataWithoutKey = data.map(({ key, ...rest }) => rest);

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
    saveAs(dataBlob, "Danh_sach_goi_ve.csv");
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

        setData(newData);
        setOriginalData(newData); // Store the original data for filtering
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);

  useEffect(() => {
    setData(data); // This line ensures that the data in the table updates when the original data changes
    setModalVisibleloc(true);
    handleFilter();

    return () => {};
  }, [originalData]);

  return (
    <div>
      <Layout>
        <Sider>
          <MenuLayout />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: "#F9F6F4" }}>
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
            <Card style={{ marginTop: 10 }}>
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
                    Danh sách vé{" "}
                  </span>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20, display: "flex" }}>
                <Col span={12} style={{ textAlign: "left" }}>
                  <div className="input-group">
                    <input
                      placeholder="Tìm bằng số vé"
                      className="input with-icon"
                      value={searchText}
                      onChange={(e) => handleInputChange(e.target.value)}
                    />
                  </div>
                </Col>
                <Col
                  style={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  span={12}
                >
                  <Button
                    icon={<FitterIcon />}
                    onClick={() => setModalVisibleloc(true)}
                    className="btn_whiteor"
                    style={{
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "26px",
                      marginRight: 10,
                      display: "flex",
                    }}
                  >
                    {" "}
                    <span style={{ marginBottom: "10px", marginLeft: "5px" }}>
                      Lọc vé
                    </span>
                  </Button>{" "}
                  <Button
                    className="btn_whiteor"
                    style={{
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "26px",
                      marginLeft: 10,
                    }}
                    onClick={handleExportTocsv}
                  >
                    Xuất file (.csv){" "}
                  </Button>{" "}
                </Col>
              </Row>
              <Table
                dataSource={searchText ? filteredData : data}
                columns={columns}
                pagination={{ pageSize: 4 }}
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
      <Modal
        title={
          <span
            style={{
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "30px",
            }}
          >
            Lọc vé
          </span>
        }
        visible={modalVisibleloc}
        onCancel={() => setModalVisibleloc(false)}
        footer={null}
      >
        <Row justify={"start"} gutter={20}>
          <Col>
            <Form layout="vertical">
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "26px",
                      fontStyle: "normal",
                    }}
                  >
                    Từ ngày{" "}
                  </span>
                }
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  value={date}
                  onChange={(value) => setDate(value)}
                  suffixIcon={<DateIcon />}
                />{" "}
              </Form.Item>
            </Form>
          </Col>
          <Col>
            <Form layout="vertical">
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "26px",
                      fontStyle: "normal",
                    }}
                  >
                    Đến ngày
                  </span>
                }
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  // value={date}
                  // onChange={(value) => setDate(value)}
                  suffixIcon={<DateIcon />}
                />{" "}
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form layout="vertical">
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "26px",
                      fontStyle: "normal",
                    }}
                  >
                    Tình trạng sử dụng
                  </span>
                }
              >
                <Radio.Group onChange={(e) => setFilterValue(e.target.value)}>
                  <Radio value="Tất cả">Tất cả</Radio>
                  <Radio value="Đã sử dụng">Đã sử dụng</Radio>
                  <Radio value="Chưa sử dụng">Chưa sử dụng</Radio>
                  <Radio value="Hết hạn">Hết hạn</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Form layout="vertical">
            <Form.Item
              label={
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "26px",
                    fontStyle: "normal",
                  }}
                >
                  Cổng Check - in{" "}
                </span>
              }
            >
              <Checkbox.Group
                onChange={(values) =>
                  setSelectedCheckinValues(values.map((value) => String(value)))
                }
                value={selectedCheckinValues}
              >
                <Row justify="center">
                  <Col span={24}>
                    <Row>
                      <Col span={8}>
                        <Checkbox value="Tất cả">Tất cả</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Cổng 1">Cổng 1</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Cổng 2">Cổng 2</Checkbox>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24} style={{ marginTop: 10 }}>
                    <Row>
                      <Col span={8}>
                        <Checkbox value="Cổng 3">Cổng 3</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Cổng 4">Cổng 4</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Cổng 5">Cổng 5</Checkbox>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Row>
        <Row justify={"center"}>
          <Col>
            <Button className="btn_whiteor" onClick={handleFilter}>
              Lọc
            </Button>
          </Col>
        </Row>
      </Modal>
      <Modal
        title={
          <span
            style={{
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "30px",
            }}
          >
            Đổi ngày sử dụng vé{" "}
          </span>
        }
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        onOk={handleUpdate}
      >
        {updatedUserData && (
          <div>
            <Row style={{ marginTop: 10 }}>
              <Col span={10}>
                <span
                  style={{
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "26px",
                  }}
                >
                  Số vé
                </span>
              </Col>
              <Col span={14}>{updatedUserData.sove}</Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={10}>
                <span
                  style={{
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "26px",
                  }}
                >
                  Số vé
                </span>
              </Col>
              <Col span={14}>
                {`${updatedUserData.loaive} - ${updatedUserData.ten_goi}`}
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={10}>
                <span
                  style={{
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "26px",
                  }}
                >
                  Tên sự kiện
                </span>
              </Col>
              <Col span={14}>{updatedUserData.tensukien}</Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={10}>
                <span
                  style={{
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "26px",
                  }}
                >
                  Hạn sự dụng{" "}
                </span>
              </Col>
              <Col span={14}>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={date}
                  onChange={(value) => setDate(value)}
                  suffixIcon={<DateIcon />}
                />{" "}
              </Col>
            </Row>
            <Row justify={"center"} gutter={20} style={{ marginTop: 20 }}>
              <Col span={12} style={{ textAlign: "right" }}>
                {" "}
                <Button
                  className="btn_whiteor"
                  onClick={() => setModalVisible(false)}
                >
                  Hủy
                </Button>{" "}
              </Col>
              <Col span={12}>
                {" "}
                <Button className="btn_submit" onClick={handleUpdate}>
                  Lưu
                </Button>{" "}
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default DanhsachVe;
