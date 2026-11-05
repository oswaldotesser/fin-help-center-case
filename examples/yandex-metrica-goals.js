
document.addEventListener('DOMContentLoaded', function () {

  // Replace with your Yandex Metrica counter ID
  const METRIKA_ID = 12345678;

  // =========================
  // CTA buttons
  // =========================

  const topBtn = document.getElementById('cta_top');
  const middleBtn = document.getElementById('cta_middle');
  const bottomBtn = document.getElementById('cta_bottom');

  if (topBtn) {
    topBtn.addEventListener('click', function () {
      if (typeof ym === 'function') {
        ym(METRIKA_ID, 'reachGoal', 'cta_top');
        console.log('goal cta_top sent');
      }
    });
  }

  if (middleBtn) {
    middleBtn.addEventListener('click', function () {
      if (typeof ym === 'function') {
        ym(METRIKA_ID, 'reachGoal', 'cta_middle');
        console.log('goal cta_middle sent');
      }
    });
  }

  if (bottomBtn) {
    bottomBtn.addEventListener('click', function () {
      if (typeof ym === 'function') {
        ym(METRIKA_ID, 'reachGoal', 'cta_bottom');
        console.log('goal cta_bottom sent');
      }
    });
  }


  // =========================
  // CF7 successful submission
  // =========================

  document.addEventListener('wpcf7mailsent', function () {

    console.log('CF7 form successfully sent');

    // Mark successful form submission
    sessionStorage.setItem('form_submit_success', '1');

    if (typeof ym === 'function') {

      ym(METRIKA_ID, 'reachGoal', 'form_submit', {}, function () {

        console.log('goal form_submit sent');

        // Redirect after the Metrica callback
        window.location.href = '/spasibo/';
      });

      // Fallback redirect if the callback does not fire
      setTimeout(function () {
        if (window.location.pathname !== '/spasibo/' &&
            window.location.pathname !== '/spasibo') {
          window.location.href = '/spasibo/';
        }
      }, 2000);

    } else {

      // Redirect even if Yandex Metrica is unavailable
      window.location.href = '/spasibo/';
    }

  }, false);


  // =========================
  // Protect /spasibo/
  // =========================

  function protectThankYouPage() {

    const path = window.location.pathname.replace(/\/+$/, '');

    if (path !== '/spasibo') {
      return;
    }

    const accessGranted = sessionStorage.getItem('form_submit_success');

    if (accessGranted === '1') {

      console.log('Thank-you page access granted');

      // Allow one-time access
      sessionStorage.removeItem('form_submit_success');

    } else {

      console.log('Direct access to /spasibo blocked');

      // Block direct access without successful submission
      window.location.replace('/');
    }
  }

  // Check on normal page load
  protectThankYouPage();

  // Recheck only when the page is restored from BFCache
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      protectThankYouPage();
    }
  });

});
