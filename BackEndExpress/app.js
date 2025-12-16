
// Express gestiona todo el servidor
const express = require("express")

// CORS permite identificar de qué dominio vienen las peticiones y puede restringirlas
const cors = require("cors")

// Creamos la app
const app = express() 

// No ponemos restricciones al cors
app.use(cors())

// Configuramos el traductor: convierte JSON a algo que entendemos
app.use(express.json())

// Nuestra bbdd, ahora mismo un array vacío
let nombres = []

//aqui asignamos id a los nombres, en principio suma 1 al siguiente, asignado una id única
let currentId = 1


// Ve toda la bbdd
app.get('/api/nombres', (req, res) => {
    res.json(nombres)
})

//busca elementos por id específico
app.get('/api/nombres/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const nombreEncontrado = nombres.find(nombre => nombre.id === id)
    if (nombreEncontrado) {
        res.json(nombreEncontrado)
    } else {
        res.status(404).json({ error: 'Nombre no encontrado' })
    }
})

// Guarda nuevos elementos
app.post('/api/nombres', (req, res) => {
    const { nombre } = req.body
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

// Actualizamos uno que ya exista
app.put('/api/nombres/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const { nombre } = req.body
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es requerido' })
    }
    const indice = nombres.findIndex(nombre => nombre.id === id)
    if (indice !== -1) {
        nombres[indice].nombre = nombre.trim()
        res.json(nombres[indice])
    } else {
        res.status(404).json({ error: 'Nombre no encontrado' })
    }
})

// Borramos un elemento
app.delete('/api/nombres/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = nombres.findIndex(nombre => nombre.id === id)
    if (indice !== -1) {
        const nombreEliminado = nombres.splice(indice, 1)
        res.json(nombreEliminado[0])
    } else {
        res.status(404).json({ error: 'Nombre no encontrado' })
    }
})


// Usamos el puerto 3001 localmente
const PORT = process.env.PORT || 3001

// Encendemos el servidor
app.listen(PORT, () => {
    // Este mensaje aparece en nuestra terminal
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})