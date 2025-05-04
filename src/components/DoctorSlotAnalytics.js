import React, { useEffect, useState } from 'react';
import axios from "axios";
import API_BASE_URL from "../config/api";
import styled from "styled-components";

const Panel = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const DoctorSlotAnalytics = ({ doctorId }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`${API_BASE_URL}/doctor/${doctorId}/slot-analytics`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setStats(res.data.data))
            .catch(err => console.error('Не вдалося отримати аналітику', err));
    }, [doctorId]);

    if (!stats) return null;

    return (
        <Panel>
            <h3>📊 Статистика слотів</h3>
            <p><strong>Вільно сьогодні:</strong> {stats.free_today}</p>
            <h4>⏱ Найпопулярніші слоти:</h4>
            <ul>
                {stats.top_slots.map(([slot, count]) => (
                    <li key={slot}>{slot} — {count} записів</li>
                ))}
            </ul>
        </Panel>
    );
};

export default DoctorSlotAnalytics;
