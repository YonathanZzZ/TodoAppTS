import {PaletteMode} from "@mui/material";
import {ThemeOptions, createTheme} from "@mui/material/styles";

declare module '@mui/material/styles' {
    interface Palette {
        delete: Palette['primary'];
    }

    interface PaletteOptions {
        delete?: PaletteOptions['primary'];
    }
}

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        ...(mode === 'light'
        ? {
            //palette values for light mode
                primary: {
                    main: "#26577C"
                },

                delete: {
                    main: "#b90000"
                },

                background: {
                    default: "#FFFFFF"
                },

                text: {
                    primary: "#000000"
                }
            } : {
            //palette values for dark mode
                primary: {
                    main: "#1688d8",
                },

                delete: {
                    main: "#b90000"
                },

                background: {
                    default: "#2b2b2b"
                },

                text: {
                    primary: "#FFFFFF"
                }
            })
    }
});

export const getMUITheme = (mode : PaletteMode) => {
    return createTheme(getDesignTokens(mode));
}
