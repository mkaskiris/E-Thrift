/**
 * @jest-environment jsdom
 */
 import axios from 'axios';
 jest.mock('axios');
 
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import {Search} from '../index';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('search', ()=>{

    test('renders', ()=>{
        render(<Search />)
    })
})