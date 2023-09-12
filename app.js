// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

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

let contacts = JSON.parse(fs.readFileSync('./data/contacts.json', 'utf8'));
let datajson = require('./data/contacts.json');

// Render app form 
app.get('/', (req, res) => {
   res.render('index', {contacts}); 
});

app.get('/add', (req, res) => {
    res.render('add'/* , {datajson} */);
});

// Post form data to JSON 
app.post('/add', (req, res) => {
    const newContact = req.body;
    contacts.push(newContact);
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts));
    res.redirect('add');
});

/* app.get('/edit/:index', (req, res) => {
    const contactIndex = req.params.index;
    const contact = contacts.find(contact => contacts.indexOf(contact) == contactIndex);
    if(contact) res.render('edit', { contact });
    else res.status(404).json({ message: 'Contact not found' });
}); */

app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    const contact = contacts[id];
    res.render('edit', {id, contact});
});

app.post('/edit/:id', (req, res) => {
    let id = req.params.id;
    contacts[id] = req.body;
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts));
    res.redirect('/');
});

app.get('/view/:id', (req, res) => {
    let id = req.params.id;
    const contact = contacts[id];
    res.render('view', {contact});
})

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    contacts.splice(id, 1);
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts));
    res.redirect('/');
});

// Run server
app.listen(port, () => {
    console.log(`Server running at ${port}`);
});