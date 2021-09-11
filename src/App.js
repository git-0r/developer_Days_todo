import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react'

function App() {

  const [allNotes, setAllNotes] = useState([])
  const [modal, setModal] = useState(false)
  const [editNote, setEditNote] = useState({})

  useEffect(() => {
    axios.get('/notes')
      .then(res => setAllNotes(res.data))
  }, [])

  const createNote = (e) => {
    e.preventDefault()

    const content = (e.target[0].value).trim()

    if (content === "") {
      window.alert("content is missing !")
    } else {
      axios.post('/notes', { content: content })
        .then(res => setAllNotes(allNotes.concat(res.data)))
      e.target[0].value = ""
    }
  }

  const remove = (note) => {
    axios.delete(`/notes/${note.id}`)

    const notes = allNotes.filter(n => n.id !== note.id)
    setAllNotes(notes)
  }

  const ShowNotes = ({ allNotes }) => {
    return (
      allNotes.map(note => {
        return (
          <div className="note-container" key={note.id}>
            <pre><li>{note.content}</li></pre>
            <div className="note-actions">
              <button className="todo-icon" onClick={() => remove(note)}>
                <ion-icon name="trash-outline"></ion-icon>
              </button>
              <button className="todo-icon" onClick={() => {
                setModal(true);
                setEditNote(note)
              }}>
                <ion-icon name="create-outline"></ion-icon>
              </button>
            </div>
          </div>
        )
      })
    )
  }

  const updateNote = (e) => {
    e.preventDefault()

    const content = e.target[0].value
    const id = editNote.id
    axios.put(`/notes/${id}`, { "content": content })

    const updatedNotes = allNotes.map(note => {
      if (note.id === id) {
        return { "id": id, "content": content }
      } else {
        return note
      }
    })

    setAllNotes(updatedNotes)
    setModal(false)
  }

  const Modal = () => {
    if (modal) {
      return (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModal(false)}>&times;</span>
            <h2>Edit</h2>
            <form onSubmit={e => updateNote(e)}>
              <textarea placeholder="feed the cat..." defaultValue={editNote.content}></textarea>
              <button className="btn-updateNote"><ion-icon name="add-outline"></ion-icon></button>
            </form>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  window.onclick = (e) => {
    if (e.target.className === "modal") {
      setModal(false)
    }
  }

  return (
    <div className="App">
      <h1>TO-DO</h1>
      <Modal />
      <form onSubmit={e => createNote(e)}>
        <textarea placeholder="feed the cat..."></textarea>
        <button className="btn-addNote"><ion-icon name="add-outline"></ion-icon></button>
      </form>
      <ul>
        <ShowNotes allNotes={allNotes} />
      </ul>
      <p className="footer">Made with ❤️ by Rohit <a href="https://github.com/git-0r" target="_blank" rel="noreferrer"><ion-icon name="logo-github"></ion-icon></a></p>
    </div>
  );
}

export default App;
