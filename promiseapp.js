// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { accessSync } = require('fs');
const fs = require('fs').promises;

// Create express app & set port
const port = 3000;
const app = express();

app.use(express.json());

// Set view engine 
app.set('view engine', 'ejs');
app.set('views', './views');

// Render static data (CSS, images)
app.use(express.static("./public"));
app.use(express.static("./views"));

// Configure body-parser to get form data
app.use(bodyParser.urlencoded({extended: false}));

async function readContactsFile(){
    const data = await fs.readFile('./data/contacts.json', 'utf8');
    return JSON.parse(data);
};

async function writeContactsFile(contacts){
    await fs.writeFile('./data/contacts.json', JSON.stringify(contacts));
};

/* let contacts = JSON.parse(fs.readFileSync('./data/contacts.json', 'utf8'));
let datajson = require('./data/contacts.json'); */

// Render app form 
app.get('/', async (req, res) => {
   try{
    const contacts = await readContactsFile();
    res.render('index', {contacts});
   } catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
   };
});

app.get('/add', async (req, res) => {
    try{
        res.render('add');
    } catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
});

// Post form data to JSON 
app.post('/add', async (req, res) => {
    try{
        const newContact = req.body;
        const contacts = await readContactsFile();
        contacts.push(newContact);
        await writeContactsFile(contacts);
        res.redirect('/');
    } catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
});

app.get('/edit/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const contacts = await readContactsFile();
        const contact = contacts[id];
        res.render('edit', {id, contact});
    } catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
});

app.post('/edit/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const updatedContact = req.body;
        const contacts = await readContactsFile();
        contacts[id] = updatedContact;
        await writeContactsFile(contacts);
        res.redirect('/');
    } catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
});

app.get('/view/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const contacts = await readContactsFile();
        const contact = contacts[id];
        res.render('view', {contact});
    } catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
});

app.get('/delete/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const contacts = await readContactsFile();
        contacts.splice(id, 1);
        await writeContactsFile(contacts);
        res.redirect('/');
    } catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
});

// Run server
app.listen(port, () => {
    console.log(`Server running at ${port}`);
});