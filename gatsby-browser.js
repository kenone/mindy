import React from 'react'
import { StitchAuthProvider } from './src/Auth/StitchAuth'
import PropTypes from 'prop-types'
import GlobalStyles from './src/components/Global/GlobalStyles'
import { ThemeProvider } from 'emotion-theming'
import { ExperiencesProvider } from './src/hooks/useExperiences'
import { themes } from './src/Styles'

const theme = themes.dark

export const wrapPageElement = ({ element }) => {
  return (
    <StitchAuthProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ExperiencesProvider>{element}</ExperiencesProvider>
      </ThemeProvider>
    </StitchAuthProvider>
  )
}

wrapPageElement.propTypes = {
  element: PropTypes.element.isRequired,
}
