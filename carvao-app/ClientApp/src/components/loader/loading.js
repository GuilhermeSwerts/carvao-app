import React, { Component } from 'react';
import './loading.css';

export class Loading extends Component {
    render() {

        if (typeof (window.waitbool) == 'undefined')
            window.waitbool = true;

        window.Wait = function (showit) {
            if (showit != undefined) window.waitbool = !showit;
            window.waitbool = !window.waitbool;

            if (document.getElementById('loadingpanel') != null) {

                if (window.waitbool)
                    document.getElementById('loadingpanel').style.display = 'block';
                else {
                    document.getElementById('loadingpanel').style.display = 'none';
                }
            }
            return window.waitbool;
        }

        return (
            <div id="loadingpanel" className='loadingBg' style={{ display: 'none' }} >
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }
}