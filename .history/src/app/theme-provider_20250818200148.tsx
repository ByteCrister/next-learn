'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
