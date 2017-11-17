import firebase from 'firebase/app'
import { call, put, takeLatest, select } from 'redux-saga/effects'
import { push } from 'redux-little-router'

import user from 'redux/data/user'

function* signin() {
  const provider = yield new firebase.auth.GoogleAuthProvider()
  yield call(() => firebase.auth().signInWithPopup(provider))
}

function* signout() {
  yield call(() => firebase.auth().signOut())
  yield put(push('/'))
}

function* signedIn({
  uid, displayName, email, photoURL,
}) {
  // set auth initialized and authenticated
  yield put({ type: 'FIREBASE_INITIALIZED' })
  yield put({ type: 'FIREBASE_AUTHENTICATED', payload: true })

  // set the user data
  yield put(user.set({
    uid,
    displayName,
    email,
    photoURL,
  }))

  // go to the next url if exists
  const { next } = yield select(state => state.router.query)
  if (next) {
    yield put(push(next))
  }
}

function* signedOut() {
  yield put({ type: 'FIREBASE_INITIALIZED' })
  yield put({ type: 'FIREBASE_AUTHENTICATED', payload: false })
  yield put(user.reset())
}

export default function* authSaga() {
  yield takeLatest('SIGN_IN', action => signin(action.payload))
  yield takeLatest('SIGN_OUT', signout)
  yield takeLatest(({ type, payload }) => type === 'ON_AUTH_STATE_CHANGED' && !payload, signedOut)
  yield takeLatest(
    ({ type, payload }) => type === 'ON_AUTH_STATE_CHANGED' && payload,
    action => signedIn(action.payload),
  )
}