import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

    const [image,setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    })

    const imageHandler = (e) =>{
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) =>{
        // 每个input或者select都有name,这里的name指的是他们的name
        // ... 来创建一个新的对象，同时将原始的 productDetails 对象中的属性复制到新对象中。然后，使用计算属性名 [e.target.name]，
            // 其中 e.target.name 是触发事件的元素的 name 属性值，来更新新对象中相应属性的值为 e.target.value，即当前输入框的值。
        setProductDetails({...productDetails, [e.target.name]:e.target.value})
    }

    const Add_Product = async () =>{
        console.log(productDetails)
        let responseData;
        // 赋值product信息
        let product = productDetails;
        // 创建了一个新的 FormData 对象，用于构建表单数据
        let formData = new FormData();
        // filed 为product, 在backend中使用了upload.single('product')，这意味着客户端
        //      在提交表单时必须将文件放置在名为 'product' 的字段中
        // 使用了 fetch() 函数发送了一个 POST 请求到服务器的 'http://localhost:4000/upload' 路径
        // upload 只需将imageurl提供给server，上传到MongoDB才需要其他额外信息
        formData.append('product', image);
        await fetch('http://localhost:4000/upload', {
            method:'POST',
            // Accept: 'application/json' 告诉服务器，客户端期望接收的响应数据格式为 JSON 格式。
            headers:{
                Accept: 'application/json'
            },
            body:formData
        // .then() 方法被用于处理 fetch() 函数返回的 Promise 对象。在 fetch() 函数执行成功后，它返回一个代表了 HTTP 响应的 Response 对象。这个 Response 对象也是一个 Promise，
        // 它提供了一系列的方法来处理响应的数据。第一个 .then() 方法用于将 HTTP 响应解析为 JSON 格式的数据。resp.json() 方法返回一个 Promise，该 Promise 在 JSON 解析完成后解析
        // 为 JavaScript 对象。第二个 .then() 方法接收解析后的 JavaScript 对象作为参数，并将其赋值给 responseData 变量。这样，responseData 变量就包含了解析后的数据，可以在后续
        // 的代码中使用。
        // 这里返回的数据应该是backend中定义的：
            // res.json({
            //     success:1,
            //     image_url:`http://localhost:${port}/images/${req.file.filename}`
            // })
        }).then((resp) => resp.json()).then((data)=>responseData=data)
        // 如果respnseData.success是TRUE，name我们的图片就成功存在了multer image storage
        if(responseData.success){
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers:{
                    Accept: 'application/json',
                    // 在使用 fetch 发送 POST 请求时，如果请求体是 JSON 格式的数据，需要在请求头中设置 Content-Type 字段为 application/json
                    'Content-Type':'application/json'
                },
                // 上下文中，product 是一个包含了产品信息的 JavaScript 对象。在发送 POST 请求时，通常需要将对象转换为Json字符串形式，以便将其作为请求体发送给服务器。
                //      这就是使用 JSON.stringify() 的目的。
                body:JSON.stringify(product)
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product Added"):alert("Failed")
            })
        }
    }

  return (
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p>Product title</p>
            {/* <input value={productDetails.name} 指的是当前输入框的value是productDetails.name 的value */}
            <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector' >
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            {/* <label htmlFor="file-input">: 这是一个 label 元素，它关联了一个表单元素（file input），当用户点击 label 区域时，会触发关联的表单元素的点击事件 */}
            <label htmlFor="file-input">
                {/* 判断image是否选中，是的话就呈现该image，若否则呈现 upload_area image */}
                <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
            </label>
            {/* id 属性为 "file-input"，与 label 元素中的 htmlFor 属性对应，用于关联 label 和 input 元素。hidden 属性将文件输入框隐藏，但仍然可以通过点击 label 来触发它。 */}
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
        </div>
        <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct
