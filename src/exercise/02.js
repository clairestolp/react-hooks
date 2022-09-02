// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// Extra Credit 3 & 4
function useLocalStorageState(
  key, 
  defaultValue='', 
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  if(!key) throw new Error('useLocalStorageState must be initialized with a key');

  const [value, setValue] = React.useState(() => {
    const storedValue = window.localStorage.getItem(key);
    if(storedValue){
      return deserialize(storedValue);
    }
    return typeof defaultValue === 'function'? defaultValue() : defaultValue
  })

  React.useEffect(() => {
    if(value){
      const serializedValue = serialize(value);
      window.localStorage.setItem(key, serializedValue);
    }
  }, [key, value, serialize])

  return [value, setValue]
}

function Greeting(initialName = '') {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  // const [name, setName] = React.useState(() => window.localStorage.getItem('name')|| initialName)

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  // React.useEffect(() => {
  //   window.localStorage.setItem('name', name);
  // },[name])

  // Extra Credit 3
  const [name, setName] = useLocalStorageState('name');
  const [favoriteNumber, setFavoriteNumber] = useLocalStorageState('favoriteNumber')

  function handleChangeName(event) {
    setName(event.target.value)
  }

  function handleChangeFavoriteNumber(event){
    setFavoriteNumber(Number(event.target.value))
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChangeName} id="name" />
        <br/><br/>
        <label htmlFor="favoriteNumber">Favorite Number: </label>
        <input value={favoriteNumber} onChange={handleChangeFavoriteNumber} id={favoriteNumber}/>
      </form>
      <br/><br/>
      {name ? <strong>Hello {name}!</strong> : 'Please type your name'}
      <br/>
      {favoriteNumber ? <strong>{favoriteNumber} is your favorite number!</strong> : ' I don\'t know your favorite number'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
