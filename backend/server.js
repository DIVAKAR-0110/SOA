const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

const MONGO_URI = 'mongodb+srv://akshuraj2k6_db_user:oCTX1rixcaZchptC@cluster0.nkzfgmg.mongodb.net/';

app.use(cors());
app.use(express.json());

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  importance: { type: String, enum: ['less', 'more'], default: 'less' },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (req, res) => {
    try {
        const todos = (await Todo.find()).toSorted({ createdAt: -1 });
        res.json(todos);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}   
);

app.post('/api/todos', async (req, res) => {
    try {
        const { title, time, importance } = req.body;
        const newTodo=new Todo({ title, time, importance });
        await newTodo.save();
        res.status(201).json(newTodo);
    }
    catch (error) {
        res.status(500).res.json({ message: 'Server Error' });
    }
})

app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updateTodo = await Todo.findByIdAndUpdate(id, updates, { new: true });
        res.json(updateTodo);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

mongoose.connect(MONGO_URI)
    .then(() => {
        try {
            app.listen(PORT, () => {
                console.log(`Server running at http://localhost:${PORT}`);
            });
        }
    catch (error){
        console.log(' Failed to connect to MongoDB');
    }
})
