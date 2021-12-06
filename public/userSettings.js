function updateDmParticpateRadio() {
    function updateDisplay(id) {
        const radio = document.getElementById(id);
        const details = document.getElementById(`${id}_details`);
        details.style.display = radio.checked ? "block" : "none";
    }

    updateDisplay("dm_participate_direct");
    updateDisplay("dm_participate_proxy");
    document.getElementById('dm_send_emails').checked = !document.getElementById('dm_participate_no').checked;
}

function clickDmSendEmails() {
    const newChecked = document.getElementById('dm_send_emails').checked;

    if (newChecked) {
        // Can't enable receiving emails when dm_participate_no enabled
        document.getElementById('dm_send_emails').checked = false;
    } else {
        document.getElementById('dm_participate_no').checked = true;
        document.getElementById('dm_send_emails').checked = false;
        updateDmParticpateRadio();
    }
}

function syncWantsProxy() {
    const checkbox = document.getElementById("wants_proxy");
    const details = document.getElementById(`wants_proxy_details`);
    details.style.display = checkbox.checked ? "block" : "none";
}

// Attach listeners
document.addEventListener('DOMContentLoaded', function () {
    syncWantsProxy();
    Array.from(document.getElementsByClassName('onclick-dm-particpate-radio')).forEach(element => {
        element.addEventListener('change', updateDmParticpateRadio);
    });
    
    document.getElementById('dm_send_emails').addEventListener('click', clickDmSendEmails);
    document.getElementById('wants_proxy').addEventListener('click', syncWantsProxy);
});