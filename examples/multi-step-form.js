
/**
 * Multi-step lead generation form
 *
 * Handles the transition between two form steps
 * based on the selected debt amount.
 */

document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.bankrot-form').forEach(function (formWrap) {

    const step1 = formWrap.querySelector('.step1');
    const step2 = formWrap.querySelector('.step2');
    const nextBtn = formWrap.querySelector('.debt-next');
    const debtInput = formWrap.querySelector('input[name="debt"]');

    // Check required elements.
    if (!step1 || !step2 || !nextBtn || !debtInput) {
      return;
    }

    // Handle the transition to the second step.
    nextBtn.addEventListener('click', function () {

      const debtValue = debtInput.value.trim();
      const debt = Number(debtValue);

      // Validate the selected debt amount.
      if (
        debtValue === '' ||
        !Number.isFinite(debt) ||
        debt < 10000
      ) {
        debtInput.focus();
        return;
      }

      // Display the contact information form.
      step1.style.display = 'none';
      step2.style.display = 'block';

    });

  });

});
