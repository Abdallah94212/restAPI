const express = require('express');
const mysql = require('mysql');
const app = express();
const expressport = 3000;
 
app.use(express.json());
 
const dataBase = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'root',
    database: 'base1',
});


const dataBase2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'root',
    database: 'base2',
});


dataBase.connect((err) => {
    if (err) {
        console.log('Error connecting to DB1:', err);
    } else {
        console.log('base 1 connected');
    }
});
 
dataBase2.connect((err) => {
    if (err) {
        console.log('Error connecting to DB2:', err);
    } else {
        console.log('base 2 connected');
    }
});
 
app.listen(expressport, () => {
    console.log('Server running on port:', expressport);
});
 
app.get('/items', (req, res) => {
    const sql = 'SELECT * FROM items;';
 
    dataBase.query(sql, (err1, results1) => {
        if (err1) {
            return res.status(500).json({ error: 'Error retrieving items from DB1' });
        }
 

        dataBase2.query(sql, (err2, results2) => {
            if (err2) {
                return res.status(500).json({ error: 'Error retrieving items from DB2' });
            }
 
            return res.status(200).json({
                base1: results1,
                base2: results2,
            });
        });
    });
});
 

app.post('/createitems', (req, res) => {
    const { id, name, price, id_category, description } = req.body;
    const sql = 'INSERT INTO items (id, name, price, id_category, description) VALUES (?, ?, ?, ?, ?)';
 

    dataBase.query(sql, [id, name, price, id_category, description], (err1) => {
        if (err1) {
            console.log('Error inserting into DB1:', err1);
            return res.status(500).json({ error: 'Error inserting into DB1' });
        }

            return res.status(200).json({ message: 'Item created in both databases' });
        });
    });
 
 
    app.put('/createupdate/:id', (req, res) => {
        const id = req.params.id;
        const { name, price, id_category, description } = req.body;
        const sql = 'UPDATE products SET name = ?, price = ?, id_category = ?, description = ? WHERE id = ?';
        const values = [name, price, id_category, description, id];
       
        dataBase.query(sql, values, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'ERREUR DU SERVEUR NULL' });
          } else {
            return res.status(200).json(result);
          }
        });
      });
       

    app.delete('/delete/:id', (req, res) => {
        const id = req.params.id;
        
        if (!id) {
            return res.status(400).json({ error: 'ID manquant dans la requête.' });
        }
        
        const sql = 'DELETE FROM items WHERE id = ?';
    
        dataBase.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la suppression dans la base de données.' });
            }
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Article non trouvé.' });
            }
    
            return res.status(200).json({ message: `L'article avec l'ID ${id} a été supprimé avec succès.` });
        });
    });
