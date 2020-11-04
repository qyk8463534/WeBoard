const initialData = {
    cards: {
      'card-1': { id: 'card-1', content: 'Take out the garbage' },
      'card-2': { id: 'card-2', content: 'Watch my favorite show' },
      'card-3': { id: 'card-3', content: 'Charge my phone' },
      'card-4': { id: 'card-4', content: 'Cook dinner' }
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        cardIds: ['card-1', 'card-2', 'card-3', 'card-4']
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        cardIds: []
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        cardIds: []
      }
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2', 'column-3','column-4','column-5','column-6']
  }
  
  export default initialData
  