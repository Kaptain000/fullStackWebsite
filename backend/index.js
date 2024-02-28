// define port
const port = 4000;
// import dependencies
// 在 Node.js 应用中引入 Express 框架, Express 用于构建 Web 应用程序和 API
const express = require('express');
// create app instances, 通过 express() 创建了一个应用对象，并将其赋值给了 app 变量
const app = express();

// initialize the mongoose package
// Mongoose 模块用于在 MongoDB 中进行对象建模和数据操作。
const mongoose = require("mongoose");
// jsonwebtoken 用于生成和验证 JSON Web Tokens (JWT) 的库
const jwt = require("jsonwebtoken");
// multer 用于处理文件上传
const multer = require("multer");
// path用于处理文件路径和目录路径
const path = require("path");
// cors 用于处理跨域资源共享 (CORS), provide access to react project, connect fontend to backend
const cors = require("cors");
const { log } = require('console');

// app.use(express.json())：这行代码告诉 Express 使用内置的中间件 express.json()。这个中间件用于解析传入的请求的 
    // JSON 数据，并将解析后的数据附加到 req.body 对象中，使得在后续的路由处理程序中可以方便地访问请求体中的 JSON 数据
app.use(express.json())
// cors() 是一个 Express 框架的第三方中间件，用于处理跨域资源共享 (CORS)。当你调用 app.use(cors()) 时，它会告诉 Express应用
    // 在处理每个传入的请求时都使用 cors() 中间件来处理跨域请求。使用此reactjs project 将会连接到在port 4000 链接 express APP
    // 如果你的电子商务网站是一个单页应用程序，且 API 服务器与 Web 应用程序不在同一域中，那么你需要允许跨源请求
app.use(cors());

// initialize mongo atlas database
// Database connection with MongoDB
// "mongodb+srv://kaptain:13892155872GKvb@cluster0.0mbglui.mongodb.net/e-commerce" 此处的e-commerce是储存我们application数据的path
mongoose.connect("mongodb+srv://kaptain:13892155872GK@cluster0.0mbglui.mongodb.net/e-commerce")

// API Creation 
// app.get("/", (req, res) => {...})：这行代码告诉 Express 应用当收到针对根路径("/")的 GET 请求时（比如去我们的'/'路径），执行后面的回调函数。
// 客户端发送的 GET 请求是一种用于获取指定资源的 HTTP 请求
app.get("/",(req, res)=>{
    res.send("Express App is Running")
})

// 图像储存引擎

