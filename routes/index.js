let express = require('express');
let router = express.Router();
const multer = require('../middlewares/multer');
const connection = require('../config/db');

/* GET users listing. */

router.get('/addPlato', function(req, res) {
  res.render("addPlato");
});




//localhost:4000/

router.get('/', (req, res) => {
  let sql = `SELECT * FROM platos WHERE  is_deleted = 0`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('index', { result });
  });
});


//localhost:4000/addPlato
router.post('/addPlato', multer ("platos") ,(req, res)=>{
  console.log("esto es req.body", req.body);
  console.log("esto es req.file", req.file);
  const {name, description, img, category} = req.body;
  let sql = `INSERT INTO platos (name, description, category) VALUES ("${name}", "${description}", "${category}")`
  if(req.file !=undefined){
    const img = req.file.filename
    sql = `INSERT INTO platos (name, description, category, img) VALUES ("${name}", "${description}", "${category}", "${img}")`
  }
  connection.query(sql, (err, result)=>{
    if(err) throw err;
    res.redirect("/");
  })
})

 //abrir el formulario de edición de platos
  //localhost:4000/editPlato
  router.get('/editPlato/:id', (req, res)=>{
    // Obtener el valor de id desde req.params
    let id = req.params.id;
    let sql = `SELECT * FROM platos WHERE id = ${id} AND is_deleted = 0`;
    connection.query(sql, (err, result)=>{
        if(err) throw err;
        console.log("*****result****", result);
        res.render("editPlato", { result: result[0] });
    });
});


  //http://localhost:4000/editPlato/id

  router.get("/onePlato/:id", (req, res)=>{
    let {id} = req.params
    let sql = `select * from platos where id = ${id} and is_deleted = 0`
  
    connection.query(sql, (err, result)=>{
      console.log(result);
      if(err) throw err
      res.render("onePlato", {plato: result[0]})
    })
    
  })

  router.post('/editPlato/:id',multer("platos"), (req, res)=>{
    const id = req.params.id
    const {name, description, category }= req.body;
    let sql = `UPDATE platos SET name="${name}", description="${description}" , category="${category}"  where id = ${id}`
    
    if(req.file != undefined){
      let img = req.file.filename
      sql = `UPDATE platos SET name="${name}", description="${description}" , category="${category}", img="${img}" where id = ${id}`
    }

    connection.query(sql, (err, result)=>{
      if(err) throw err;
      res.redirect(`/onePlato/${id}`)
    })


  })


  //eliminarplatodefinitivo

router.get("/deleted/:id", (req,res)=>{
  const id = req.params.id;
  console.log(id);
  let sql = `DELETE FROM platos where id = ${id} `
  connection.query(sql, (err, result) =>{
    if(err) throw err;
    res.redirect("/");
  })
  
})

 //eliminarlogico

 router.get("/deletedlogic/:id", (req,res)=>{
  const id = req.params.id;
  console.log(id);
  let sql = `UPDATE platos SET is_deleted = 1 where id = ${id} `
  connection.query(sql, (err, result) =>{
    if(err) throw err;
    res.redirect("/");
  })
})




module.exports = router;