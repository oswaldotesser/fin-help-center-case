
document.addEventListener('DOMContentLoaded', function () {

  // Replace with your Yandex Metrica counter ID
  const METRIKA_ID = 12345678;
  const CF7_FORM_ID = '7';

  let redirectTimer = null;
  let redirectStarted = false;

  // =========================
  // CTA buttons
  // =========================

  const ctaButtons = [
    { id: 'cta_top', goal: 'cta_top' },
    { id: 'cta_middle', goal: 'cta_middle' },
    { id: 'cta_bottom', goal: 'cta_bottom' }
  ];

  ctaButtons.forEach(function (button) {

    const element = document.getElementById(button.id);

    if (element) {
      element.addEventListener('click', function () {

        if (typeof ym === 'function') {
          ym(METRIKA_ID, 'reachGoal', button.goal);
          console.log('Goal triggered:', button.goal);
        }

      });
    }

  });


  // =========================
  // Thank-you page redirect
  // =========================

  function redirectToThankYouPage() {

    if (redirectStarted) {
      return;
    }

    redirectStarted = true;

    if (redirectTimer !== null) {
      clearTimeout(redirectTimer);
    }

    window.location.href = '/spasibo/';
  }


  // =========================
  // CF7 successful submission
  // =========================

  document.addEventListener('wpcf7mailsent', function (event) {

    // Process only the specified Contact Form 7 form.
    if (
      !event.detail ||
      String(event.detail.contactFormId) !== CF7_FORM_ID
    ) {
      return;
    }

    console.log('CF7 form successfully sent');

    // Mark successful form submission
    sessionStorage.setItem('form_submit_success', '1');

    if (typeof ym === 'function') {

      ym(METRIKA_ID, 'reachGoal', 'form_submit', {}, function () {

        console.log('Goal form_submit sent');

        // Redirect after the Metrica callback
        redirectToThankYouPage();

      });

      // Fallback redirect if the callback does not fire
      redirectTimer = setTimeout(function () {
        redirectToThankYouPage();
      }, 2000);

    } else {

      // Redirect even if Yandex Metrica is unavailable
      redirectToThankYouPage();

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