// =============================== this function ==================================
// multer.diskStorage() 用于定义文件上传的存储方式
const storage = multer.diskStorage({
    // 指定了上传文件的存储目标目录,上传的文件将被保存到项目根目录下的 upload/images 目录中
    destination: './upload/images',
    // req 是当前上传文件的请求对象，file 表示上传的文件对象，cb 是一个用于指示文件名生成的回调函数
    // filename 函数是 Multer 中的一个独立的回调函数，它的参数是事先约定好的，其中 file 参数就是用来接收上传的文件对象的
    filename: (req, file, cb)=>{
        // cb 参数是一个回调函数，用于指示文件名的生成完成。它接受两个参数：第一个参数是错误对象，第二个参数是生成的文件名。
        //      null 作为第一个参数传递给 cb 表示在生成文件名过程中没有发生错误
        //      在 Multer 中，file.fieldname 表示上传文件的字段名
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

// multer() 创建了一个 Multer 实例 upload，并指定了文件的存储方式为 storage，即通过上面定义的 diskStorage 对象来处理文
    // 件的存储
const upload = multer({storage:storage})

// Creating Upload Endpoint for images
// 创建Endpoint '/images' 来储存图片，即当访问 '/images' 路径时，Express 将从 upload/images 目录中提供静态文件
//      这意味着如果你的 Express 服务器正在运行，并且有一个文件位于 upload/images 目录下，例如 image.jpg，你可以通过访问
//      http://yourdomain.com/images/image.jpg 来获取这个图片文件。
app.use('/images', express.static('upload/images'))

// POST 请求是一种 HTTP 请求方法，用于向服务器提交数据
// app.post 方法允许你定义一个路由，当收到客户端发来的 POST 请求时，Express 将会调用相应的处理函数。
// 在 Express 应用中设置一个用于处理上传文件的路由(route)， upload.single('product') 指示 Multer 
//      中间件处理上传的单个文件，并将其存储在服务器上。其中 'product' 是文件字段的名称，这意味着客户端
//      在提交表单时必须将文件放置在名为 'product' 的字段中。field name设置为product
// =============================== this function ==================================
app.post("/upload", upload.single('product'), (req,res)=>{
    res.json({
        success:1,
        // JavaScript 中 ${port} 是一个表达式，用于获取变量 port 的值，并将其插入到字符串中
        // req.file 表示客户端上传的文件对象，由 Multer 中间件解析并添加到请求对象中
        // req.file.filename 表示上传文件在服务器上保存的文件名。这个文件名是由 Multer 根据存储配置生成的，它将被用来构建图片的 URL 地址。
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products
// mongoose.model() 方法来定义模型， 第一个参数是模型的名称，第二个参数是一个包含模型字段定义的对象， 包括字段名、类型、验证规则等
// 此处model的名字"Product"就是mongoDB里的文件名,mongoDB会将其转换为小写并加复数
const Product = mongoose.model("Products", {
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    avilable:{
        type: Boolean,
        default: true,
    },
})

// 使用async()，因为在 Node.js 中，许多操作都是异步的，比如访问数据库、发送网络请求等
app.post('/addproduct', async (req, res)=>{
    // Product.find({}) 查询数据库中的所有产品，如果你想要检索某个数据库集合中的所有文档（或记录），你可以通过传入一个空的查询条件对象 {} 来实现。
    let products = await Product.find({});
    let id;
    if (products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id = 1;
    }
    // 创建一个新的 Product 实例，使用客户端发送的数据初始化该实例，并保存到数据库中
    // 如果客户端同时上传了文件和其他表单字段（例如产品名称），那么这些表单字段会被存储在 req.body 中
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    // 将图片储存到mongoDB
    await product.save();
    console.log("Saved")
    // 在 Express 路由处理程序中发送一个 JSON 响应给客户端
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating API For deleting product
app.post('/removeproduct', async (req, res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed")
    res.json({
        success: true,
        name: req.body.name
    })
})

// Creating API For getting all products
app.get('/allproducts', async (req, res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})


// Schema create for user model
const Users = mongoose.model('Users', {
    name:{
        type:String,
    },
    email:{
        type:String,
        // unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating Endpoint for registering the user
app.post('/signup', async (req,res)=>{
    
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"existing user found with same email address"});
    }
    // 这里cart结构的设计没有考虑product的size，只考虑了product的数量，后续得修改
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true, token})
})

// creating endpoint for user login
app.post('/login', async (req, res) =>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true, token});
        }
        else{
            res.json({success:false, errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false, errors:"Wrong Email Id"});
    }
})

// creat endpoint for newcollection data
app.get('/newcollections', async (req, res)=>{
    let products_men = await Product.find({category:"men"});
    let products_women = await Product.find({category:"women"});
    let products_kid = await Product.find({category:"kid"});
    // 获取最新添加到数据库中的8个数据
    // let newcollection = products.slice(1).slice(-8);
    let newcollection_men = products_men.slice(1).slice(-3)
    let newcollection_women = products_women.slice(1).slice(-3)
    let newcollection_kid = products_kid.slice(1).slice(-2)
    // 在JavaScript中，... 是展开运算符（Spread Operator）的语法。展开运算符可以用于展开（或扩展）可迭代对象（如数组、
        // 字符串、对象字面量等），将它们的元素或属性插入到另一个数组或对象字面量中。
    let newCollection = [...newcollection_men, ...newcollection_women, ...newcollection_kid];
    console.log("NewCollection Fetched");
    res.send(newCollection);
})

// creat endpoint for popular in women
app.get('/popularinwomen', async (req, res)=>{
    let products_women = await Product.find({category:"women"});
    // 获取数据库中的women的4个数据
    // let newcollection = products.slice(9,4);
    let popular_in_women = products_women.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

// creating middleware to fetch user
    const fetchUser = async (req,res,next)=>{
        // 与frontend里的ShopContext.jsx中的fetch('http://localhost:4000/addtocart' 相对应，auth-token储存在headers中
            // 在 Express.js 中，可以通过 req.header() 方法来访问请求头中的特定字段的值
        const token = req.header('auth-token');
        if (!token) {
            res.status(401).send({errors:"Please authenticate using valid token"})
        }else{
            try {
                // 解码token
                const data = jwt.verify(token, 'secret_ecom');
                req.user = data.user;
                next();
            } catch (error) {
                res.status(401).send({errors:"Please authenticate using a valid token"})
            }
        }
    }

// creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req,res)=>{
    console.log(req.body, req.user);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    // 更新相应user的cart
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added")
})

// creating endpoint for removing products in cartdata
app.post('/removefromcart', fetchUser, async (req,res)=>{
    console.log(req.body, req.user);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] -= 1;
    // 更新相应user的cart
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("removed")
})

// creating endpoint for deleting products in cartdata
app.post('/deletefromcart', fetchUser, async (req,res)=>{
    console.log(req.body, req.user);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] = 0;
    // 更新相应user的cart
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("deleted")
})
// 可能是因为/getcart也给服务器返回了auth-token，所以用了app.post
// 从MongoDB中读取cart信息，并显示在fontend的cart界面
app.post('/getcart', fetchUser, async (req, res)=>{
    console.log('GetCart')
    let userData = await Users.findOne({_id:req.user.id});
    // 购物车里的数据好像是formData,将他们转换回json数据
    res.json(userData.cartData);
})

//app.listen() 方法用于监听指定的端口，并在服务器启动后执行回调函数。
//app.listen(port, (error)=>{}) error 参数被定义为回调函数的第一个参数
app.listen(port, (error)=>{
    if (!error) {
        console.log("Server Running on Port "+port)
    }
    else{
        console.log("error : "+error)
    }
})
