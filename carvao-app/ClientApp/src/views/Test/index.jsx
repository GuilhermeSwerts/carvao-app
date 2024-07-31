import React, { useEffect } from 'react';

function Teste() {

    useEffect(() => {
    }, [1])

    return (
        <div className="content">
            <h1>Olá Mundo!</h1>
        </div>
    );
}

export default Teste;