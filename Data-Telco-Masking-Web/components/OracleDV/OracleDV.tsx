'use client'
import React, { useEffect } from 'react';

function OracleDV() {
  useEffect(() => {
    // Load Oracle DV scripts when the component mounts
    const script = document.createElement('script');
    script.src = 'https://telcochurnrateanalytics-axh6y0wqdorr-px.analytics.ocp.oraclecloud.com/public/dv/v1/embedding/standalone/embedding.js';
    script.type = 'application/javascript';
    script.async = true;
    script.onload = () => {
      // Once the script is loaded, initialize Oracle DV
      require(['knockout', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojcomposite', 'jet-composites/oracle-dv/loader'], (ko) => {
        ko.applyBindings();
      });
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <oracle-dv project-path="/@Catalog/users/a01659198@tec.mx/TELCO_DATA_ANALYSIS" active-page="canvas" active-tab-id="4">
      </oracle-dv>
    </div>
  );
}

export default OracleDV;

