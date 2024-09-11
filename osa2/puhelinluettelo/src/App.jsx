import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    };
    const person = persons.find(p => p.name === newName);
    if (person) {
      if (person.number === newNumber) {
        alert(`${newName} is already added to phonebook`);
        setNewName(''); 
        setNewNumber('')
        return;
      }
      if (person.number !== newNumber) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const updatedNumber = { ...person, number: newNumber };
          personService
            .update(person.id, updatedNumber)
              .then(returnedPerson => {
                setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
                setNewName(''); 
                setNewNumber('')
                setMessage({
                  text :`Updated ${returnedPerson.name}`,
                  type: 'success'
              })
                setTimeout(() => {
                  setMessage(null)
                }, 2000)
              }) 
              .catch(error => {
                setMessage({
                  text: `Information of ${person.name} has already been removed from server`,
                  type: 'error'
              })
                setTimeout(() => {
                  setMessage(null)
                }, 2000)
              }) 
        }
      }  
    }
    else {
      personService
        .create(nameObject)
          .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage({
            text: `Added ${returnedPerson.name}`,
            type: 'success'
          })
          setTimeout(() => {
            setMessage(null)
          }, 2000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  } 
  const handlePersonsChange = (event) => {
    setFilter(event.target.value);
  }
  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id));
      })
      setMessage({
        text: `Deleted ${person.name}`,
        type:'success'
      })
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    }
  }
  const filterPersons = ()=> {
    return persons.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase()));
  };
  const personsToShow = filter ? filterPersons() : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handlePersonsChange={handlePersonsChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete}/>
    </div>
    
  )
}

const Filter = ({ filter, handlePersonsChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handlePersonsChange} />
    </div>
  );
};

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input 
        value = {newName}
        onChange={handleNameChange}
      />
      </div>
      <div>
        number: <input 
        value = {newNumber}
        onChange={handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({persons, handleDelete}) => {
  return (
    <div>
        {persons.map((person) => (
          <Person key={person.name} person={person} handleDelete={handleDelete}/>
        ))}
      </div>
  )
}

const Person = ({person, handleDelete}) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </div>
  )
}

const Notification = ({ message}) => {
  if (message === null) {
    return null
  }
  const notificationClass = message.type === 'success' ? 'success' : 'error';
  return (
    <div className={notificationClass}>
      {message.text}
    </div>
  )
}
export default App