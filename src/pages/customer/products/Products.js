import { Checkbox, Col, Menu, Row } from "antd";
import React from "react";
import "./Style-products.css";
import { useState } from "react";
import { useEffect } from "react";
import CardItem from "./../component/Card";
import { ProductDetailClientApi } from "../../../api/customer/productdetail/productDetailClient.api";
import { BrandApi } from "../../../api/employee/brand/Brand.api";
import { ColorApi } from "../../../api/employee/color/Color.api";
import { MaterialApi } from "../../../api/employee/material/Material.api";
import { SoleApi } from "../../../api/employee/sole/sole.api";
import { SizeApi } from "../../../api/employee/size/Size.api";
import { CategoryApi } from "../../../api/employee/category/category.api";
const categoryGender = [
  {
    name: "TẤT CẢ",
    value: "",
  },
  {
    name: "NAM",
    value: "NAM",
  },
  {
    name: "NỮ",
    value: "NU",
  },
];

const categoryStatus = [
  {
    name: "Sản phẩm giảm giá",
    value: "giam_gia",
  },
  {
    name: "Sản phẩm mới",
    value: "moi",
  },
];
const categoryPrice = [
  {
    name: "Dưới 500 nghìn",
    minPrice: "0",
    maxPrice: "500000"
  },
  {
    name: "500 nghìn - 1 triệu",
    minPrice: "500000",
    maxPrice: "1000000"
  },
  {
    name: "1 triệu - 2 triệu",
    minPrice: "1000000",
    maxPrice: "2000000"
  },
  {
    name: "2 triệu - 3 triệu",
    minPrice: "2000000",
    maxPrice: "3000000"
  },
  {
    name: "Trên 3 triệu",
    minPrice: "3000000",
    maxPrice: "1000000000"
  },
];

function Products() {
  const [list, setList] = useState([]);
  const [listBrand, setListBrand] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listMaterial, setListMaterial] = useState([]);
  const [listSize, setListSize] = useState([]);
  const [listSole, setListSole] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [formSearch, setFormSearch] = useState({
    gender: "",
  });
  const [isChecked, setIsChecked] = useState({});
  useEffect(() => {
    BrandApi.getBrandInProductDetail().then((res) => {
      setListBrand(res.data.data);
    });
    CategoryApi.getCategoryInProductDetail().then((res) => {
      setListCategory(res.data.data);
    });
    MaterialApi.getMaterialInProductDetail().then((res) => {
      setListMaterial(res.data.data);
    });
    SizeApi.getSizeInProductDetail().then((res) => {
      setListSize(res.data.data);
    });
    SoleApi.getSoleInProductDetail().then((res) => {
      setListSole(res.data.data);
    });
    ColorApi.getColorInProductDetail().then((res) => {
      setListColor(res.data.data);
    });
    console.log(formSearch);
    ProductDetailClientApi.list(formSearch).then((res) => {
      setList(res.data.data.data);
      console.log(res.data.data.data);
    });
  }, [formSearch]);
  const changeFormSearch = (name, value) => {
    setFormSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const categorys = [
    {
      label: "Trạng thái",
      name: "status",
      children: categoryStatus,
    },
    {
      label: "Chọn mức giá",
      name: "price",
      children: categoryPrice,
    },
    {
      label: "Thương hiệu",
      name: "brand",
      children: listBrand,
    },
    {
      label: "Dòng sản phẩm",
      name: "category",
      children: listCategory,
    },
    {
      label: "Chất liệu",
      name: "material",
      children: listMaterial,
    },
    {
      label: "Kích thước",
      name: "nameSize",
      children: listSize,
    },
    {
      label: "Đế giày",
      name: "sole",
      children: listSole,
    },
    {
      label: "Màu",
      name: "color",
      children: listColor,
    },
  ];



  // const changeFomSearch = (name, value, isChecked) => {
  //   console.log(name,value,isChecked);
  //   setIsChecked((prevStates) => ({
  //     ...prevStates,
  //     [value]: isChecked,
  //   }));

  //   if (isChecked) {
  //     setFormSearch((prev) => ({
  //       ...prev,
  //       [name]: value
  //     }))
  //   } else {
  //     setFormSearch((prev) => prev.filter((item)=>item !== value))

  //   }
  // };

  const changeFomSearch = (name, value, isChecked) => {
    setIsChecked((prevStates) => ({
      ...prevStates,
      [name]: {
        ...prevStates[name],
        [value]: isChecked,
      },
    }));

    setFormSearch((prev) => {
      if (isChecked) {
        return {
          ...prev,
          [name]: prev[name] ? `${prev[name]},${value}` : value,
        };
      } else {
        const updatedValue = prev[name]
          .split(',')
          .filter((item) => item !== value)
          .join(',');
        return {
          ...prev,
          [name]: updatedValue,
        };
      }
    });
  };
  return (
    <React.Fragment>
      <Row>
        <Col
          lg={{ span: 16, offset: 4 }}
          style={{ display: "flex", marginTop: "50px" }}
        >
          <div className="category-of-products">
            {/* <Menu className="category-gender"> */}
            <ul className="category-gender">
              {categoryGender.map((item, index) => (
                <>
                  <li
                    className={`sub-gender ${formSearch["gender"] === item.value ? "clicked" : ""
                      }`}
                    onClick={() => changeFormSearch("gender", item.value)}
                  >
                    {item.name}
                  </li>
                  {index !== categoryGender.length - 1 && (
                    <p style={{ color: "rgb(183, 188, 188)" }}>|</p>
                  )}
                </>
              ))}
            </ul>

            <ul className="categorys">
              {categorys.map((item, index) => (
                <li
                  key={index}
                  className={
                    index < categorys.length - 1
                      ? "box-category"
                      : "box-category-end"
                  }
                >
                  <label
                    style={{
                      color: "#ff4400",
                      fontSize: "20px",
                      paddingBottom: 20,
                    }}
                  >
                    {item.label}
                  </label>
                  <ul>
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex} className="child-category">
                        {/* <Checkbox checked={isChecked[child.name] || false} onChange={
                         (e)=> changeFomSearch(item.name,child.name,e.target.checked)
                        } /> {child.name} */}

                        <Checkbox
                          checked={isChecked[item.name]?.[child.name] || false}
                          onChange={(e) =>
                            changeFomSearch(item.name, child.name, e.target.checked)
                          }
                        /> {child.name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="box-products">
            {list.map((item, index) => (
              <CardItem item={item} index={index} />
            ))}
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}

{/* <Checkbox
value={item.jobCode}
checked={isChecked[item.jobCode] || false}
onChange={(e) => {
  changeJobNames(item.jobCode, e.target.checked);
}}
style={{fontSize:18,fontWeight:600}}
>   {item.jobName}</Checkbox> */}
export default Products;
