'use client';
export const Toast = ({ message, type, id }) => {
    return (
        <div className={`toast ${type}`} id={id}>{message}</div>
    );
}
