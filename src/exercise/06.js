// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

// class ErrorBoundary extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = { error: null, hasError: null }
//   }

//   static getDerivedStateFromError(error) {
//     console.log('bla: error', error.message);
//     return {hasError: true, error}
//   }
//   componentDidCatch(error, errorInfo){
//     console.log('bla: error, errorInfo', error, errorInfo);
//     this.setState({error: error, errorInfo: errorInfo})
//   }

//   render(){
//     if(this.state.hasError) return <div role='alert'>There was an error: <pre style={{whitespace: 'normal'}}>{this.state.error.message}</pre></div>
//     return this.props.children;
//   }
// }

// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
const initialPokemonState = {
  data: null,
  status: 'idle',
  error: null,
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState(initialPokemonState)
  // const [error, setError] = React.useState(null);
  // const [status, setStatus] = React.useState('idle');


  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  React.useEffect(() => {
    if(!pokemonName) return;
    setPokemon({
      data: null,
      status: 'pending',
      error: null,
    });
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemon({
          data: pokemonData,
          status: 'resolved',
          error: null,
        })
      })
      .catch(error => {
        setPokemon({
          data: null,
          status: 'rejected',
          error: error
        })
      })
  }, [pokemonName]);


  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  if(pokemon.status === 'rejected') throw pokemon.error
  return (
    <div>
      {!pokemonName && 'Submit a pokemon'}
      {pokemon.status === 'pending' && <PokemonInfoFallback name={pokemonName} />}
      {pokemon.data && <PokemonDataView pokemon={pokemon.data} />}
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
      <div className="pokemon-info-app">
        <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
        <hr />
        <div className="pokemon-info">
          <ErrorBoundary resetKeys={[pokemonName]} FallbackComponent={({error}) => {
            return <div role='alert'>There was an error: <pre style={{whitespace: 'normal'}}>{error.message}</pre></div>
          }}>
            <PokemonInfo pokemonName={pokemonName} />
          </ErrorBoundary>
        </div>
      </div>
  )
}

export default App
