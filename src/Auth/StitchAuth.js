import React, { useEffect } from "react"
import PropTypes from "prop-types"
import {
  hasLoggedInUser,
  loginGoogle,
  loginAnonymous,
  logoutCurrentUser,
  getCurrentUser,
  addAuthenticationListener,
  removeAuthenticationListener,
  handleOAuthRedirects,
} from "./stitch/authentication"

const StitchAuthContext = React.createContext()

export const providers = {
  google: "google",
  anonymous: "anonymous",
}

export function useStitchAuth() {
  const context = React.useContext(StitchAuthContext)
  if (!context) {
    throw new Error(`useStitchAuth must be used within a StitchAuthProvider`)
  }
  return context
}

// Create a component that controls auth state and exposes it via
// the React Context
export function StitchAuthProvider(props) {
  const [authState, setAuthState] = React.useState({
    isLoggedIn: hasLoggedInUser(),
    currentUser: getCurrentUser(),
  })

  useEffect(() => {
    const authListener = {
      onUserLoggedIn: (auth, loggedInUser) => {
        if (loggedInUser) {
          setAuthState(authState => ({
            ...authState,
            isLoggedIn: true,
            currentUser: loggedInUser,
          }))
        }
      },
      onUserLoggedOut: (auth, loggedOutUser) => {
        setAuthState(authState => ({
          ...authState,
          isLoggedIn: false,
          currentUser: null,
        }))
      },
    }
    addAuthenticationListener(authListener)
    setAuthState(state => ({ ...state }))
    handleOAuthRedirects()
    return () => {
      removeAuthenticationListener(authListener)
    }
  }, [])

  // Authentication Actions
  const handleLogin = async provider => {
    if (!authState.isLoggedIn) {
      switch (provider) {
        case providers.google:
          return loginGoogle()
        case providers.anonymous:
          return loginAnonymous()
        default:
          return {}
      }
    }
  }
  const handleLogout = async () => {
    const { isLoggedIn } = authState
    if (isLoggedIn) {
      await logoutCurrentUser()
      setAuthState({
        ...authState,
        isLoggedIn: false,
        currentUser: null,
      })
    } else {
      console.log(`can't handleLogout when no user is logged in`)
    }
  }

  // useMemo to improve performance by eliminating some re-renders
  const authInfo = React.useMemo(() => {
    const { isLoggedIn, currentUser } = authState
    const value = {
      isLoggedIn,
      currentUser,
      actions: { handleLogin, handleLogout },
    }
    return value
  }, [authState.isLoggedIn])
  return (
    <StitchAuthContext.Provider value={authInfo}>
      {props.children}
    </StitchAuthContext.Provider>
  )
}
StitchAuthProvider.propTypes = {
  children: PropTypes.element,
}
