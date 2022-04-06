import { useEffect, useState } from 'react'
import axios from 'axios'
import personsService from './personsService'

const Notification = ({message, newName}) => { 
  if (!message) {
    return null
  } else if (message.includes('Error')) {
    return <div className='error'>{message}</div>
  }
  else if (message.includes('validation')) {  //There has to be a better way to go around this red/green listing
    return <div className='error'>{message}</div>
  } else if (message.includes(newName)) {
    return <div className='personChange'>{message}</div>
  }
  return <div className='error'>{message}</div>

}

const Numbers = ({persons, filterName, deleteNumber}) => {

  const filteredData = persons.filter((person) => {
    if (filterName === '') {
      return person
    } else {
      return person.name.toLowerCase().includes(filterName.toLowerCase())
    }
  })
  return <div>
    {filteredData.map(person =>
    <p key={person.id}>{person.name} {person.number}<button onClick={() => deleteNumber(person.id)}>delete</button></p> //not sure if the key should be person.name, but it is forced to be unique. Changed it to person.id after implementing db.json
    )}
  </div>
}

const PersonForm = ({newName, newNumber, addPerson, handleNameChange, handleNumberChange}) => {
return (
  <form>
  <div>
    name: <input value={newName}
          onChange={handleNameChange}/>
  </div>
  <div>
    number: <input value={newNumber}
            onChange={handleNumberChange}/>
  </div>
  <div>
    <button type="submit" onClick={addPerson} >add</button>
  </div>
</form>
)}

const SearchFilter = ({handleFilter}) => {
  return (
    <form>
    <div>
      filter shown with<input onChange={handleFilter}/>
    </div>
  </form>
  )}

const App = () => {
  const [persons, setPersons] = useState([
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState('')


  useEffect(() => {
    personsService.getAll().then(response => {
      console.log('api data fetched')
      setPersons(response.data)
    })

  }, [])

  const addPerson = (event) => { //Not so sure about this const... It might go to the <PersonForm/>, but the task mentioned to keep all event handlers in App() place
    event.preventDefault()
    if (persons.filter(person => person.name === newName).length) {
      const updatablePerson = persons.filter(person => person.name ===newName)
      const result = window.confirm(`${newName} is already added to phonebook, do you want to change the number?`)

      if (result) {
        const personObj = {...updatablePerson[0], number : newNumber }
        personsService.update(updatablePerson[0].id, personObj).then(returnedPerson => {
          returnedPerson = personObj 
          setPersons(persons.map(person => person.id !== updatablePerson[0].id ? person : returnedPerson))
          setMessage(`persons '${newName}' number has been changed to: '${newNumber}'`)
          setTimeout(() => {setMessage('')}, 2000)
          setNewName('')
          setNewNumber('')
        }).catch(error => { //this could be updated further by removing removing the person on the updateing clients side, but I bet we will go round that later, so I won't go into that
          //setMessage(`ERROR: '${updatablePerson[0].name}' was already removed from the server`)
          setMessage(error.response.data.error)
          setTimeout(() => {setMessage('')}, 2000)
          setNewName('')
          setNewNumber('')
        })

      } else {
        setNewName('')
        setNewNumber('')
      }
    } else {
    const personObject = {name: newName, number: newNumber}
    personsService.create(personObject).then(response => {
      setPersons(persons.concat(response.data))
      console.log('person added: ', newName)
      setMessage(`person '${newName}' has been added to the list`)
      setTimeout(() => {setMessage('')}, 2000)
      setNewName('')
      setNewNumber('')
    }).catch(error => {
      setMessage(error.response.data.error)
      setTimeout(() => {setMessage('')}, 2000)
      setNewName('')
      setNewNumber('')
    })
    }
  }

  const deleteNumber = (id) => {
    const toBeDeletedPerson = persons.find(p => p.id === id)
    const result = window.confirm(`delete ${toBeDeletedPerson.name}`)

    if (result) {
      var array = [...persons]; //got the removal from array form StackOverflow, not sure this is the best way, but at least it works.
      var personIndex = persons.indexOf(toBeDeletedPerson);
      if (personIndex !== -1) { // dont really like the second if statement here, might cause issues
        array.splice(personIndex, 1)
      }
    personsService.deletePerson(id).then(
        setPersons(array)
      )
      setMessage(`person '${toBeDeletedPerson.name}' has been deleted`)
      setTimeout(() => {setMessage('')}, 2000)
   }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterName(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} newName={newName}/>
      <SearchFilter handleFilter={handleFilter}/>
      <h2>add a new</h2>
      <PersonForm newName={newName}
                  newNumber={newNumber}
                  addPerson={addPerson} 
                  handleNameChange={handleNameChange}
                  handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Numbers persons={persons} filterName={filterName} deleteNumber={deleteNumber}/>
    </div>
  )
}

export default App