/**
 * =============================================================================
 * GC GRUPO COMERCIAL - DATAGUARD & VOLATILITY ENGINE
 * Archivo: frontend/security/data-guard.js
 * =============================================================================
 */
(function (global) {
    'use strict';

    const ANCHOR_ID = 'gc-bcv-anchor';

    function triggerSecurityLock(code, message) {
        document.body.innerHTML = `
            <div style="background:#0F172A; color:#FF0055; height:100vh; display:flex; flex-direction:column; justify-content:center; align-align:center; text-align:center; font-family:sans-serif; padding:2rem;">
                <h1 style="font-size:2rem;">🛡️ DATAGUARD LOCKDOWN</h1>
                <p style="color:#FFF;">[${code}]: ${message}</p>
                <p style="color:#94A3B8; font-size:0.9rem;">Transacciones suspendidas por seguridad.</p>
            </div>
        `;
        throw new Error(`[DataGuard Lockdown] ${code}: ${message}`);
    }

    function fetchValidatedRate() {
        const anchor = document.getElementById(ANCHOR_ID);
        if (!anchor) {
            triggerSecurityLock('NO_ANCHOR', 'El ancla de seguridad en frontend/security/ no está montada.');
        }

        const rate = parseFloat(anchor.getAttribute('data-rate'));
        if (isNaN(rate) || rate <= 0) {
            triggerSecurityLock('INVALID_RATE', 'La tasa obtenida en el ancla no es válida.');
        }

        return rate;
    }

    const DataGuardEngine = {
        usdToBs: function (usdAmount) {
            const rate = fetchValidatedRate();
            const cleanUSD = this.sanitizeNumber(usdAmount, 'USD');
            return Math.round((cleanUSD * rate + Number.EPSILON) * 100) / 100;
        },

        bsToUsd: function (bsAmount) {
            const rate = fetchValidatedRate();
            const cleanBs = this.sanitizeNumber(bsAmount, 'Bs');
            return Math.round((cleanBs / rate + Number.EPSILON) * 100) / 100;
        },

        sanitizeNumber: function (val, label) {
            const n = Number(val);
            if (isNaN(n) || !isFinite(n) || n < 0) {
                triggerSecurityLock('CORRUPT_DATA', `Valor inválido para ${label}: ${val}`);
            }
            return n;
        },

        validateIntegerStock: function (units, label) {
            const n = Number(units);
            if (!Number.isInteger(n) || n < 0) {
                triggerSecurityLock('STOCK_NOT_INTEGER', `El stock de ${label} debe ser entero positivo. Valor: ${units}`);
            }
            return n;
        }
    };

    global.DataGuard = Object.freeze(DataGuardEngine);
})(typeof window !== 'undefined' ? window : this);