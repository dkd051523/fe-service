import { Col, Row } from "antd";
import "./style-footer.css";
import logoFooter from "./../../../assets/images/logo_admin.png"
import { Link } from "react-router-dom";
import { FacebookOutlined, GoogleOutlined, InstagramOutlined, LinkedinOutlined, TwitterOutlined, YoutubeOutlined } from "@ant-design/icons";

function Footer() {
  return (
    <>
      <div className="footer">
        <Row>
          <Col className="header-footer" lg={{ span: 16, offset: 4 }}>
            <Link><img style={{width:120}} src={logoFooter} alt="..."/></Link>
          </Col>
        </Row>
        <Row>
          <Col className="content-footer" lg={{ span: 16, offset: 4 }}>
            <div className="category-footer">
              <div style={{display:"flex"}}>
              <Link className="title-content-footer">TRANG CHỦ</Link>
              <Link className="title-content-footer">SẢN PHẨM</Link>
              <Link className="title-content-footer">VỀ CHÚNG TÔI</Link>
              <Link className="title-content-footer">BLOG</Link>
              <Link className="title-content-footer">LIÊN HỆ CHÚNG TÔI</Link>
              </div>
              <div style={{marginLeft:"auto"}}>
              <Link className="icon-content-footer"><FacebookOutlined /></Link>
              <Link className="icon-content-footer"><TwitterOutlined /></Link>
              <Link className="icon-content-footer"><YoutubeOutlined /></Link>
              <Link className="icon-content-footer"><InstagramOutlined /></Link>
              <Link className="icon-content-footer"><LinkedinOutlined /></Link>
              <Link className="icon-content-footer"><GoogleOutlined /></Link>

              
              </div>
            </div>
            <div className="category-footer1">
              <div>
              © 2023 <Link style={{color:"#ff4400"}}>BEESNEAKER</Link>. ALL RIGHTS RESERVED | PH (+09) 71833489
              </div>
              <div style={{marginLeft:"auto"}}>
             <img src="" alt="..."/>
              </div>
            </div>
           
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Footer;
