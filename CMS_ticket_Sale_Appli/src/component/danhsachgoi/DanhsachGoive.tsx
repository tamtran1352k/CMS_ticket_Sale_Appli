import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  TimePicker,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useState } from "react";

import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../../firebase/fibase";
import MenuLayout from "../menu/Menu";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs"; // Import dayjs
import "dayjs/locale/vi"; // Import Vietnamese locale for dayjs
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useDispatch } from "react-redux";
import { themGoi } from "../../redecers/themgoi";

import {
  BellIcon,
  DateIcon,
  DropdownIcon,
  EmailIcon,
  ImgIcon,
  RadiusgreenIcon,
  RadiusredIcon,
  SearchIcon,
  TimeIcon,
  UpdateIcon,
} from "../icon/icon";
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

const DanhsachGoive: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [time, setTime] = useState<dayjs.Dayjs | null>(null);
  const [expiryDate, setExpiryDate] = useState<dayjs.Dayjs | null>(null);
  const [expiryTime, setExpiryTime] = useState<dayjs.Dayjs | null>(null);
  const [checked, setChecked] = useState(false);
  const [checkedcombo, setCheckedcombo] = useState(false);
  const [tengoi, setTengoi] = useState("");
  const [giave, setGiave] = useState("");
  const [giavecombo, setGiavecombo] = useState("");
  const [soluong, setSoluong] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [isModalVisiblecapnhat, setisModalVisiblecapnhat] = useState(false);
  const [magoi, setMagoi] = useState("");
  const [tinhtrang, setTinhtrang] = useState("");

  const [ngayapdung, setNgayapdung] = useState("");
  const [ngayhethan, setNgayhethan] = useState("");

  const [themgoi, setThemgoi] = useState<DataType>({
    key: "",
    stt: "",
    ma_goi: "",
    ten_goi: "",
    ngay_apdung: "",
    ngay_hethan: "",
    gia_ve: "",
    gia_combo: "",
    tinh_trang: "",
    soluong: "",
    loaive: "",
    checkin: "",
    chot: "",
    tensukien: "",
    sove: "",
    tinhtrangsudung: "",
  });
  const [themgoicapnhat, setThemgoicapnhat] = useState<DataType>({
    key: "",
    stt: "",
    ma_goi: "",
    ten_goi: "",
    ngay_apdung: "",
    ngay_hethan: "",
    gia_ve: "",
    gia_combo: "",
    tinh_trang: "",
    soluong: "",
    loaive: "",
    checkin: "",
    chot: "",
    tensukien: "",
    sove: "",
    tinhtrangsudung: "",
  });

  const dispatch = useDispatch();
  const handlecapnhattinhtrangChange = (value: string) => {
    setTinhtrang(value);
  };

  const handletinhtrangChange = (value: string) => {
    setThemgoi((prevDeviceData) => {
      return {
        ...prevDeviceData,
        tinh_trang: value,
      };
    });
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);

  const showModalcapnhat = (record: DataType) => {
    setSelectedRecord(record);
    setTengoi(record.ten_goi);
    setMagoi(record.ma_goi);
    setTinhtrang(record.tinh_trang);
    setGiave(record.gia_ve);
    setGiavecombo(record.gia_combo);
    setSoluong(record.soluong);
    setNgayapdung(record.ngay_apdung);
    setNgayhethan(record.ngay_hethan);
    setisModalVisiblecapnhat(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    // Format the date to "ngày/tháng/năm" format
    const formattedDate = date ? date.format("DD/MM/YYYY") : "";

    // Format the time to "giờ:phút:giây" format
    const formattedTime = time ? time.format("HH:mm:ss") : "";
    const formattedNgayApDung = `${formattedDate} ${formattedTime}`;
    const formattedExpiryDate = expiryDate
      ? expiryDate.format("DD/MM/YYYY")
      : "";

    // Format the expiration time to "giờ:phút:giây" format
    const formattedExpiryTime = expiryTime ? expiryTime.format("HH:mm:ss") : "";

    // Combine the expiration date and time into a single string in "ngày/tháng/năm giờ:phút:giây" format
    const formattedNgayHetHan = `${formattedExpiryDate} ${formattedExpiryTime}`;

    const numericGiaVeCombo = parseFloat(giavecombo);
    const numericSoLuong = parseFloat(soluong);

    // Check if giavecombo and soluong are valid numbers before computing gia_combo

    // Compute gia_combo based on numericGiaVeCombo and numericSoLuong only if checkedcombo is true and the inputs are valid
    const computedGiaCombo = numericGiaVeCombo * numericSoLuong;
    const giavefix = parseFloat(giave).toFixed(3);
    const GiaCombofix = computedGiaCombo.toFixed(3);

    const data: DataType = {
      key: "",
      stt: "",
      ma_goi: randomString,
      ten_goi: tengoi,
      ngay_apdung: formattedNgayApDung,
      ngay_hethan: formattedNgayHetHan,
      gia_ve: checked ? giavefix : "",
      gia_combo: checkedcombo ? GiaCombofix : "", // Include the computed value for gia_combo
      tinh_trang: themgoi.tinh_trang,
      soluong: soluong,
      loaive: "Vé cổng",
      checkin: randomcheckin,
      chot: randomchot,
      tensukien: "Hội chợ triển lãm hàng tiêu dùng 2021",
      sove: randomsove,
      tinhtrangsudung: randomTinhtrangsudung,
    };

    try {
      message.success("Thêm gói vé thành công");

      await dispatch(themGoi(data) as any);

      setIsModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi xử lý ghi nhật ký hoặc thêm dữ liệu: ", error);
    }
  };

  const handleCancelcapnhat = () => {
    setisModalVisiblecapnhat(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  function generateRandomTinhtrangsudung(): string {
    const options = ["Đã sử dụng", "Chưa sử dụng", "Hết hạn"];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  const randomTinhtrangsudung = generateRandomTinhtrangsudung();
  // console.log(randomTinhtrangsudung)

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

  const updateUserData = async (key: string, newData: Partial<DataType>) => {
    try {
      const userRef = doc(db, "Danhsachgoive", key);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Document exists, get the existing data
        const existingData = userSnap.data() as DataType;

        // Populate the input fields with the existing data
        setThemgoicapnhat(existingData);
        // Update the document with the new data
        await updateDoc(userRef, newData);

        message.success("Cập nhật thông tin thành công");
      } else {
        // Document doesn't exist, throw an error
        throw new Error("Document not found");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      message.error("Cập nhật thông tin thất bại");
    }
  };

  const handleUpdate = async () => {
    const formattedDate = date ? date.format("DD/MM/YYYY") : "";

    // Format the time to "giờ:phút:giây" format
    const formattedTime = time ? time.format("HH:mm:ss") : "";

    const formattedNgayApDung = `${formattedDate} ${formattedTime}`;
    const formattedExpiryDate = expiryDate
      ? expiryDate.format("DD/MM/YYYY")
      : "";

    // Format the expiration time to "giờ:phút:giây" format
    const formattedExpiryTime = expiryTime ? expiryTime.format("HH:mm:ss") : "";

    // Combine the expiration date and time into a single string in "ngày/tháng/năm giờ:phút:giây" format
    const formattedNgayHetHan = `${formattedExpiryDate} ${formattedExpiryTime}`;

    const numericGiaVeCombo = parseFloat(giavecombo);
    const numericSoLuong = parseFloat(soluong);

    const computedGiaCombo = numericGiaVeCombo * numericSoLuong;
    const giavefix = parseFloat(giave).toFixed(3);
    const GiaCombofix = computedGiaCombo.toFixed(3);

    const newData: Partial<DataType> = {
      key: "",
      stt: "",
      ma_goi: magoi,
      ten_goi: tengoi,
      ngay_apdung: formattedNgayApDung,
      ngay_hethan: formattedNgayHetHan,
      gia_ve: checked ? giavefix : "",
      gia_combo: checkedcombo ? GiaCombofix : "", // Include the computed value for gia_combo
      tinh_trang: tinhtrang,
      soluong: soluong,
    };

    updateUserData(selectedRecord?.key || "", newData);
    setisModalVisiblecapnhat(false);
  };

  function generateRandomcheckin(): string {
    const options = ["Cổng 1", "Cổng 2", "Cổng 3", "Cổng 4", "Cổng 5"];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  const randomcheckin = generateRandomcheckin();
  console.log(randomcheckin);

  function generateRandomchot(): string {
    const options = ["Chưa đối soát", "Đã đối soát"];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  const randomchot = generateRandomchot();

  function generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  const randomString = generateRandomString(11).toUpperCase();

  function generateRandomSove(length: number): string {
    const characters = "0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  const randomsove = generateRandomSove(12);
  // console.log(randomsove);

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Mã gói",
      dataIndex: "ma_goi",
      key: "ma_goi",
    },
    {
      title: "Tên gói",
      dataIndex: "ten_goi",
      key: "ten_goi",
    },
    {
      title: "Ngày áp dụng",
      dataIndex: "ngay_apdung",
      key: "ngay_apdung",
    },

    {
      title: "Ngày hết hạn",
      dataIndex: "ngay_hethan",
      key: "ngay_hethan",
    },
    {
      title: "Giá vé (VNĐ/Vé)",
      dataIndex: "gia_ve",
      key: "gia_ve",
      render: (text: string, record: DataType) => {
        const giave = `${text} VNĐ`;
        return record.gia_ve
          ? `${giave}`
          : "";
      },
    },
    
    {
      title: "Giá Combo (VNĐ/Combo)",
      dataIndex: "gia_combo",
      key: "gia_combo",
      render: (text: string, record: DataType) => {
        const giaComboWithVND = `${text} VNĐ`;
        return record.gia_combo
          ? `${giaComboWithVND} /${record.soluong} vé`
          : "";
      },
    },
    {
      title: "Tình trạng",
      dataIndex: "tinh_trang",
      key: "tinh_trang",
      render: (text) => {
        switch (text) {
          case "Đang áp dụng":
            return (
              <Tag color="green">
                <RadiusgreenIcon /> &nbsp;
                {text}
              </Tag>
            );
          case "Tắt":
            return (
              <Tag color="red">
                <RadiusredIcon />
                &nbsp;
                {text}
              </Tag>
            );
          default:
            return text;
        }
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button icon={<UpdateIcon/>} onClick={() => showModalcapnhat(record)}>Cập nhật</Button> */}
          <p onClick={() => showModalcapnhat(record)}>
            <UpdateIcon />
            <b style={{ bottom: 10 }}>Cập nhật</b>
          </p>
        </Space>
      ),
    },
  ];
  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };
  const handleCheckboxChangecombo = (e: CheckboxChangeEvent) => {
    setCheckedcombo(e.target.checked);
  };

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
              <Col span={12}></Col>
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
                <Col style={{ marginBottom: 10 }}>
                  <span
                    style={{
                      fontSize: "36px",
                      fontWeight: 700,
                      fontStyle: "normal",
                      lineHeight: "54px",
                    }}
                  >
                    Danh sách gói vé{" "}
                  </span>
                </Col>
              </Row>              <Row style={{ display: "flex" , justifyContent:"space-between" }}>
                <Col>
                  <div className="input-group">
                    <input
                      placeholder="Tìm bằng số vé"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="input with-icon"
                    />
                  </div>
                </Col>

                <Col span={12} style={{ textAlign: "right"}}>
                  <Button
                    className="btn_whiteor"
                    style={{ marginRight: "10px" }}
                    onClick={handleExportTocsv}
                  >
                    Xuất file (.csv)
                  </Button>
                  <Button
                    className="btn_submit"
                    style={{ marginLeft: "10px" }}
                    onClick={showModal}
                  >
                    Thêm gói vé
                  </Button>
                </Col>
              </Row>

              <Table
                style={{ marginTop: "20px" }}
                dataSource={data.filter((item) =>
                  item.ma_goi.toLowerCase().includes(searchText.toLowerCase())
                )}
                columns={columns}
                pagination={{ pageSize: 4 }}
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
      <Modal
        width={700}
        title={
          <span
            style={{
              color: "var(--text, #1E0D03)",
              fontFamily: "Montserrat",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "30px",
            }}
          >
            Thêm gói vé
          </span>
        }
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Row>
            <Col>
              <Form.Item
                label={
                  <span>
                    Tên gói vé
                    <span style={{ color: "red" }}>&ensp; *</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập tên gói vé" },
                ]}
              >
                <Input
                  style={{ width: "320px" }}
                  placeholder="Nhập tên gói vé"
                  value={selectedRecord?.ten_goi}
                  onChange={(e) => setTengoi(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày áp dụng"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày áp dụng" },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  value={date}
                  onChange={(value) => setDate(value)}
                  suffixIcon={<DateIcon />}
                />
                &ensp;
                <TimePicker
                  format="HH:mm:ss"
                  value={time}
                  onChange={(value) => setTime(value)}
                  suffixIcon={<TimeIcon />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày hết hạn"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày hết hạn" },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  value={expiryDate}
                  onChange={(value) => setExpiryDate(value)}
                  suffixIcon={<DateIcon />}
                />
                &ensp;
                <TimePicker
                  format="HH:mm:ss"
                  value={expiryTime}
                  onChange={(value) => setExpiryTime(value)}
                  suffixIcon={<TimeIcon />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Giá vé áp dụng"
            rules={[
              { required: true, message: "Vui lòng nhập giá vé áp dung" },
            ]}
          >
            <Row>
              <Col>
                <Checkbox onChange={handleCheckboxChange}>
                  <span>Vé lẻ (vnđ/vé) với giá</span>
                </Checkbox>
              </Col>
              <Col>
                {checked ? (
                  <Input
                    type="number"
                    style={{ width: "200px" }}
                    placeholder="Giá vé"
                    value={giave}
                    onChange={(e) => setGiave(e.target.value)}
                  />
                ) : (
                  <Input
                    type="number"
                    placeholder="Giá vé"
                    style={{ width: "200px" }}
                    disabled
                  />
                )}
              </Col>{" "}
              &ensp; / vé
            </Row>
          </Form.Item>
          <Form.Item
            label="Giá vé combo"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá vé combo và số lượng",
              },
            ]}
          >
            <Row>
              <Col>
                <Checkbox
                  onChange={handleCheckboxChangecombo}
                  style={{ borderColor: "blue" }}
                >
                  <span>Combo vé với giá</span>
                </Checkbox>
              </Col>

              <Col>
                {checkedcombo ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      type="number"
                      style={{ width: "200px" }}
                      placeholder="Giá vé"
                      value={giavecombo}
                      onChange={(e) => setGiavecombo(e.target.value)}
                    />
                    &ensp; /&ensp;
                    <Input
                      style={{ width: "200px" }}
                      type="number"
                      placeholder="Giá vé"
                      value={soluong}
                      onChange={(e) => setSoluong(e.target.value)}
                    />
                    &ensp; vé
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      type="number"
                      placeholder="Giá vé"
                      disabled
                      style={{ width: "200px" }}
                    />
                    &ensp; /&ensp;
                    <Input
                      style={{ width: "200px" }}
                      type="number"
                      placeholder="Giá vé"
                      disabled
                    />{" "}
                    &ensp; vé
                  </div>
                )}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="Tình trạng">
            <Select
              allowClear
              value={themgoi.tinh_trang}
              onChange={handletinhtrangChange}
              style={{ width: "150px" }}
              suffixIcon={<DropdownIcon />}
            >
              <Select.Option value="Đang áp dụng">Đang áp dụng </Select.Option>
              <Select.Option value="Tắt">Tắt</Select.Option>
            </Select>
            <p>
              <span
                style={{
                  color: "red",
                  fontSize: 16,
                }}
              >
                *&ensp;
              </span>
              là thông tin bắt buộc
            </p>
          </Form.Item>
        </Form>
        <Row justify="center">
          <Col>
            <Button
              style={{ marginRight: "10px" }}
              className="btn_whiteor"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Col>
          <Col>
            <Button
              style={{ marginLeft: "10px" }}
              className="btn_submit"
              type="primary"
              htmlType="submit"
              onClick={handleOk}
            >
              Lưu
            </Button>
          </Col>
        </Row>
      </Modal>
      <Modal
        width={700}
        title={
          <span
            style={{
              color: "var(--text, #1E0D03)",
              fontFamily: "Montserrat",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "30px",
            }}
          >
            Cập nhật gói vé
          </span>
        }
        visible={isModalVisiblecapnhat}
        footer={null}
        onCancel={handleCancelcapnhat}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Mã sự kiện
                    <span style={{ color: "red" }}>&ensp; *</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập mã sự kiện" },
                ]}
              >
                <Input
                  style={{ width: "320px" }}
                  value={magoi}
                  onChange={(e) => setMagoi(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên gói vé"
                rules={[
                  { required: true, message: "Vui lòng nhập tên gói vé" },
                ]}
              >
                <Input
                  style={{ width: "320px" }}
                  value={tengoi}
                  onChange={(e) => setTengoi(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày áp dụng"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày áp dụng" },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  value={date}
                  onChange={(value) => setDate(value)}
                  suffixIcon={<DateIcon />}
                />
                &ensp;
                <TimePicker
                  format="HH:mm:ss"
                  value={time}
                  onChange={(value) => setTime(value)}
                  suffixIcon={<TimeIcon />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày hết hạn"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày hết hạn" },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  value={expiryDate}
                  onChange={(value) => setExpiryDate(value)}
                  suffixIcon={<DateIcon />}
                />
                &ensp;
                <TimePicker
                  format="HH:mm:ss"
                  value={expiryTime}
                  onChange={(value) => setExpiryTime(value)}
                  suffixIcon={<TimeIcon />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Giá vé áp dụng"
            rules={[
              { required: true, message: "Vui lòng nhập giá vé áp dung" },
            ]}
          >
            <Row>
              <Col>
                <Checkbox onChange={handleCheckboxChange}>
                  <span>Vé lẻ (vnđ/vé) với giá</span>
                </Checkbox>
              </Col>
              <Col>
                {checked ? (
                  <Input
                    style={{ width: "200px" }}
                    value={giave}
                    onChange={(e) => setGiave(e.target.value)}
                  />
                ) : (
                  <Input
                    type="number"
                    placeholder="Giá vé"
                    style={{ width: "200px" }}
                    disabled
                  />
                )}
              </Col>{" "}
              &ensp; / vé
            </Row>
          </Form.Item>
          <Form.Item
            label="Giá vé combo"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá vé combo và số lượng",
              },
            ]}
          >
            <Row>
              <Col>
                <Checkbox
                  onChange={handleCheckboxChangecombo}
                  style={{ borderColor: "blue" }}
                >
                  <span>Combo vé với giá</span>
                </Checkbox>
              </Col>

              <Col>
                {checkedcombo ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      style={{ width: "200px" }}
                      value={giavecombo}
                      onChange={(e) => setGiavecombo(e.target.value)}
                    />
                    &ensp; /&ensp;
                    <Input
                      style={{ width: "200px" }}
                      placeholder="Giá vé"
                      value={soluong}
                      onChange={(e) => setSoluong(e.target.value)}
                    />
                    &ensp; vé
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      type="number"
                      placeholder="Giá vé"
                      disabled
                      style={{ width: "200px" }}
                    />
                    &ensp; /&ensp;
                    <Input
                      style={{ width: "200px" }}
                      type="number"
                      placeholder="Giá vé"
                      disabled
                    />{" "}
                    &ensp; vé
                  </div>
                )}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="Tình trạng">
            <Select
              value={tinhtrang}
              onChange={handlecapnhattinhtrangChange}
              style={{ width: "150px" }}
              suffixIcon={<DropdownIcon />}
            >
              <Select.Option value="Đang áp dụng">Đang áp dụng </Select.Option>

              <Select.Option value="Tắt">Tắt</Select.Option>
            </Select>
            <p>
              <span
                style={{
                  color: "red",
                  fontSize: 16,
                }}
              >
                *&ensp;
              </span>
              là thông tin bắt buộc
            </p>
          </Form.Item>
        </Form>
        <Row justify="center">
          <Col>
            <Button
              style={{ marginRight: "10px" }}
              className="btn_whiteor"
              onClick={handleCancelcapnhat}
            >
              Hủy
            </Button>
          </Col>
          <Col>
            <Button
              style={{ marginLeft: "10px" }}
              className="btn_submit"
              type="primary"
              htmlType="submit"
              onClick={handleUpdate}
            >
              Lưu
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default DanhsachGoive;
