import ErrorReducer from '../../reducers/ErrorReducer'
import * as ErrorActions from '../ErrorActions'

describe('ErrorActions', () => {
  it('Sets and clears error messages', () => {
    const state1 = ErrorReducer(undefined, {type : '_'})
    expect(state1.msg).toBeNull()

    const state2 = ErrorReducer(state1, ErrorActions.setError('Error!'))
    expect(state2.msg).toBe('Error!')

    const state3 = ErrorReducer(state2, ErrorActions.clearError)
    expect(state3.msg).toBeNull()
  })

  it('Sets an error if the `error` field is set to `true`', () => {
    const state1 = ErrorReducer(undefined, {type : '_'})
    expect(state1.msg).toBeNull()

    const state2 = ErrorReducer(state1, {type : '___ACTION___', error : true, payload : 'error message'})
    expect(state2.msg).toBe('error message')
  })

})

