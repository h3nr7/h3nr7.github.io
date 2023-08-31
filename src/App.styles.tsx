import styled from 'styled-components'

export interface MediaSize {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
}
  
const size: MediaSize = {
    xs: '400px', // for small screen mobile
    sm: '600px', // for mobile screen
    md: '900px', // for tablets
    lg: '1280px', // for laptops
    xl: '1440px', // for desktop / monitors
    xxl: '1920px', // for big screens
}

export const device = {
    xs: `(max-width: ${size.xs})`,
    sm: `(max-width: ${size.sm})`,
    md: `(max-width: ${size.md})`,
    lg: `(max-width: ${size.lg})`,
    xl: `(max-width: ${size.xl})`,
    xxl: `(max-width: ${size.xxl})`,
}

export const AppContainer = styled.div`
    display: flex;
    position: fixed;
    flex-direction: column;
    align-items: stretch;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
`