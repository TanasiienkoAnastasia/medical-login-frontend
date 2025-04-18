import React from 'react';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const DashboardPage = ({ user, onLogout, onViewPatients }) => {
    if (!user) return null;

    return user.specialty ? (
        <DoctorDashboard
            onViewPatients={onViewPatients}
            onLogout={onLogout}
        />
    ) : (
        <PatientDashboard
            patient={user}
            onLogout={onLogout}
        />
    );
};

export default DashboardPage;
