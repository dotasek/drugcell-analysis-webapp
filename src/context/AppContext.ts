import React, { useState, createContext } from 'react'
import AppConfig from '../model/AppConfig';

const AppContext = 
  React.createContext<Partial<AppConfig>>({});

export default AppContext