import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./style-header.css";
import { toast } from "react-toastify";
import { Modal, Form, Input, Checkbox, Button, Menu } from "antd";
import {
  FileSearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { AccountApi } from "./../../../api/employee/account/account.api";
function SalesHeader() {
  const [form] = Form.useForm();
  const [modalLogin, setModalLogin] = useState(false);
  const [listAccount, setListAccount] = useState({});
  const [formLogin, setFormLogin] = useState({});
  const idUser = localStorage.getItem("idAccount");
  const [openInfor, setOpenInfo] = useState(false);

  useEffect(() => {
    console.log(idUser);
  }, []);
  // useEffect(() => {
  //   setIdUser(localStorage.getItem("idAccount"))
  // }, []);
  useEffect(() => {
    console.log(formLogin);
  }, [formLogin]);
  useEffect(() => {
    console.log(listAccount);
  }, [listAccount]);
  useEffect(() => {}, [openInfor]);
  useEffect(() => {
    getAllAccount();
  }, []);
  const openModalLogin = () => {
    setModalLogin(true);
  };
  const closeModalLogin = () => {
    setModalLogin(false);
    setFormLogin({});
  };
  const handleMenuHover = () => {
    setOpenInfo(true);
  };

  const handleMenuLeave = () => {
    setOpenInfo(false);
  };
  const getAllAccount = () => {
    AccountApi.getAllAccount().then(
      (res) => {
        setListAccount(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const handleInputLogin = (name, value) => {
    setFormLogin({ ...formLogin, [name]: value });
  };
  const login = () => {
    console.log(listAccount);
    console.log(formLogin);
    const matchedAccount = listAccount.find(
      (item) =>
        item.email === formLogin.email && item.password === formLogin.password
    );

    if (matchedAccount) {
      toast.success("Login thành công?", {
        autoClose: 1000,
      });
      debugger
      setModalLogin(false);
      // setIdUser(matchedAccount.id);
      localStorage.setItem("idAccount", matchedAccount.id);
      window.location.href = "/home"
    } else {
      toast.error("Login thất bại?", {
        autoClose: 1000,
      });
    }
  };
  const logout = () => {
    // setIdUser("");
    setFormLogin({});
    localStorage.removeItem("idAccount");
    window.location.href = "/home"
  };

  const fieldsLogin = [
    {
      name: "email",
      label: "Email",
    },
    {
      name: "password",
      label: "Mật khẩu",
    },
  ];
  const fields = [
    {
      classIcon: "header-icon",
      icon: <FileSearchOutlined />,
      className: "title-header",
      title: "Tra cứu đơn hàng",
      to:"/sreach-bill"
    },
    {
      classIcon: "header-icon",
      icon: <EnvironmentOutlined />,
      className: "title-header",
      title: "Tìm kiếm cửa hàng",
      to:"#"
    },
    {
      classIcon: "header-icon",
      icon: <UserOutlined />,
      className: "title-header",
      to:"/login",

      title: idUser === null ? "Đăng nhập" : "Thông tin",
      form:
        idUser === null
          ? openModalLogin
          : [
              { title: "Thông tin", act: "", className: "title-option-info" },
              {
                title: "Đăng xuất",
                act: logout,
                className: "title-option-info",
              },
            ],
    },
  ];
  return (
    <div className="header">
      {fields.map((field, index) => {
        return (
          <div key={index} className="content-header">
              <Link to={field.to} className={field.className}>
                <span className={field.classIcon}>{field.icon}</span>
                {field.title}
              </Link>
            
          </div>
        );
      })}

      <Modal
        onCancel={closeModalLogin}
        open={modalLogin}
        //    closeIcon={null}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Form form={form} className="modal-login" layout="vertical">
          {fieldsLogin.map((field, index) => {
            return (
              <div key={index}>
                <Form.Item
                  label={field.label}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  {field.name === "email" && (
                    <Input
                      name={field.name}
                      value={formLogin[field.name]}
                      onChange={(event) => {
                        handleInputLogin(field.name, event.target.value);
                      }}
                    />
                  )}
                  {field.name === "password" && (
                    <Input.Password
                      name={field.name}
                      value={formLogin[field.name]}
                      onChange={(event) => {
                        handleInputLogin(field.name, event.target.value);
                      }}
                    />
                  )}
                </Form.Item>
              </div>
            );
          })}

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" onClick={login}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SalesHeader;
