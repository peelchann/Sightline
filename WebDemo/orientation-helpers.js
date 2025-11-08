// Sightline WebAR - Orientation Helper Functions

function showCalibrationWarning() {
  const warning = document.getElementById('calibration-warning');
  if (warning) {
    warning.classList.remove('hidden');
  } else {
    // Create warning if it doesn't exist
    const div = document.createElement('div');
    div.id = 'calibration-warning';
    div.className = 'calibration-toast';
    div.innerHTML = `
      <span>🧭</span>
      <span>Compass low confidence—move phone in a figure-8 to calibrate</span>
    `;
    document.body.appendChild(div);
  }
}

function hideCalibrationWarning() {
  const warning = document.getElementById('calibration-warning');
  if (warning) {
    warning.classList.add('hidden');
  }
}

