export const CELSIUS_TEMP_UNIT = "Celsius"
export const FAHRENHEIT_TEMP_UNIT = "Fahrenheit"
export const KELVIN_TEMP_UNIT = "Kelvin"

export default function convertTemperature(kelvin, mode) {
    switch (mode) {
        case CELSIUS_TEMP_UNIT:
            return Math.round((kelvin - 273.15) * 100) / 100
        case FAHRENHEIT_TEMP_UNIT:
            return Math.round(((kelvin - 273.15) * 9/5 + 32) * 100) / 100
        default:
            return kelvin
    }
}