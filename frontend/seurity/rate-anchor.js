/**
 * =============================================================================
 * GC GRUPO COMERCIAL - AUTONOMOUS RATE ANCHOR INJECTOR
 * Archivo: frontend/security/rate-anchor.js
 * =============================================================================
 */
(function (global) {
    'use strict';

    const ANCHOR_ID = 'gc-bcv-anchor';

    const RateAnchorManager = {
        /**
         * Monta el ancla de tasa en el DOM de forma autónoma.
         * Se ejecuta de forma aislada sin depender del maquetado del Sidebar.
         */
        mountAnchor: function (rateValue, timestampIso) {
            let anchor = document.getElementById(ANCHOR_ID);

            if (!anchor) {
                anchor = document.createElement('div');
                anchor.id = ANCHOR_ID;
                // Oculto para la vista si se desea, o con estilo fijo independiente
                anchor.style.cssText = 'display:none !important; visibility:hidden !important;';
                document.body.appendChild(anchor);
            }

            anchor.setAttribute('data-rate', rateValue.toString());
            anchor.setAttribute('data-timestamp', timestampIso);
            anchor.setAttribute('data-status', 'VERIFIED');
            
            // Congelar el elemento en memoria si es posible
            Object.freeze(anchor);
        }
    };

    global.GCRateAnchor = Object.freeze(RateAnchorManager);
})(typeof window !== 'undefined' ? window : this);