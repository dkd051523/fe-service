import {
  Button,
  Col,
  Modal,
  Result,
  Row,
  Table,
} from "antd";
import TimeLine from "./TimeLine";
import {
  addStatusPresent,
  getBill,
  getBillHistory,
  getPaymentsMethod,
  getProductInBillDetail,
} from "../../../app/reducer/Bill.reducer";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useParams } from "react-router";
import "./detail.css";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { BillClientApi } from "../../../api/customer/bill/billClient.api";
import { Link } from "react-router-dom";

var listStatus = [
  { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON" },
  { id: 2, name: "Chờ xác nhận", status: "CHO_XAC_NHAN" },
  { id: 3, name: "Xác nhận", status: "XAC_NHAN" },
  { id: 4, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN" },
  { id: 5, name: "Vận chuyển", status: "VAN_CHUYEN" },
  { id: 6, name: "Thanh toán", status: "DA_THANH_TOAN" },
  { id: 7, name: "Thành công", status: "THANH_CONG" },
];

function DetailBillClinet() {
  const { code } = useParams("code");
  const { phoneNumber } = useParams("phoneNumber");
  const detailProductInBill = useSelector(
    (state) => state.bill.bill.billDetail
  );
  const billHistory = useSelector((state) => state.bill.bill.billHistory);
  const paymentsMethod = useSelector((state) => state.bill.bill.paymentsMethod);
  const bill = useSelector((state) => state.bill.bill.value);
  const statusPresent = useSelector((state) => state.bill.bill.status);
  const dispatch = useDispatch();
  const [checkBillExit, setCheckBillExit] = useState(true)

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };


  useEffect(() => {
    console.log(code);
    console.log(phoneNumber)
    BillClientApi.fetchDetailBill(code,phoneNumber).then((res) => {
      dispatch(getBill(res.data.data));
      var index = listStatus.findIndex(
        (item) => item.status == res.data.data.statusBill
      );
      if (res.data.data.statusBill == "TRA_HANG") {
        index = 7;
      }
      if (res.data.data.statusBill == "DA_HUY") {
        index = 8;
      }
      dispatch(addStatusPresent(index));
      BillClientApi.fetchAllBillHistoryInBill(res.data.data.id).then((res) => {
        dispatch(getBillHistory(res.data.data));
        console.log(res.data.data);
      });
      BillClientApi.fetchAllPayMentlInBill(res.data.data.id).then((res) => {
        dispatch(getPaymentsMethod(res.data.data));
      });
      BillClientApi.fetchAllBillDetailInBill(res.data.data.id).then((res) => {
        dispatch(getProductInBillDetail(res.data.data));
      });
    }).catch((e) =>{
      setCheckBillExit(false)
    })

  }, []);

 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columnsHistory = [
    {
      title: <div className="title-product">STT</div>,
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: <div className="title-product">Trạng thái</div>,
      dataIndex: "statusBill",
      key: "statusBill",
      render: (statusBill) => (
        <span>
          {statusBill === "TAO_HOA_DON"
            ? "Hóa đơn chờ"
            : statusBill === "CHO_XAC_NHAN"
            ? " Chờ xác nhận"
            : statusBill === "XAC_NHAN"
            ? " Xác nhận"
            : statusBill === "CHO_VAN_CHUYEN"
            ? "Chờ vận chuyển"
            : statusBill === "VAN_CHUYEN"
            ? "Đang vận chuyển"
            : statusBill === "DA_THANH_TOAN"
            ? "Đã thanh toán"
            : statusBill === "TRA_HANG"
            ? "Trả hàng"
            : statusBill === "THANH_CONG"
            ? "Thành công"
            : "Đã hủy"}
        </span>
      ),
    },
    {
      title: <div className="title-product">Ngày</div>,
      dataIndex: "createDate",
      key: "createDate",
      render: (text) => {
        const formattedDate = moment(text).format(" HH:mm:ss DD-MM-YYYY"); // Định dạng ngày
        return formattedDate;
      },
    },
    {
      title: <div className="title-product">Người xác nhận</div>,
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: <div className="title-product">Ghi chú</div>,
      dataIndex: "actionDesc",
      key: "actionDesc",
    },
  ];

  const columnsPayments = [
     {
      title:<div className="title-product">STT</div>,
      key:"index",
      render: ((value, item, index) =>   index + 1)
  },
    {
      title: <div className="title-product">Mã giao dịch</div>,
      dataIndex: "vnp_TransactionNo",
      key: "vnp_TransactionNo",
      render: (vnp_TransactionNo) => <span>{vnp_TransactionNo}</span>,
    },
    {
      title: <div className="title-product">Số tiền</div>,
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (totalMoney) => <span>{formatCurrency(totalMoney)}</span>,
    },
    {
      title: <div className="title-product">Trạng thái</div>,
      dataIndex: "method",
      key: "method",
      render: (method) => (
        <span>
          {method == "TIEN_MAT"
            ? "Tiền mặt"
            : method == "CHUYEN_KHOAN"
              ? "Chuyển khoản"
              : "Tiền mặt và chuyển khoản"}
        </span>
      ),
    },
    {
      title: <div className="title-product">Thời gian</div>,
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => {
        const formattedDate = moment(text).format("DD-MM-YYYY"); // Định dạng ngày
        return formattedDate;
      },
    },
    {
      title: <div className="title-product">Loại giao dịch</div>,
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Button
          style={{ width: "130px", pointerEvents: "none" }}
          className={status}
        >
          {status == "THANH_TOAN"
            ? "Thanh toán"
            : status == "TRA_SAU"
            ? "Trả sau"
            : "Hoàn tiền"}
        </Button>
      ),
    },
    {
      title: <div className="title-product">Phương thức thanh toán</div>,
      dataIndex: "method",
      key: "method",
      render: (method) => (
        <Button
          style={{ width: "130px", pointerEvents: "none" }}
          className={method}
        >
          {method == "TIEN_MAT"
            ? "Tiền mặt"
            : method == "CHUYEN_KHOAN"
            ? "Chuyển khoản"
            : "Thẻ"}
        </Button>
      ),
    },
    {
      title: <div className="title-product">Ghi chú</div>,
      dataIndex: "description",
      key: "description",
    },
    {
      title: <div className="title-product">Người xác nhận</div>,
      dataIndex: "employees",
      key: "employees",
      render: (employees) => {
        return employees?.user.fullName;
      },
    },
  ];

  const getPromotionStyle = (promotion) => {
    return promotion >= 50 ? { color: "white" } : { color: "#000000" };
  };
  const getPromotionColor = (promotion) => {
    return promotion >= 50 ? { color: "#FF0000" } : { color: "#FFCC00" };
  };

  return (
    <div>
      {checkBillExit ? (
         <>
        <Row style={{ width: "100%" }}>
        <div
          className="row"
          style={{
            backgroundColor: "white",
            width: "100%",
            marginBottom: "30px",
          }}
        >
          <Row style={{ backgroundColor: "white", width: "100%" }}>
            <TimeLine
              style={{ with: "100%" }}
              listStatus={listStatus}
              data={billHistory}
              statusPresent={statusPresent}
            />
          </Row>
          <Row
            style={{ width: "100%", marginBottom: "20px" }}
            justify={"space-around"}
          >
            <Row style={{ width: "100%" }}>
              <Col span={12}>
              </Col>
              <Col span={12} align={"end"}>
                <Button
                  type="primary"
                  onClick={showModal}
                  style={{
                    fontSize: "medium",
                    fontWeight: "500",
                    marginRight: "20px",
                    // backgroundColor: ",
                  }}
                >
                  Lịch sử
                </Button>
              </Col>
            </Row>
            <div className="offset-6 col-2">
              <Modal
                title="Lịch sử"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                className="widthModal"
                width={800}
                cancelText={"huỷ"}
               okText={"Xác nhận"}
              >
                <Table
                  dataSource={billHistory}
                  columns={columnsHistory}
                  rowKey="id"
                  pagination={false} // Disable default pagination
                  className="product-table"
                />
              </Modal>
            </div>
          </Row>
        </div>
      </Row>

      <Row
        style={{
          width: "100%",
          marginBottom: "20px",
          backgroundColor: "white",
        }}
      >
        <Row
          style={{
            width: "100%",
            borderBottom: "2px solid #ccc",
            padding: "12px",
            margin: "0px 20px",
          }}
        >
          <Col span={20}>
            <h2
              className="text-center"
              style={{
                width: "100%",
                fontSize: "x-large",
                fontWeight: "500",
                // margin: "10px 20px 20px 20px",
              }}
            >
              Lịch sử thanh toán
            </h2>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <Table
            dataSource={paymentsMethod}
            columns={columnsPayments}
            rowKey="id"
            pagination={false} // Disable default pagination
            className="product-table"
          />
        </Row>
      </Row>
      <Row style={{ width: "100%" }}>
        <div style={{ backgroundColor: "white", width: "100%" }}>
          <Row
            style={{
              width: "96%",
              margin: "10px 20px 20px 20px",
              borderBottom: "2px solid #ccc",
              padding: "12px",
            }}
          >
            <Col span={22}>
              <h2
                className="text-center"
                style={{
                  fontSize: "x-large",
                  fontWeight: "500",
                }}
              >
                Thông tin đơn hàng
              </h2>
            </Col>
            <Col span={2}>
            </Col>
          </Row>
          <Row style={{ width: "100%" }}>
            <Col span={12} className="text">
              <Row style={{ marginLeft: "20px" }}>
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Trạng thái :
                </Col>
                <Col span={16}>
                  <Button
                    className={`trangThai ${" status_" + bill.statusBill} `}
                  >
                    {bill.statusBill == "TAO_HOA_DON"
                      ? "Tạo Hóa đơn"
                      : bill.statusBill == "CHO_XAC_NHAN"
                      ? "Chờ xác nhận"
                      : bill.statusBill === "VAN_CHUYEN"
                      ? "Đang vận chuyển"
                      : bill.statusBill === "DA_THANH_TOAN"
                      ? "Đã thanh toán"
                      : bill.statusBill === "THANH_CONG"
                      ? "Thành công"
                      : bill.statusBill === "TRA_HANG"
                      ? "Trả hàng"
                      : "Đã hủy"}
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={12} className="text">
              <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Tên khách hàng:
                </Col>
                <Col span={16}>
                  {bill.userName == "" ? (
                    <span
                      style={{
                        backgroundColor: " #ccc",
                        color: "white",
                        width: "180px",
                        borderRadius: "15px",
                        padding: " 5px 19px",
                        marginLeft: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      Khách lẻ
                    </span>
                  ) : (
                    <span style={{ color: "black" }}>{bill.userName}</span>
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={12} className="text">
              <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Loại:
                </Col>
                <Col span={16}>
                  <Button
                    style={{
                      backgroundColor: "#6633FF",
                      color: "white",
                      width: "180px",
                      borderRadius: "15px",
                      padding: " 5px 38px",
                      pointerEvents: "none",
                    }}
                  >
                    {bill.typeBill}
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={12} className="text">
              <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
                  {" "}
                  Số điện thoại:
                </Col>
                <Col span={16}>
                  <span style={{ color: "black" }}>{bill.phoneNumber}</span>
                </Col>
              </Row>
            </Col>

            {/* <Col span={12} className="text">
              <div style={{ marginLeft: "20px" }}>Gmail: {bill.account != null ? bill.account.email : bill.account.customer }</div>
            </Col> */}
            <Col span={12} className="text">
              <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Địa chỉ:
                </Col>
                <Col span={16}>
                  <span style={{ color: "black" }}>{bill.address}</span>
                </Col>
              </Row>
            </Col>
            <Col span={12} className="text">
              <Row
                style={{
                  marginLeft: "20px",
                  marginTop: "8px",
                  marginBottom: "20px",
                }}
              >
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Ghi chú:
                </Col>
                <Col span={16}>
                  <span>{bill.note}</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Row>
      <Row
        style={{ width: "100%", backgroundColor: "white", marginTop: "20px" }}
      >
      
        <Row
          style={{
            width: "100%",
            marginTop: "20px",
            borderBottom: "1px solid #ccc",
            padding: "12px",
          }}
        >
          {detailProductInBill.map((item, index) => {
            return (
              <Row style={{ marginTop: "10px", width: "100%" }}>
                <Col span={1} style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "21px",
                    fontFamily: "500",
                    margin: "auto",
                  }}>
                  {index + 1}
                </Col>
                <Col span={3}>
                <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={item.image}
            alt="Ảnh sản phẩm"
            style={{ width: "100px", borderRadius: "10%", height: "100px" }}
          />
          {item.promotion !== null && (
            <div
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                padding: "0px",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            >
              <FontAwesomeIcon
                icon={faBookmark}
                style={{
                  ...getPromotionColor(item.promotion),
                  fontSize: "3.5em",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "calc(50% - 10px)", // Đặt "50%" lên trên biểu tượng (từ 50% trừ 10px)
                  left: "50%", // Để "50%" nằm chính giữa biểu tượng
                  transform: "translate(-50%, -50%)", // Dịch chuyển "50%" đến vị trí chính giữa
                  fontSize: "0.8em",
                  fontWeight: "bold",
                  ...getPromotionStyle(item.promotion),
                }}
              >
                {`${item.promotion}%`}
              </span>
              <span
                style={{
                  position: "absolute",
                  top: "60%", 
                  left: "50%", // Để "Giảm" nằm chính giữa biểu tượng
                  transform: "translate(-50%, -50%)", // Dịch chuyển "Giảm" đến vị trí chính giữa
                  fontSize: "0.8em",
                  fontWeight: "bold",
                  ...getPromotionStyle(item.promotion),
                }}
              >
                Giảm
              </span>
            </div>
          )}
        </div>
                </Col>
                <Col span={15}>
                  <Row>
                    {" "}
                    <span
                      style={{
                        fontSize: "19",
                        fontWeight: "500",
                        marginTop: "10px",
                      }}
                    >
                      {item.productName}
                    </span>{" "}
                  </Row>
                  <Row>
                    {
                      item.promotion != null ? (<span style={{fontSize: '12px',marginTop: "4px"}}>
                      <del>
                      {formatCurrency(item.price /(1-item.promotion/100))}
                      </del>
                  </span>): <span></span>
                    }
                    <span
                      style={{
                        color: "red",
                        fontWeight: "500",
                        marginLeft: "5px",
                      }}
                    >
                      {item.price >= 1000
                        ? formatCurrency(item.price)
                        : item.price + " VND"}
                    </span>{" "}
                  </Row>
                  <Row>
                    <span style={{ fontSize: "12", marginTop: "10px" }}>
                      Size: {item.nameSize}
                    </span>{" "}
                  </Row>
                  <Row>
                    <span style={{ fontSize: "12" }}>x {item.quantity}</span>{" "}
                  </Row>
                </Col>
                <Col span={3} style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      marginBottom: "30px",
                    }}
                  >
                    {item.price * item.quantity >= 1000
                      ? (item.price * item.quantity).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                      : item.price * item.quantity + " đ"}
                  </span>{" "}
                </Col>
              </Row>
            );
          })}
        </Row>
        <Row style={{ width: "100%", marginTop: "20px" }} justify={"end"}>
          <Col span={10}>
            <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
              <Col span={7}></Col>
              <Col span={6} style={{ fontWeight: "bold", fontSize: "16px" }}>
                Tiền hàng :
              </Col>
              <Col span={10} align={"end"}>
                <span style={{ fontSize: "16px" }}>
                  {formatCurrency(bill.totalMoney)}
                </span>
              </Col>
            </Row>
            {bill.moneyShip == undefined || bill.moneyShip == "" ? (
              <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                <Col span={7}></Col>
                <Col span={6} style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Phí vận chuyển :
                </Col>
                <Col span={10} align={"end"}>
                  <span style={{ fontSize: "16px" }}>
                    {formatCurrency(bill.moneyShip)}
                  </span>
                </Col>
              </Row>
            ) : (
              <Row></Row>
            )}

            <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
              <Col span={7}></Col>
              <Col span={6} style={{ fontWeight: "bold", fontSize: "16px" }}>
                Tiền giảm :{" "}
              </Col>
              <Col span={10} align={"end"}>
                <span style={{ fontSize: "16px" }}>
                  {formatCurrency(bill.itemDiscount)}
                </span>
              </Col>
            </Row>
            <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
              <Col span={7}></Col>
              <Col
                span={6}
                style={{
                  marginBottom: "40px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Tổng tiền:{" "}
              </Col>
              <Col span={10} align={"end"}>
                <span
                  style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
                >
                  {formatCurrency(
                    detailProductInBill.reduce((accumulator, currentValue) => {
                      return (
                        accumulator + currentValue.price * currentValue.quantity
                      );
                    }, 0) +
                      bill.moneyShip -
                      bill.itemDiscount
                  )}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
      </>
      ) :( <Result 
      status="404"
      title="404"
      subTitle="Xin lỗi, hóa đơn không tồn tại."
      extra={
        <Button type="primary">
          <Link to="/">Về trang chủ</Link>
        </Button>
      }
    />)}
     
    </div>
  );
}

export default DetailBillClinet;
