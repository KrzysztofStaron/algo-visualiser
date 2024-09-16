# How to add new Component:

- add the resetfunction to reset()
- add the sync function to sync()
- add the components history to calcLen()
- add handler to page.tsx
- render in if-else hell
- Add the component the ComponentType enum
- Register the component

# Array<Array< type >>

This creates history array of type

# Main

`register (component: ComponentType, metadata?: any) ` - abstracts setup of component and returns it's id in _histories arrays_

`sync` - makes sure every single timeline is the same length, by duplicating old values

`calcLen` - return length of the longest timeline

# synchronize?: boolean

if this value is false, the `sync` function won't be called

You just edit history of components, and then render them and pass index in the array and curretnt frame number

# Code execution

The only allowed method of interaction with api is creation of object and adding next timeframes to their state.

Code executes -> timeline is updated -> visualization

Visualization works by iterating thorught timeline by incrasing the `frame` state. It stops when frame is equail to length of history

# Api

You provide a function that returns an object with exposed methods to create frames

The functions knows what's up because `register` returns id, adn the object saves it in it's state, then methods use it to add new timeframes to correct timeline
Providing type is not requred, because every component type has it's own timeline arrays.
