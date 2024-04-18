import "./style-login.css";
import logoLogin from "./../../../assets/images/logo_client.png";
import { Form, Input } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { GooglePlusOutlined ,FacebookFilled} from "@ant-design/icons";
import  Footer  from "./../../../component/customer/footer/Footer"
function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSowPassword = () => {
    if (showPassword === false) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  };
  return (
    <div className="login-account">
      <div className="header-login">
        <Link style={{marginLeft:"20%"}} to="/home">
        <img className="logo-login" src={logoLogin} alt="..." />
        </Link>
      </div>
      <div className="box-content-login">
        <div className="content-login">
          <div className="box-form-login">
            <div className="form-login">
              <h1 style={{ marginBottom: 30 }}>Đăng nhập</h1>

              <Form.Item>
                <Input className="input-username" placeholder=" " />
                <lable for="username" className="title-username">
                  Tên đăng nhập
                </lable>
              </Form.Item>
              <Form.Item>
                <Input
                  type={showPassword === false ? "password" : "text"}
                  className="input-password"
                  placeholder=" "
                />
                <lable for="password" className="title-password">
                  Mật khẩu
                </lable>
                <FontAwesomeIcon
                  className="icon-show-password"
                  icon={showPassword === false ? faEyeSlash : faEye}
                  onClick={handleSowPassword}
                />
              </Form.Item>

              <div className="box-submit-login">Đăng nhập</div>
              <div className="box-forgot-pass">
                <Link className="forgot-pass" to="#">
                  Quên mật khẩu
                </Link>
              </div>
            </div>
            <div className="or">Hoặc</div>
            <div className="form-login-with-social">
              <div className="login-facebook">
              <FacebookFilled  style={{fontSize:30,marginRight:10}}/>  Facebook
              </div>

              <div className="login-google">
              <GooglePlusOutlined  style={{fontSize:30,marginRight:10}}/> Google
              </div>
              <div style={{color:"grey"}}>
                Bạn mới biết đến BeeSneaker? <Link className="register" to="#">Đăng ký</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Login;
