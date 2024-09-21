import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Home from "./routes/Home/Home"
import About from "./routes/About/About"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import Book from "./routes/Book/Book"
import Single from "./routes/Book/Single"
import CreateBook from "./routes/Book/CreateBook"
import EditBook from "./routes/Book/editBook"




function App() {
  return (
    <>
      <Router>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Book/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/books" element={<Book/>}/>
          <Route path="/books/:slug" element={<Single/>}/> 
          <Route path="/createBook/" element={<CreateBook/>}/> 
          <Route path="/editbook/:slug" element={ <EditBook/> } />
        </Routes>
      <Footer/>
      </Router>
    </>
  )
}

export default App
