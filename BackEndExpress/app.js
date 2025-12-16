const express = require("express")
const cors = require("cors")
const app = express() 

app.use(cors())
app.use(express.json())

// Almacenamiento en memoria (me daba un poco de pereza hacer una bd para esto y como no se especificaba que hubiera que hacerlo con una bd)
let nombres = []
let currentId = 1

// 1.- Obtener todos los nombres
app.get('/api/nombres', (req, res) => {
    res.json(nombres)
})

// 2.- Obtener un nombre por ID
app.get('/api/nombres/:id', (req, res) => {
    const id = parseInt(req.params.id)
    
    // Buscar el nombre con el id proporcionado
    const nombreEncontrado = nombres.find(nombre => nombre.id === id)
    
    if (nombreEncontrado) {
        res.json(nombreEncontrado)
    } else {
        res.status(404).json({ error: 'Nombre no encontrado' })
    }
})

// 3.- Crear un nuevo nombre
app.post('/api/nombres', (req, res) => {
    const { nombre } = req.body
    
    // Validación básica
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es requerido' })
    }
    
    const nuevoNombre = {
        id: currentId++,
        nombre: nombre.trim()
    }
    
    nombres.push(nuevoNombre)
    res.status(201).json(nuevoNombre)
})

// 4.- Actualizar un nombre existente
app.put('/api/nombres/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const { nombre } = req.body
    
    // Validaciones
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es requerido' })
    }
    
    // Buscar el índice del nombre a actualizar
    const indice = nombres.findIndex(nombre => nombre.id === id)
    
    if (indice !== -1) {
        // Actualizar el nombre
        nombres[indice].nombre = nombre.trim()
        res.json(nombres[indice])
    } else {
        res.status(404).json({ error: 'Nombre no encontrado' })
    }
})

// 5.- Eliminar un nombre
app.delete('/api/nombres/:id', (req, res) => {
    const id = parseInt(req.params.id)
    
    // Buscar el índice del nombre a eliminar
    const indice = nombres.findIndex(nombre => nombre.id === id)
    
    if (indice !== -1) {
        // Eliminar el elemento del array
        const nombreEliminado = nombres.splice(indice, 1)
        res.json(nombreEliminado[0])
    } else {
        res.status(404).json({ error: 'Nombre no encontrado' })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})