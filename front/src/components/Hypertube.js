import React, { Component } from 'react'
import SearchBar from './SearchBar'
import Filters from './Filters'
import List from './List';
import { connect } from 'react-redux';
import { moviesActions } from '../actions';

const Hypertube = () => (
    <div>
        <SearchBar />
        <Filters />
        <List />
    </div>
);

export default Hypertube;


