function updateDmParticpateRadio() {
    function updateDisplay(id) {
        const radio = document.getElementById(id);
        const details = document.getElementById(`${id}_details`);
        details.style.display = radio.checked ? "block" : "none";
    }

    updateDisplay("dm_participate_direct");
    updateDisplay("dm_participate_proxy");
}

// Attach listeners
document.addEventListener('DOMContentLoaded', function () {
    Array.from(document.getElementsByClassName('onclick-dm-particpate-radio')).forEach(element => {
        element.addEventListener('change', updateDmParticpateRadio);
    });
});