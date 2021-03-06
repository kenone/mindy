import styles from '@styling'
import styled from '@emotion/styled'
const Section = styled.section``
const Experience = styled.article`
  background: black;
  padding: ${styles.space.m};
  margin-bottom: ${styles.space.m};
  margin-left: -${styles.space.m};
  margin-right: -${styles.space.m};
  @media (min-width: ${styles.breakpoints.s}) {
    padding: ${styles.space.l};
    margin-left: 0;
    margin-right: 0;
  }
`

const DateText = styled.span`
  font-weight: ${styles.font.fontWeights.bold};
  display: block;
`
const Categories = styled.span`
  display: block;
  font-style: italic;
`

const TopGroup = styled.div`
  display: flex;
  justify-content: space-between;
`

const Center = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const NoStories = styled.p`
  text-align: center;
  font-size: 18px;
  margin-top: 40px;
`

export default {
  Section,
  Experience,
  DateText,
  Categories,
  TopGroup,
  Center,
  NoStories,
}
