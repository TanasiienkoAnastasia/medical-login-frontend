import React from 'react';
import { useLoading } from '../context/LoadingContext';
import './GlobalSpinner.css';

const GlobalSpinner = () => {
    const { loading } = useLoading();

    if (!loading) return null;

    return (
        <div className="spinner-overlay">
            <div className="spinner" />
        </div>
    );
};

export default GlobalSpinner;
