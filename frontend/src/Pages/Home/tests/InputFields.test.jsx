import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputFields from '../components/InputFields';

describe('InputFields', () => {
    beforeEach(() => {
        render(<InputFields />);
    })
    it('TEST 1: should render the form with the city input mode selected by default', () => {
        const cityRadio = screen.getByLabelText('City');
        const coordsRadio = screen.getByLabelText('Coordinates');

        const cityinput = screen.getByTestId("cityinput")
        const latinput = screen.queryByTestId("latinput")
        const loninput = screen.queryByTestId("loninput")

        expect(cityRadio).toBeChecked()
        expect(cityinput).toBeInTheDocument()
        expect(latinput).toBeNull()
        expect(loninput).toBeNull()
    });    
    it('TEST 2: should update the city input value when text is entered in city mode', () => {
        const cityinput = screen.getByTestId("cityinput")
        fireEvent.change(cityinput, { target: { value: 'London' } });

        console.dir(cityinput)
        expect(cityinput.value).toBe('London');
    });
    it("TEST 3: shold update lon and lat", () => {
        const coordsRadio = screen.getByLabelText('Coordinates');
        
        fireEvent.click(coordsRadio)

        const latinput = screen.getByTestId("latinput")
        const loninput = screen.getByTestId("loninput")
        expect(loninput).toBeInTheDocument()
        expect(latinput).toBeInTheDocument()
        fireEvent.change(latinput, { target: { value: 67.7 } });
        fireEvent.change(loninput, { target: { value: 12.98 } });

        expect(latinput.value).toBe("67.7");
        expect(loninput.value).toBe("12.98");
    })
});
