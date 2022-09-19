import { v4 as hash } from "uuid"

let notes = []

export default (io) => {
    io.on("connection", (socket) => {
        console.log(`Nuevo usuario conectado en: ${socket.id}`)

        socket.emit("server:loadnotes", notes)

        socket.on("client:newnote", (newNote) => {
            const note = {...newNote, id: hash()}
            // En vez de subir a la DB
            notes.push(note)
            io.emit("server:newnote", note)
        })

        socket.on("client:deletenote", (id) => {
            console.log("Se esta queriendo borrar la nota " + id)
            notes = notes.filter((note) => note.id !== id)
            io.emit("server:loadnotes", notes)
        })

        socket.on("client:getnote", (id) => {
            const note = notes.find((note) => note.id === id)
            socket.emit("server:selectednote", note)
        })

        socket.on("client:updatenote", (updatedNote) => {
            notes = notes.map((note) => {
                if(note.id === updatedNote.id) {
                    note.title = updatedNote.title
                    note.description = updatedNote.description
                } 
                return note
            })

            io.emit("server:loadnotes", notes)
        })

        socket.on("disconnect", () => {
            console.log(`${socket.id} se ha desconectado`)
        })
    })
}