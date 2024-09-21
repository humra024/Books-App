require("dotenv").config();
const cors=require("cors")
const express=require("express")
const connectDB=require("./connectDB")
const Book=require('./models/Books')
const multer = require("multer");

const app=express()
const PORT=process.env.PORT || 8000

//middleware
connectDB()
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use("/uploads", express.static("uploads")) //to make uploads a static folder

//routes
app.get("/", (req,res)=>{
    res.json("Hello mate!")
})

//get all books or book by category
app.get("/api/books", async (req,res)=>{
    try{
        const category=req.query.category

        const filter={}
        if(category){ //if category is not null
            filter.category=category
        }
        const data=await Book.find(filter) //.find({}) to get all books
        res.json(data)
    }catch(error){
       res.status(500).json({error: "An error occurred"}) 
    }
})

// get a book by slug(id)
app.get("/api/books/:slug", async (req,res)=>{
    try{
        const slugParam=req.params.slug
        const data=await Book.findOne({slug: slugParam}) //.find({}) to get all books
        res.json(data)
    }catch(error){
       res.status(500).json({error: "An error occurred"}) 
    }
})

// add a book
// app.post("/api/add", async (req,res)=>{
//     try{
//         console.log(req.body)

//         const newBook=new Book({
//             title: req.body.title,
//             slug: req.body.slug,
//             stars: req.body.stars,
//             description: req.body.description,
//             category: req.body.category
//             //thumbnail: req:file:thumbnail
//         })
       
//         await Book.create(newBook)
//         res.json("Data Submitted")
//     }catch(error){
//        res.status(500).json({error: "An error occurred"}) 
//     }
// })

//multer for thumbnail

// add A Book
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + "-" + file.originalname);
    }
  })
const upload = multer({ storage: storage })

app.post("/api/add", upload.single("thumbnail")  ,async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const newBook = new Book({
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
      thumbnail: req.file.filename,
    })

    await Book.create(newBook);
    res.json("Data Submitted");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
});

// Update A Book
app.put("/api/books", upload.single("thumbnail"), async (req, res) => {
    try {
  
      const bookId = req.body.bookId;
  
      const updateBook = {
        title: req.body.title,
        slug: req.body.slug,
        stars: req.body.stars,
        description: req.body.description,
        category: req.body.category,
      }
  
      if (req.file) {
        updateBook.thumbnail = req.file.filename;
      }
  
      await Book.findByIdAndUpdate(bookId, updateBook)
      res.json("Data Submitted");
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching books." });
    }
  });


app.delete("/api/books/:id", async(req,res) => {
  const bookId = req.params.id;

  try {
    await Book.deleteOne({_id: bookId});
    res.json("How dare you!" + req.body.bookId);
  } catch (error) {
    res.json(error);
  }
});



//server 
app.listen(PORT, ()=>{
    console.log(`Server is running on Port: ${PORT}`)
})